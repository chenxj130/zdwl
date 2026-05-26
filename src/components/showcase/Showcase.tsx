import React, { useRef, useEffect, useState } from "react";
import styles from "./Showcase.module.css";
import cooker300Img from "../../assets/cooker-300-clean.png";
import cooker350Img from "../../assets/cooker-350-clean.png";
import cooker600Img from "../../assets/cooker-600-clean.png";
import PlasmaText from "../plasma-text/PlasmaText";

interface ProductStat {
  label: string;
  highlight: string;
  text: string;
  fullWidth?: boolean;
}

interface ProductCase {
  id: number;
  model: string;
  title: string;
  description: string;
  stats: ProductStat[];
  image: string;
  imageAlt?: string;
  videoUrl?: string;
  audioUrl?: string;
}

interface ShowcaseProps {
  data: {
    eyebrow: string;
    title: string;
    products: ProductCase[];
  };
  lang?: "zh" | "en";
}

/**
 * 产品展示组件
 * 支持由右向左的无缝匀速自动平移，支持鼠标悬停时暂停滚动并平滑放大，
 * 同时也支持点击左右箭头手动精准平滑切换产品页。
 */
const Showcase: React.FC<ShowcaseProps> = ({ data, lang = "zh" }) => {
  // 相对路径适配工具函数，用于解决 file:// 协议绝对路径寻址 Bug
  const resolveImagePath = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    if (path.startsWith("/")) {
      return path.slice(1);
    }
    return path;
  };

  // 智能图片自适应解析与防御性降级映射，防止后台本地相对路径在构建版本中 404
  const getFinalImgSrc = (path: string, defaultId: number) => {
    if (!path) return defaultImages[defaultId] || defaultImages[1];
    
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    
    const lowerPath = path.toLowerCase();
    if (lowerPath.includes("cooker-300") || lowerPath.includes("cooker300")) {
      return cooker300Img;
    }
    if (lowerPath.includes("cooker-350") || lowerPath.includes("cooker350")) {
      return cooker350Img;
    }
    if (lowerPath.includes("cooker-600") || lowerPath.includes("cooker600")) {
      return cooker600Img;
    }
    
    return resolveImagePath(path) || defaultImages[defaultId] || defaultImages[1];
  };

  // 图片兜底字典：当后台未上传新图片时，自动降级渲染本地优美的 3D 产品渲染图
  const defaultImages: Record<number, string> = {
    1: cooker300Img,
    2: cooker350Img,
    3: cooker600Img
  };

  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleAudio = (audioUrl: string) => {
    if (playingAudioUrl === audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingAudioUrl(null);
    } else {
      const resolvedUrl = resolveImagePath(audioUrl);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = resolvedUrl;
      } else {
        audioRef.current = new Audio(resolvedUrl);
      }
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
      });
      setPlayingAudioUrl(audioUrl);

      audioRef.current.onended = () => {
        setPlayingAudioUrl(null);
      };
    }
  };

  const handleOpenVideo = (videoUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingAudioUrl(null);
    setActiveVideoUrl(videoUrl);
  };

  const handleCloseVideo = () => {
    setActiveVideoUrl(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseVideo();
      }
    };
    if (activeVideoUrl) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoUrl]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const productData = data?.products || [];
  // NOTE: 克隆三份，方便向左、向右无限无缝滚动和折返
  const tripleProducts = [...productData, ...productData, ...productData];

  // NOTE: 用 state 存储是否移动端，监听 resize 事件，防止在手机模拟器中布局不准确
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // 监听移动端容器的滚动事件以更新活跃圆点索引
  const handleContainerScroll = () => {
    const container = scrollRef.current;
    if (container && isMobile) {
      const scrollLeft = container.scrollLeft;
      const mobileCardStep = 326; // 卡片 310px + 间距 16px
      const index = Math.round(scrollLeft / mobileCardStep);
      if (index >= 0 && index < productData.length) {
        setActiveMobileIndex(index);
      }
    }
  };

  const displayProducts = isMobile ? productData : tripleProducts;

  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isMouseOverContainerRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const isProtectedRef = useRef(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const CARD_WIDTH = 790; // 760px card + 30px margin
  const groupWidth = productData.length * CARD_WIDTH;

  // 1. 初始化容器的 scrollLeft 到中间这组数据的起始位置（仅在电脑端）
  useEffect(() => {
    const container = scrollRef.current;
    if (container && groupWidth > 0) {
      if (!isMobile) {
        container.scrollLeft = groupWidth;
      } else {
        container.scrollLeft = 0;
      }
    }
  }, [groupWidth, isMobile]);

  // 2. 启动基于 requestAnimationFrame 的自动向左跑马灯滚动（仅在电脑端）
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || groupWidth <= 0 || isMobile) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // 仅在非移动端宽屏下，且未被鼠标 hover，且未在手动平滑切换过渡中才进行自动滚动
      if (!isMobile && !isHoveredRef.current && !isTransitioningRef.current) {
        // 每秒滚动 35px
        container.scrollLeft += (35 * delta) / 1000;

        // 自动滚动越界重置：当自动滚动超出中间那一组数据的末尾时，无缝瞬间回弹 groupWidth 宽度
        if (container.scrollLeft >= 2 * groupWidth) {
          container.scrollLeft -= groupWidth;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [groupWidth, isMobile]);

  // 清除定时器
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  // 边界调整函数：在手动平滑滚动完毕后进行位置校正
  const adjustScrollBounds = () => {
    const container = scrollRef.current;
    if (!container || groupWidth <= 0 || isMobile) return;

    const current = container.scrollLeft;
    // 如果向右滑动超过了中间组与右缓冲组的边界，瞬间减去一组宽度
    if (current >= 2 * groupWidth) {
      container.scrollLeft = current - groupWidth;
    } 
    // 如果向左滑动低于了中间组与左缓冲组的边界，瞬间加上一组宽度
    else if (current < groupWidth) {
      container.scrollLeft = current + groupWidth;
    }
  };

  // 3. 手动点击箭头平滑切换卡片 (兼容电脑端与移动端)
  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container || isTransitioningRef.current) return;

    if (isMobile) {
      // 移动端单卡片空间步长 (310px 宽度 + 16px 外边距)
      const mobileCardStep = 326;
      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / mobileCardStep);
      
      let targetIndex = direction === "right" ? currentIndex + 1 : currentIndex - 1;
      // 限制在有效的产品索引范围内
      if (targetIndex < 0) targetIndex = 0;
      if (targetIndex >= productData.length) targetIndex = productData.length - 1;

      isTransitioningRef.current = true;
      // 临时禁用 scroll-snap-type，防止滚动中和 scrollTo({ behavior: "smooth" }) 对撞发生剧烈回弹与抖动
      container.style.scrollSnapType = "none";
      
      container.scrollTo({
        left: targetIndex * mobileCardStep,
        behavior: "smooth"
      });

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        // 平滑滚动动画结束后重新启用吸附对齐，确保手势滑动体验依然优秀
        container.style.scrollSnapType = "x mandatory";
        isTransitioningRef.current = false;
      }, 400);
    } else {
      // 电脑端逻辑
      if (groupWidth <= 0) return;
      isHoveredRef.current = true;
      isProtectedRef.current = true;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        isProtectedRef.current = false;
        if (!isMouseOverContainerRef.current) {
          isHoveredRef.current = false;
        }
      }, 4000);

      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / CARD_WIDTH);

      let targetScroll;
      if (direction === "right") {
        targetScroll = (currentIndex + 1) * CARD_WIDTH;
      } else {
        targetScroll = (currentIndex - 1) * CARD_WIDTH;
      }

      isTransitioningRef.current = true;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth"
      });

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      transitionTimeoutRef.current = window.setTimeout(() => {
        isTransitioningRef.current = false;
        adjustScrollBounds();
      }, 600);
    }
  };

  // 4. 处理鼠标在卡片上移动时的 3D 倾斜与内部图片视差
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = x / rect.width - 0.5;
    const yc = y / rect.height - 0.5;

    // 倾斜角度计算：限制在一定范围内，防止 3D 变形过大
    const rotateX = yc * -8;
    const rotateY = xc * 8;

    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);

    // 图片视差移位：图片相对于卡片做反向小幅度位移，增加景深感
    const imgX = xc * -12;
    const imgY = yc * -12;
    card.style.setProperty("--img-x", `${imgX}px`);
    card.style.setProperty("--img-y", `${imgY}px`);
  };

  /**
   * 鼠标移出卡片时恢复默认无偏斜状态
   */
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--img-x", "0px");
    card.style.setProperty("--img-y", "0px");
  };

  // 5. 鼠标进入/离开容器，控制自动滚动的开启与挂起
  const handleContainerMouseEnter = () => {
    isMouseOverContainerRef.current = true;
    isHoveredRef.current = true;
  };

  const handleContainerMouseLeave = () => {
    isMouseOverContainerRef.current = false;
    // 如果不在点击箭头的保护期中，立即恢复滚动
    if (!isProtectedRef.current) {
      isHoveredRef.current = false;
    }
  };

  return (
    <section id="showcase" className={styles.showcaseSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>
          <PlasmaText glowColor="blue">{data?.eyebrow || "产品系列"}</PlasmaText>
        </span>
        <h2 className={styles.title}>
          <PlasmaText glowColor="red">{data?.title || "卓越性能，硬核出餐"}</PlasmaText>
        </h2>
      </div>

      <div className={styles.sliderWrapper}>
        {/* 边缘渐变淡出罩层，增强高奢设计感 */}
        <div className={styles.edgeFadeLeft}></div>
        <div className={styles.edgeFadeRight}></div>

        {/* 1:1 复刻苹果官网的左右浮动控制按钮 */}
        <button 
          className={`${styles.arrowBtn} ${styles.prevBtn}`} 
          onClick={() => handleScroll("left")}
          aria-label="Previous product"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button 
          className={`${styles.arrowBtn} ${styles.nextBtn}`} 
          onClick={() => handleScroll("right")}
          aria-label="Next product"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div 
          ref={scrollRef}
          className={styles.sliderContainer}
          onMouseEnter={handleContainerMouseEnter}
          onMouseLeave={handleContainerMouseLeave}
          onScroll={handleContainerScroll}
        >
          <div className={styles.sliderTrack}>
            {displayProducts.map((item, idx) => {
              const defaultImgId = defaultImages[item.id] ? item.id : (((item.id - 1) % 3) + 1);
              const imgSrc = getFinalImgSrc(item.image, defaultImgId);
              return (
                <div 
                key={`${item.id}-${idx}`} 
                className={`${styles.slideCard} reveal-on-scroll`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.cardContent}>
                  <span className={styles.clientName}>{item.model}</span>
                  <h3 className={styles.caseTitle}>{item.title}</h3>
                  <p className={styles.caseDesc}>{item.description}</p>
                  
                  {(item.videoUrl || item.audioUrl) && (
                    <div className={styles.mediaActions}>
                      {item.videoUrl && (
                        <button
                          type="button"
                          className={styles.mediaBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenVideo(item.videoUrl!);
                          }}
                          title={lang === "zh" ? "播放视频演示" : "Play Video Demo"}
                        >
                          <svg className={styles.mediaIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          <span>{lang === "zh" ? "视频演示" : "Video Demo"}</span>
                        </button>
                      )}
                      {item.audioUrl && (
                        <button
                          type="button"
                          className={`${styles.mediaBtn} ${playingAudioUrl === item.audioUrl ? styles.mediaBtnActive : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAudio(item.audioUrl!);
                          }}
                          title={playingAudioUrl === item.audioUrl ? (lang === "zh" ? "暂停语音介绍" : "Pause Audio Guide") : (lang === "zh" ? "播放语音介绍" : "Play Audio Guide")}
                        >
                          {playingAudioUrl === item.audioUrl ? (
                            <>
                              <div className={styles.waveAnimation}>
                                <span className={styles.waveBar}></span>
                                <span className={styles.waveBar}></span>
                                <span className={styles.waveBar}></span>
                                <span className={styles.waveBar}></span>
                              </div>
                              <span>{lang === "zh" ? "暂停介绍" : "Pause Guide"}</span>
                            </>
                          ) : (
                            <>
                              <svg className={styles.mediaIcon} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                              </svg>
                              <span>{lang === "zh" ? "语音介绍" : "Audio Guide"}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  
                  <div className={styles.statsGrid}>
                    {item.stats.map((stat, idxStat) => (
                      <div 
                        key={idxStat} 
                        className={`${styles.statItem} ${stat.fullWidth ? styles.fullWidthStat : ""}`}
                      >
                        <span className={styles.statLabel}>{stat.label}</span>
                        <div className={styles.statValueContainer}>
                          <span className={styles.statHighlight}>{stat.highlight}</span>
                          <span className={styles.statText}>{stat.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={styles.cardImageWrapper}>
                  <img 
                    src={imgSrc} 
                    alt={item.imageAlt || item.title} 
                    className={styles.cardImage} 
                    loading="lazy"
                    draggable="false"
                    style={{ 
                      objectFit: "contain", 
                      padding: "24px",
                      transform: "translate(var(--img-x, 0px), var(--img-y, 0px)) scale(1.05)"
                    }}
                  />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* 极简控制面板已移至 sliderWrapper 内部两侧绝对定位 */}
      {isMobile && (
        <div className={styles.paginationDots}>
          {productData.map((_, index) => (
            <button 
              key={index} 
              type="button"
              className={`${styles.dot} ${activeMobileIndex === index ? styles.dotActive : ""}`}
              onClick={() => {
                const container = scrollRef.current;
                if (container) {
                  container.scrollTo({
                    left: index * 326,
                    behavior: "smooth"
                  });
                }
              }}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      )}

      {activeVideoUrl && (
        <div className={styles.videoModalOverlay} onClick={handleCloseVideo}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeBtn} 
              onClick={handleCloseVideo}
              aria-label={lang === "zh" ? "关闭视频" : "Close Video"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className={styles.videoWrapper}>
              <video 
                src={resolveImagePath(activeVideoUrl || "")} 
                controls 
                autoPlay 
                playsInline
                className={styles.videoPlayer}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Showcase;
