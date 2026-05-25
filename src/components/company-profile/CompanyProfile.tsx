import React from "react";
import styles from "./CompanyProfile.module.css";

interface CompanyProfileProps {
  data?: {
    title: string;
    content: string;
  };
}

/**
 * 公司简介组件
 * 采用 Apple 风格的大号字排版，在桌面端支持 1240px 两端对齐和 2em 首行缩进
 */
const CompanyProfile: React.FC<CompanyProfileProps> = ({ data }) => {
  // 如果没有数据传入，渲染空以保持页面健壮性
  if (!data) return null;

  const renderContent = (text: string) => {
    if (!text) return null;
    const cleanText = text.trim();
    // 使用正则切分目标高亮词汇
    const parts = cleanText.split(/(标准化、规模化、数智化|中餐标准化多场景商业落地)/g);
    return parts.map((part, idx) => {
      if (
        part === "标准化、规模化、数智化" ||
        part === "中餐标准化多场景商业落地"
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
