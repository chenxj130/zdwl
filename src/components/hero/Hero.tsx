import React from "react";
import styles from "./Hero.module.css";
import PlasmaText from "../plasma-text/PlasmaText";
import CompanyProfile from "../company-profile/CompanyProfile";

interface HeroProps {
  data: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  about?: {
    title: string;
    content: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data, about }) => {
  const renderSubtitle = (text: string) => {
    if (!text) return null;
    const cleanText = text.trim();
    // 切分目标高亮词汇
    const parts = cleanText.split(/(创新科技|解放生产力实现轻松烹饪|留远传承|中国味道)/g);
    return parts.map((part, idx) => {
      if (
        part === "创新科技" ||
        part === "解放生产力实现轻松烹饪" ||
        part === "留远传承" ||
        part === "中国味道"
      ) {
        return (
          <span key={idx} className={styles.highlightText}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section id="hero" className={styles.heroSection}>
      <div className={styles.textContent}>
        <span className={styles.eyebrow}>
          <PlasmaText glowColor="blue">{data.eyebrow}</PlasmaText>
        </span>
        <h1 className={styles.title}>
          <PlasmaText glowColor="red">{data.title}</PlasmaText>
        </h1>
        <p className={styles.subtitle}>{renderSubtitle(data.subtitle)}</p>
        
        <div className={styles.ctas}>
          <a href="#showcase">
            <button className={styles.primaryBtn}>了解产品系列</button>
          </a>
          <a href="#footer">
            <button className={styles.primaryBtn}>咨询定制方案</button>
          </a>
        </div>
      </div>
      {about && <CompanyProfile data={about} />}
    </section>
  );
};

export default Hero;
