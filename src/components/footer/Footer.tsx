import React, { useState } from "react";
import styles from "./Footer.module.css";

interface FooterLink {
  text: string;
  href: string;
}

interface FooterColumn {
  id: string;
  title: string;
  titleLink?: string;
  links: FooterLink[];
}

interface FooterProps {
  data: {
    disclaimer: string;
    address: string;
    phone: string;
    copyright: string;
    columns?: FooterColumn[];
  };
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    id: "products",
    title: "产品系列",
    titleLink: "#showcase",
    links: [
      { text: "ZDWL-300 电磁炒菜机", href: "#showcase" },
      { text: "ZDWL-350 中型炒菜机", href: "#showcase" },
      { text: "ZDWL-600 大型滚筒机", href: "#showcase" },
      { text: "商用零配件与锅体", href: "#" }
    ]
  },
  {
    id: "solutions",
    title: "核心解决方案",
    titleLink: "#advantages",
    links: [
      { text: "连锁快餐标准化", href: "#advantages" },
      { text: "学校食堂智慧化建设", href: "#advantages" },
      { text: "企事业单位大型团餐", href: "#advantages" },
      { text: "云端配方与中央厨房", href: "#advantages" }
    ]
  },
  {
    id: "values",
    title: "科技向膳",
    titleLink: "#bento-grid",
    links: [
      { text: "中餐烹饪艺术数字化", href: "#bento-grid" },
      { text: "设备能效与绿色低碳", href: "#" },
      { text: "无油烟环保专利技术", href: "#" },
      { text: "食品安全与温控追踪", href: "#" }
    ]
  },
  {
    id: "about",
    title: "关于智鼎味来",
    titleLink: "#company-profile",
    links: [
      { text: "公司简介", href: "#company-profile" },
      { text: "创始人：程华", href: "#founder" },
      { text: "企业荣誉资质", href: "#" },
      { text: "观澜生产中心", href: "#footer" }
    ]
  },
  {
    id: "support",
    title: "服务与支持",
    titleLink: "#footer",
    links: [
      { text: "设备使用说明书", href: "#" },
      { text: "常见问题答疑", href: "#" },
      { text: "售后维保工单", href: "#" },
      { text: "联系销售经理", href: "#footer" }
    ]
  }
];

const Footer: React.FC<FooterProps> = ({ data }) => {
  const [openColumns, setOpenColumns] = useState<Record<string, boolean>>({});
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const columnsData = (data?.columns && data.columns.length > 0) ? data.columns : DEFAULT_COLUMNS;

  const toggleColumn = (columnId: string) => {
    setOpenColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) return;

    // NOTE: 模拟预约数据提交，并在顶部弹出优雅的苹果风格 Toast 气泡
    setToastMessage(`预约成功！您的称呼为 ${bookingName}，我们将尽快与您取得联系。`);
    setShowToast(true);
    setBookingName("");
    setBookingPhone("");

    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // NOTE: 平滑滚动处理函数，当href以#开头时拦截默认跳转，实现平滑滚动
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="footer" className={styles.footerContainer}>
      <div className={styles.footerContent}>
        {/* Footnote Branding Intro & Address */}
        <div className={styles.introText}>
          {/* Re-created Full Brand Logo in Vector SVG with Glassmorphic Wrapper */}
          <div className={styles.glassLogoWrapper}>
            <svg viewBox="0 0 150 50" width="150" height="50" style={{ display: "block" }}>
              <g transform="translate(0, 6)" fill="var(--color-text)">
                <text x="75" y="22" fontFamily="var(--font-apple)" fontWeight="700" fontSize="16" letterSpacing="0.05em" fill="currentColor" textAnchor="middle">
                  智鼎味来
                </text>
              </g>
              {/* Underline English slogan with red bars on both sides */}
              <text x="75" y="42" fontFamily="var(--font-apple)" fontWeight="500" fontSize="6.8" fill="var(--color-text-secondary)" textAnchor="middle">
                Deliciousness from AI Cooking
              </text>
              <line x1="6" y1="39" x2="18" y2="39" stroke="var(--color-accent-red)" strokeWidth="1.2"/>
              <line x1="132" y1="39" x2="144" y2="39" stroke="var(--color-accent-red)" strokeWidth="1.2"/>
            </svg>
          </div>
          <p style={{ marginBottom: "12px", lineHeight: "1.6" }}>
            {data?.disclaimer || "本网站的所有智能烹饪硬件结构、物联网云端调度系统及烹饪温控曲线算法均由设备生产制造厂家所有。部分 3D 产品渲染由神经网络自主训练生成，用于功能示意展示。智鼎味来致力于将先进的 AI 科技与传统烹饪艺术深度融汇，开启餐饮智能化革命。"}
          </p>
          <p style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 16px", color: "var(--color-text)", fontWeight: "500", lineHeight: "1.6" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-accent-red)" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              公司地址：{data?.address || "深圳市龙华区观澜街道君子布社区君新工业路6号厂房102"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-accent-red)" }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              商务合作：{data?.phone || "15507556167（微信同号）"}
            </span>
          </p>
        </div>

        {/* 在线预约表单模块 */}
        <div className={styles.bookingFormWrapper}>
          <h4 className={styles.bookingTitle}>预约设备体验</h4>
          <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>称呼 <span className={styles.required}>*</span></label>
                <input 
                  type="text" 
                  placeholder="请输入您的称呼" 
                  required 
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  className={styles.formInput} 
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>电话 <span className={styles.required}>*</span></label>
                <input 
                  type="tel" 
                  placeholder="请输入手机号" 
                  required 
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className={styles.formInput} 
                />
              </div>
            </div>
            <button type="submit" className={styles.bookingSubmitBtn}>立即预约</button>
          </form>
        </div>

        {/* Directory Columns */}
        <div className={styles.linksGrid}>
          {columnsData.map((col) => {
            const isOpen = !!openColumns[col.id];
            return (
              <div key={col.id} className={styles.column}>
                <div className={styles.columnHeader}>
                  {col.titleLink ? (
                    <a 
                      href={col.titleLink} 
                      onClick={(e) => handleLinkClick(e, col.titleLink!)}
                      className={styles.columnTitleLink}
                    >
                      <h4 className={styles.columnTitle}>{col.title}</h4>
                    </a>
                  ) : (
                    <h4 className={styles.columnTitle}>{col.title}</h4>
                  )}
                  {/* NOTE: 移动端折叠按钮，点击仅控制展开与收起，防止与标题跳转链接冲突 */}
                  <button 
                    className={styles.mobileToggleBtn}
                    onClick={() => toggleColumn(col.id)}
                    aria-label={isOpen ? "收起列表" : "展开列表"}
                  >
                    <span className={`${styles.mobileToggleIcon} ${isOpen ? styles.iconRotated : ""}`}>+</span>
                  </button>
                </div>
                <ul className={`${styles.linksList} ${isOpen ? styles.linksListOpen : ""}`}>
                  {col.links.map((link, idx) => (
                    <li key={idx} className={styles.linkItem}>
                      <a 
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom copyright information */}
        <div 
          className={styles.bottomBar} 
          style={{ 
            borderTop: "1px solid var(--color-border)", 
            paddingTop: "20px", 
            marginTop: "32px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap", 
            gap: "12px", 
            width: "100%",
            color: "var(--color-text-secondary)",
            fontSize: "11px"
          }}
        >
          <div 
            className={styles.copyright}
            style={{
              lineHeight: "1.5"
            }}
          >
            {data?.copyright || "Copyright © 2026 深圳智鼎味来科技有限公司. 保留所有权利。"}
          </div>
          <ul 
            className={styles.legalLinks}
            style={{
              display: "flex",
              listStyle: "none",
              gap: "16px",
              flexWrap: "wrap",
              padding: 0,
              margin: 0
            }}
          >
            <li className={styles.legalItem}>
              <a href="#" style={{ color: "var(--color-text-secondary)" }}>隐私政策</a>
            </li>
            <li className={styles.legalItem}>
              <a href="#" style={{ color: "var(--color-text-secondary)" }}>服务条款</a>
            </li>
            <li className={styles.legalItem}>
              <a href="#" style={{ color: "var(--color-text-secondary)" }}>网站地图</a>
            </li>
          </ul>
        </div>
      </div>
      {showToast && (
        <div className={styles.toast}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#34c759" }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {toastMessage}
        </div>
      )}
    </footer>
  );
};

export default Footer;
