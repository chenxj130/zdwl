import React from "react";
import styles from "./CompanyProfile.module.css";

interface CompanyProfileProps {
  data?: {
    title: string;
    content: string;
  };
  lang?: "zh" | "en";
}

/**
 * 公司简介组件
 * 采用 Apple 风格的大号字排版，在桌面端支持 1240px 两端对齐和 2em 首行缩进
 */
const CompanyProfile: React.FC<CompanyProfileProps> = ({ data, lang = "zh" }) => {
  // 如果没有数据传入，渲染空以保持页面健壮性
  if (!data) return null;

  const renderContent = (text: string) => {
    if (!text) return null;
    const cleanText = text.trim();
    
    // NOTE: 根据中英文不同，切分匹配相应的核心优势高亮短语
    const regex = lang === "zh"
      ? /(标准化、规模化、数智化|中餐标准化多场景商业落地)/g
      : /(Chinese culinary standardization|standardization, scalability, and digitalization)/gi;

    const parts = cleanText.split(regex);
    return parts.map((part, idx) => {
      const isHighlight = lang === "zh"
        ? (part === "标准化、规模化、数智化" || part === "中餐标准化多场景商业落地")
        : /Chinese culinary standardization|standardization, scalability, and digitalization/i.test(part);

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
    <section id="company-profile" className={styles.profileSection}>
      <div className={styles.contentWrapper}>
        <h2 className={styles.title}>{data.title || "公司简介"}</h2>
        <p className={styles.description}>
          {renderContent(data.content)}
        </p>
      </div>
    </section>
  );
};

export default CompanyProfile;
