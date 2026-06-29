import React, { useState, useEffect } from "react";
import styles from "./BentoGrid.module.css";
import heroImg from "../../assets/cooker-hero.png";
import founderImg from "../../assets/founder.png";
import PlasmaText from "../plasma-text/PlasmaText";

interface BentoGridProps {
  data: {
    founder: {
      name: string;
      title: string;
      bio: string;
      image: string;
      imageAlt?: string;
      badgeLine: string;
      badgeLabel: string;
      story?: {
        expertise: string;
        experiences: {
          time: string;
          detail: string;
        }[];
      };
    };
    advantages: {
      sectionEyebrow: string;
      sectionTitle: string;
      techTitle: string;
      techDesc: string;
      techImage: string;
      techImageAlt?: string;
      standardTitle: string;
      standardDesc: string;
      syncTitle: string;
      syncDesc: string;
    };
  };
  lang?: "zh" | "en";
}

/**
 * 核心优势 + 创始人合并为单个全屏 section
 * NOTE: 导航栏「核心优势」锚点指向整个 section，「创始人」锚点指向内部的创始人卡片
 */
const BentoGrid: React.FC<BentoGridProps> = ({ data, lang = "zh" }) => {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // 控制 Modal 开启时禁用 body 滚动
  useEffect(() => {
    if (isStoryOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isStoryOpen]);

  // 支持键盘 ESC 键关闭 Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsStoryOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  return (
    <section id="advantages" className={styles.fullPageSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>
          <PlasmaText glowColor="purple">{data.advantages.sectionEyebrow || (lang === "zh" ? "核心技术与优势" : "Core Tech & Advantages")}</PlasmaText>
        </span>
        <h2 className={styles.title}>
          <PlasmaText glowColor="red">{data.advantages.sectionTitle || (lang === "zh" ? "开启智慧烹饪新纪元" : "Unveiling a New Era of Smart Cooking")}</PlasmaText>
        </h2>
      </div>

      <div className={styles.gridContainer}>
        {/* Card 1: Tech for Meals (Large, Left) */}
        <div 
          className={`${styles.card} ${styles.span8} ${styles.imageCard} reveal-on-scroll`}
          style={{ backgroundImage: `url(${resolveImagePath(data.advantages.techImage) || heroImg})` }}
          role="img"
          aria-label={data.advantages.techImageAlt || (lang === "zh" ? "智鼎味来智能烹饪核心技术演示图" : "Zhiding Future Smart Cooking Core Tech Demo")}
        >
          <div className={styles.imageOverlay}></div>
          <div className={styles.cardText}>
            <span className={styles.cardCategory}>
              {lang === "zh" ? "核心科技" : "Core Tech"}
            </span>
            <h3 className={styles.cardTitle}>{data.advantages.techTitle}</h3>
            <p className={styles.cardDesc}>
              {data.advantages.techDesc}
            </p>
          </div>
          <div className={styles.cardAction}>
            <a href="#showcase" className="secondaryBtn" style={{ color: "#2997ff" }}>
              {lang === "zh" ? "探索智能硬件" : "Explore Smart Hardware"} &rarr;
            </a>
          </div>
        </div>

        {/* Card 2: Founder Cheng Hua (Small, Right) */}
        <div 
          id="founder"
          className={`${styles.card} ${styles.span4} ${styles.founderCard} reveal-on-scroll`}
        >
          {/* Absolute positioned elements for background image and specific overlay gradient */}
          <div 
            className={styles.founderImage} 
            style={{ backgroundImage: `url(${resolveImagePath(data.founder.image) || founderImg})` }}
            role="img"
            aria-label={data.founder.imageAlt || (lang === "zh" ? "智鼎味来创始人程华肖像照" : "Hua Cheng - Founder of Zhiding Future")}
          ></div>
          <div className={styles.founderOverlay}></div>

          <div className={styles.founderContent}>
            <span className={styles.cardCategory} style={{ color: "var(--color-link)" }}>
              {lang === "zh" ? "创始人" : "Founder"}
            </span>
            <h3 className={styles.cardTitle} style={{ color: "#ffffff", marginBottom: "4px" }}>{data.founder.name}</h3>
            <span className={styles.founderSubtitle} style={{ color: "var(--color-link)" }}>{data.founder.title}</span>
            <p className={styles.cardDesc} style={{ color: "rgba(255, 255, 255, 0.8)", marginTop: "16px" }}>
              {data.founder.bio}
            </p>
          </div>
          
          {/* Typographic Badge Design detail */}
          <div 
            className={styles.founderBadge} 
            onClick={() => setIsStoryOpen(true)}
            title={lang === "zh" ? "点击查看创始人16年探索故事" : "Click to view founder's 16-year story"}
          >
            <div className={styles.badgeLine} style={{ color: "#ffffff" }}>{data.founder.badgeLine || "16+ YEARS"}</div>
            <div className={styles.badgeLabel} style={{ color: "rgba(255, 255, 255, 0.6)" }}>{data.founder.badgeLabel || "AI COOKING EXPLORATION"}</div>
          </div>
        </div>

        {/* Card 3: Chinese Food Standardization (Small, Left) */}
        <div className={`${styles.card} ${styles.span4} reveal-on-scroll`}>
          <div className={styles.cardText}>
            <span className={styles.cardCategory} style={{ color: "var(--color-text-secondary)" }}>
              {lang === "zh" ? "解决痛点" : "Pain Points"}
            </span>
            <h3 className={styles.cardTitle} style={{ color: "var(--color-text)" }}>{data.advantages.standardTitle}</h3>
            <p className={styles.cardDesc} style={{ color: "var(--color-text-secondary)" }}>
              {data.advantages.standardDesc}
            </p>
          </div>
          
          {/* Animated CSS Temperature Curve Visual */}
          <div className={styles.chartContainer}>
            <div className={styles.chartBar} style={{ height: "30%", animationDelay: "0.1s" }} data-label={lang === "zh" ? "预热" : "Preheat"}></div>
            <div className={styles.chartBar} style={{ height: "65%", animationDelay: "0.3s" }} data-label={lang === "zh" ? "下料" : "Add Food"}></div>
            <div className={styles.chartBar} style={{ height: "95%", animationDelay: "0.5s" }} data-label={lang === "zh" ? "爆炒" : "Stir-fry"}></div>
            <div className={styles.chartBar} style={{ height: "55%", animationDelay: "0.2s" }} data-label={lang === "zh" ? "收汁" : "Reduce"}></div>
            <div className={styles.chartBar} style={{ height: "40%", animationDelay: "0.4s" }} data-label={lang === "zh" ? "保温" : "Warm"}></div>
          </div>
        </div>

        {/* Card 4: Multi-Device Sync (Large, Right) */}
        <div className={`${styles.card} ${styles.span8} reveal-on-scroll`}>
          <div className={styles.cardText}>
            <span className={styles.cardCategory} style={{ color: "var(--color-text-secondary)" }}>
              {lang === "zh" ? "物联控制" : "IoT Control"}
            </span>
            <h3 className={styles.cardTitle} style={{ color: "var(--color-text)" }}>{data.advantages.syncTitle}</h3>
            <p className={styles.cardDesc} style={{ color: "var(--color-text-secondary)" }}>
              {data.advantages.syncDesc}
            </p>
          </div>

          {/* Interactive Cooking recipe deployment mock terminal */}
          <div className={styles.terminalContainer}>
            <div className={styles.terminalHeader}>
              <div className={`${styles.dot} ${styles.redDot}`}></div>
              <div className={`${styles.dot} ${styles.yellowDot}`}></div>
              <div className={`${styles.dot} ${styles.greenDot}`}></div>
            </div>
            <div>
              <span className={styles.terminalLine}>
                <span className={styles.terminalCommand}>$</span> zdwl-sync deploy --recipe {lang === "zh" ? "\"小炒肉_v2.1\"" : "\"Sautéed_Pork_v2.1\""}
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#abb2bf" }}>
                &gt; {lang === "zh" ? "同步菜谱数据库与大师烹饪火候曲线..." : "Syncing recipe database & master fire curve..."}
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#e5c07b" }}>
                &gt; {lang === "zh" ? "锅体电磁预热至 185°C (实时监测温度: 185.2°C)" : "Pot induction preheating to 185°C (Real-time: 185.2°C)"}
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#98c379" }}>
                {lang === "zh" ? "✔ 菜谱部署成功：设备 #03 烹饪就绪" : "✔ Recipe deployed successfully: Device #03 ready"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 创始人 16 年探索历程二级展示页面 (Modal) */}
      {isStoryOpen && (
        <div className={styles.storyOverlay} onClick={() => setIsStoryOpen(false)}>
          <div className={styles.storyModal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.storyCloseBtn} 
              onClick={() => setIsStoryOpen(false)}
              aria-label={lang === "zh" ? "关闭" : "Close"}
            >
              &times;
            </button>
            
            <div className={styles.storyHeader}>
              <span className={styles.storyBadge}>
                {lang === "zh" ? "创始人故事" : "FOUNDER'S STORY"}
              </span>
              <h2 className={styles.storyTitle}>
                {lang === "zh" ? "程华 · 16年中餐数智化先行者的历练与创变" : "Hua Cheng · 16 Years of AI Culinary Pioneering"}
              </h2>
              <div className={styles.storyExpertise}>
                <span className={styles.expertiseLabel}>{lang === "zh" ? "核心擅长：" : "Expertise: "}</span>
                <span className={styles.expertiseText}>
                  {data.founder.story?.expertise || (lang === "zh" ? "多业态、多场景“数智化餐饮”整体解决方案的设计与应用推广。" : "Design and application promotion of 'digitized and intelligent catering' overall solutions.")}
                </span>
              </div>
            </div>

            <div className={styles.storyTimeline}>
              {(data.founder.story?.experiences || []).map((exp, idx) => {
                const stagesZh = ["启航 · 探索火种", "跨越 · 规模交付", "沉淀 · 重塑模式", "磨砺 · 模型验证", "破局 · 初心致远"];
                const stagesEn = ["Phase 1: Spark of Dream", "Phase 2: Scale & Delivery", "Phase 3: Restructuring Model", "Phase 4: Practical Validation", "Phase 5: Digitalization Future"];
                const stage = lang === "zh" ? stagesZh[idx] : stagesEn[idx];
                
                return (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineMarker}>
                      <div className={styles.markerDot}></div>
                      {idx < (data.founder.story?.experiences.length || 0) - 1 && <div className={styles.markerLine}></div>}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeaderInfo}>
                        <span className={styles.timelineStage}>{stage}</span>
                        <span className={styles.timelineTime}>{exp.time}</span>
                      </div>
                      <p className={styles.timelineDetail}>{exp.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BentoGrid;
