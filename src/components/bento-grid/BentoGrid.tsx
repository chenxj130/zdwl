import React from "react";
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
}

/**
 * 核心优势 + 创始人合并为单个全屏 section
 * NOTE: 导航栏「核心优势」锚点指向整个 section，「创始人」锚点指向内部的创始人卡片
 */
const BentoGrid: React.FC<BentoGridProps> = ({ data }) => {
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
          <PlasmaText glowColor="purple">{data.advantages.sectionEyebrow || "核心技术与优势"}</PlasmaText>
        </span>
        <h2 className={styles.title}>
          <PlasmaText glowColor="red">{data.advantages.sectionTitle || "开启智慧烹饪新纪元"}</PlasmaText>
        </h2>
      </div>

      <div className={styles.gridContainer}>
        {/* Card 1: Tech for Meals (Large, Left) */}
        <div 
          className={`${styles.card} ${styles.span8} ${styles.imageCard} reveal-on-scroll`}
          style={{ backgroundImage: `url(${resolveImagePath(data.advantages.techImage) || heroImg})` }}
          role="img"
          aria-label={data.advantages.techImageAlt || "智鼎味来智能烹饪核心技术演示图"}
        >
          <div className={styles.imageOverlay}></div>
          <div className={styles.cardText}>
            <span className={styles.cardCategory}>核心科技</span>
            <h3 className={styles.cardTitle}>{data.advantages.techTitle}</h3>
            <p className={styles.cardDesc}>
              {data.advantages.techDesc}
            </p>
          </div>
          <div className={styles.cardAction}>
            <a href="#showcase" className="secondaryBtn" style={{ color: "#2997ff" }}>
              探索智能硬件 &rarr;
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
            aria-label={data.founder.imageAlt || "智鼎味来创始人程华肖像照"}
          ></div>
          <div className={styles.founderOverlay}></div>

          <div className={styles.founderContent}>
            <span className={styles.cardCategory} style={{ color: "var(--color-link)" }}>创始人</span>
            <h3 className={styles.cardTitle} style={{ color: "#ffffff", marginBottom: "4px" }}>{data.founder.name}</h3>
            <span className={styles.founderSubtitle} style={{ color: "var(--color-link)" }}>{data.founder.title}</span>
            <p className={styles.cardDesc} style={{ color: "rgba(255, 255, 255, 0.8)", marginTop: "16px" }}>
              {data.founder.bio}
            </p>
          </div>
          
          {/* Typographic Badge Design detail */}
          <div className={styles.founderBadge}>
            <div className={styles.badgeLine} style={{ color: "#ffffff" }}>{data.founder.badgeLine || "16+ YEARS"}</div>
            <div className={styles.badgeLabel} style={{ color: "rgba(255, 255, 255, 0.6)" }}>{data.founder.badgeLabel || "AI COOKING EXPLORATION"}</div>
          </div>
        </div>

        {/* Card 3: Chinese Food Standardization (Small, Left) */}
        <div className={`${styles.card} ${styles.span4} reveal-on-scroll`}>
          <div className={styles.cardText}>
            <span className={styles.cardCategory} style={{ color: "var(--color-text-secondary)" }}>解决痛点</span>
            <h3 className={styles.cardTitle} style={{ color: "var(--color-text)" }}>{data.advantages.standardTitle}</h3>
            <p className={styles.cardDesc} style={{ color: "var(--color-text-secondary)" }}>
              {data.advantages.standardDesc}
            </p>
          </div>
          
          {/* Animated CSS Temperature Curve Visual */}
          <div className={styles.chartContainer}>
            <div className={styles.chartBar} style={{ height: "30%", animationDelay: "0.1s" }} data-label="预热"></div>
            <div className={styles.chartBar} style={{ height: "65%", animationDelay: "0.3s" }} data-label="下料"></div>
            <div className={styles.chartBar} style={{ height: "95%", animationDelay: "0.5s" }} data-label="爆炒"></div>
            <div className={styles.chartBar} style={{ height: "55%", animationDelay: "0.2s" }} data-label="收汁"></div>
            <div className={styles.chartBar} style={{ height: "40%", animationDelay: "0.4s" }} data-label="保温"></div>
          </div>
        </div>

        {/* Card 4: Multi-Device Sync (Large, Right) */}
        <div className={`${styles.card} ${styles.span8} reveal-on-scroll`}>
          <div className={styles.cardText}>
            <span className={styles.cardCategory} style={{ color: "var(--color-text-secondary)" }}>物联控制</span>
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
                <span className={styles.terminalCommand}>$</span> zdwl-sync deploy --recipe "小炒肉_v2.1"
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#abb2bf" }}>
                &gt; 同步菜谱数据库与大师烹饪火候曲线...
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#e5c07b" }}>
                &gt; 锅体电磁预热至 185°C (实时监测温度: 185.2°C)
              </span>
            </div>
            <div>
              <span className={styles.terminalLine} style={{ color: "#98c379" }}>
                ✔ 菜谱部署成功：设备 #03 烹饪就绪
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
