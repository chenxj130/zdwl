import React, { useState, useEffect } from "react";
import styles from "./LayoutSwitcher.module.css";

interface LayoutSwitcherProps {
  activeMode: "desktop" | "mobile";
  onChange: (mode: "desktop" | "mobile") => void;
}

/**
 * 布局模式切换横幅组件
 * 支持在前台手动切换“电脑端适配”与“移动端适配”两个并行布局版本，并根据用户浏览器自动匹配
 * @param props 组件属性
 * @returns React 组件
 */
const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({ activeMode, onChange }) => {
  // NOTE: 检测并保存当前系统自动识别到的浏览器适配类型
  const [detectedMode, setDetectedMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    if (typeof window !== "undefined" && navigator) {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth <= 768;
      setDetectedMode((isMobileUA || isSmallScreen) ? "mobile" : "desktop");
    }
  }, []);

  return (
    <div className={styles.switcherContainer} id="layout-switcher">
      <div className={styles.switcherContent}>
        <div className={styles.titleWrapper}>
          <span className={styles.switcherTitle}>智能布局预览：</span>
          <span className={styles.detectBadge} title={`已根据您当前打开的设备类型自动匹配为${detectedMode === "mobile" ? "移动端" : "电脑端"}布局`}>
            <span className={styles.pulseDot}></span>
            已自动匹配：{detectedMode === "mobile" ? "移动端" : "电脑端"}浏览器
          </span>
        </div>
        <div className={styles.switcherLinks}>
          {/* 滑动指示器药丸背景 */}
          <div
            className={`${styles.activeIndicator} ${
              activeMode === "mobile" ? styles.indicatorMobile : styles.indicatorDesktop
            }`}
          />
          <button
            type="button"
            onClick={() => onChange("desktop")}
            className={`${styles.switcherLink} ${activeMode === "desktop" ? styles.activeLink : ""}`}
            title="切换至电脑端大屏自适应布局"
          >
            <span className={styles.icon}>💻</span> 电脑端适配
          </button>
          <button
            type="button"
            onClick={() => onChange("mobile")}
            className={`${styles.switcherLink} ${activeMode === "mobile" ? styles.activeLink : ""}`}
            title="切换至 1:1 移动端真机排版预览"
          >
            <span className={styles.icon}>📱</span> 移动端适配
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutSwitcher;
