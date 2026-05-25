import React from "react";
import styles from "./LayoutSwitcher.module.css";

interface LayoutSwitcherProps {
  activeMode: "desktop" | "mobile";
  onChange: (mode: "desktop" | "mobile") => void;
}

/**
 * 布局模式切换横幅组件
 * 支持在前台手动切换“电脑端适配”与“移动端适配”两个并行布局版本
 * @param props 组件属性
 * @returns React 组件
 */
const LayoutSwitcher: React.FC<LayoutSwitcherProps> = ({ activeMode, onChange }) => {
  return (
    <div className={styles.switcherContainer} id="layout-switcher">
      <div className={styles.switcherContent}>
        <span className={styles.switcherTitle}>智能布局预览：</span>
        <div className={styles.switcherLinks}>
          <button
            type="button"
            onClick={() => onChange("desktop")}
            className={`${styles.switcherLink} ${activeMode === "desktop" ? styles.activeLink : ""}`}
            title="切换至电脑端大屏自适应布局"
          >
            <span className={styles.icon}>💻</span> 电脑端适配
          </button>
          <span className={styles.divider}>/</span>
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
