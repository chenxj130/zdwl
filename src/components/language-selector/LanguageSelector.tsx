import React, { useState, useEffect, useRef } from "react";
import styles from "./LanguageSelector.module.css";

interface LanguageSelectorProps {
  currentLang: "zh" | "en";
  onLangChange: (lang: "zh" | "en") => void;
}

/**
 * 苹果高奢风格的中英文语言切换下拉框组件
 * @param props 组件属性
 * @returns React 组件
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLangChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // NOTE: 点击页面外部时自动关闭下拉菜单，增强交互防御性
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (lang: "zh" | "en") => {
    onLangChange(lang);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectorContainer} ref={dropdownRef}>
      <button
        type="button"
        className={`${styles.selectorButton} ${isOpen ? styles.buttonActive : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title={currentLang === "zh" ? "切换语言 / Change Language" : "Change Language / 切换语言"}
      >
        <span className={styles.globeIcon}>🌐</span>
        <span className={styles.langLabel}>
          {currentLang === "zh" ? "简体中文" : "English"}
        </span>
        <span className={`${styles.arrowIcon} ${isOpen ? styles.arrowRotate : ""}`}>▾</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.dropdownItem}>
            <button
              type="button"
              className={`${styles.itemButton} ${currentLang === "zh" ? styles.activeItem : ""}`}
              onClick={() => handleSelect("zh")}
            >
              简体中文
              {currentLang === "zh" && <span className={styles.checkIcon}>✓</span>}
            </button>
          </li>
          <li className={styles.dropdownItem}>
            <button
              type="button"
              className={`${styles.itemButton} ${currentLang === "en" ? styles.activeItem : ""}`}
              onClick={() => handleSelect("en")}
            >
              English
              {currentLang === "en" && <span className={styles.checkIcon}>✓</span>}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
