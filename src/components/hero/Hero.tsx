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
  lang?: "zh" | "en";
}

const Hero: React.FC<HeroProps> = ({ data, about, lang = "zh" }) => {
  const renderSubtitle = (text: string) => {
    if (!text) return null;
    const cleanText = text.trim();
    
    // NOTE: 根据当前激活语言，匹配相应的高亮关键字正则
    const regex = lang === "zh"
      ? /(创新科技|解放生产力实现轻松烹饪|留远传承|中国味道)/g
      : /(innovative technology|liberating productivity|Chinese culinary culture|delicious Chinese flavors)/gi;

    const parts = cleanText.split(regex);
    return parts.map((part, idx) => {
      const isHighlight = lang === "zh"
        ? (part === "创新科技" || part === "解放生产力实现轻松烹饪" || part === "留远传承" || part === "中国味道")
        : /innovative technology|liberating productivity|Chinese culinary culture|delicious Chinese flavors/i.test(part);

      if (isHighlight) {
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
            <button className={styles.primaryBtn}>
              {lang === "zh" ? "了解产品系列" : "Explore Products"}
            </button>
          </a>
          <a href="#footer">
            <button className={styles.primaryBtn}>
              {lang === "zh" ? "咨询定制方案" : "Contact Sales"}
            </button>
          </a>
        </div>
      </div>
      {about && <CompanyProfile data={about} lang={lang} />}
    </section>
  );
};

export default Hero;
