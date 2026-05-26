import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import BentoGrid from "./components/bento-grid/BentoGrid";
import Showcase from "./components/showcase/Showcase";
import Footer from "./components/footer/Footer";
import AdminPanel, { type SiteData } from "./components/admin-panel/AdminPanel";
import LayoutSwitcher from "./components/layout-switcher/LayoutSwitcher";
import PhoneSimulator from "./components/phone-simulator/PhoneSimulator";
import customSiteData from "./site_data.json";
import enSiteData from "./site_data_en.json";

const DEFAULT_SITE_DATA: SiteData = customSiteData;
const DEFAULT_SITE_DATA_EN: SiteData = enSiteData;

const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme === "light" || savedTheme === "dark") ? savedTheme : "dark";
  });

  // NOTE: 语言状态 (zh | en)
  const [lang, setLang] = useState<"zh" | "en">(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const langInUrl = queryParams.get("lang");
    if (langInUrl === "zh" || langInUrl === "en") {
      return langInUrl;
    }
    const savedLang = localStorage.getItem("language");
    if (savedLang === "zh" || savedLang === "en") {
      return savedLang;
    }
    if (typeof navigator !== "undefined") {
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith("zh") ? "zh" : "en";
    }
    return "zh";
  });

  // NOTE: 检测 URL 区分是否在 iframe 内嵌入
  const isEmbed = React.useMemo(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("embed") === "true";
  }, []);

  // NOTE: 布局预览模式状态 (desktop | mobile)
  const [layoutMode, setLayoutMode] = useState<"desktop" | "mobile">(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const modeInUrl = queryParams.get("layoutMode");
    if (modeInUrl === "desktop" || modeInUrl === "mobile") {
      return modeInUrl;
    }
    // 自动根据用户打开网页浏览器的类型，自适应选择匹配的适配类型
    if (typeof window !== "undefined" && navigator) {
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const isSmallScreen = window.innerWidth <= 768;
      if (isMobileUA || isSmallScreen) {
        return "mobile";
      }
    }
    return "desktop";
  });

  // NOTE: 检测是否为物理小屏设备 (<= 768px)
  const [isPhysicalMobile, setIsPhysicalMobile] = useState(() => {
    return window.innerWidth <= 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPhysicalMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NOTE: 物理移动设备（手机）访问且点击“电脑端适配”时，动态为 HTML/Body 挂载强制样式类名
  useEffect(() => {
    if (isPhysicalMobile && layoutMode === "desktop") {
      document.documentElement.classList.add("forceDesktop");
      document.body.classList.add("forceDesktop");
    } else {
      document.documentElement.classList.remove("forceDesktop");
      document.body.classList.remove("forceDesktop");
    }
  }, [isPhysicalMobile, layoutMode]);

  // NOTE: 中文版站点文本数据状态
  const [zhData, setZhData] = useState<SiteData>(() => {
    const savedData = localStorage.getItem("site_data_zh") || localStorage.getItem("site_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const oldTitles = ["每日智鼎 味来无限", "智鼎味来 智能炒菜机", "每日智鼎 味道无限", "智鼎味来 智能炒餐机"];
        if (parsed.hero && oldTitles.includes(parsed.hero.title)) {
          parsed.hero.title = "科技向膳 美味生活";
          localStorage.setItem("site_data_zh", JSON.stringify(parsed));
        }
        const oldSubtitles = [
          "将先进的 AI 算法、物联网技术与中餐烹饪艺术深度融合。通过全自动智能炒菜机，为连锁餐饮、学校食堂、企业团餐等提供「高效、标准、健康」的智能烹饪解决方案。",
          "将先进的AI 算法、物联网技术与中餐烹饪艺术深度融合。通过全自动智能炒菜机，为连锁餐饮、学校食堂、企业团餐等提供「高效、标准、健康」的智能烹饪解决方案。"
        ];
        if (parsed.hero && (!parsed.hero.subtitle || oldSubtitles.includes(parsed.hero.subtitle))) {
          parsed.hero.subtitle = "深圳智鼎味来科技有限公司（简称“智鼎味来”）是一家专注研究与推广中餐标准化多场景商业落地设计与应用，通过人工智能软硬件应用系统集成，助力传统中餐向“标准化、规模化、数智化”方向全面升级的服务商企业。";
          localStorage.setItem("site_data_zh", JSON.stringify(parsed));
        }

        if (!parsed.about) {
          parsed.about = DEFAULT_SITE_DATA.about;
          localStorage.setItem("site_data_zh", JSON.stringify(parsed));
        }

        return parsed;
      } catch (e) {
        console.error("Failed to parse site_data_zh", e);
      }
    }
    return DEFAULT_SITE_DATA;
  });

  // NOTE: 英文版站点文本数据状态
  const [enData, setEnData] = useState<SiteData>(() => {
    const savedData = localStorage.getItem("site_data_en");
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse site_data_en", e);
      }
    }
    return DEFAULT_SITE_DATA_EN;
  });

  // 根据当前激活的语言，导出派生的站点数据
  const siteData = lang === "zh" ? zhData : enData;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // NOTE: 挂载时异步拉取后端物理持久化的数据，并提供 fallback 缓存兜底机制（默认为中文站点更新数据）
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch("http://localhost:9876/api/site-data");
        if (response.ok) {
          const data = await response.json();
          setZhData(data);
          localStorage.setItem("site_data_zh", JSON.stringify(data));
          localStorage.setItem("site_data", JSON.stringify(data));
        }
      } catch (error) {
        console.warn("未能连接至后台持久化服务，自动使用本地 LocalStorage 缓存与默认数据:", error);
      }
    };
    fetchBackendData();
  }, []);

  // NOTE: 跨窗口 LocalStorage 状态热更新 (仅在 embed iframe 内部有效)
  useEffect(() => {
    if (!isEmbed) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "site_data_zh" && e.newValue) {
        try {
          setZhData(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Storage sync failed for zh inside iframe", err);
        }
      } else if (e.key === "site_data_en" && e.newValue) {
        try {
          setEnData(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Storage sync failed for en inside iframe", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isEmbed]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLangChange = (newLang: "zh" | "en") => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
    
    // 悄悄更新 URL query 参数，保证刷新或链接分享时仍处于该语言
    const url = new URL(window.location.href);
    url.searchParams.set("lang", newLang);
    window.history.replaceState({}, "", url.toString());
  };

  const handleSaveSiteData = (newData: SiteData) => {
    if (lang === "zh") {
      setZhData(newData);
      localStorage.setItem("site_data_zh", JSON.stringify(newData));
      localStorage.setItem("site_data", JSON.stringify(newData));
    } else {
      setEnData(newData);
      localStorage.setItem("site_data_en", JSON.stringify(newData));
    }
  };

  const handleLayoutModeChange = (newMode: "desktop" | "mobile") => {
    setLayoutMode(newMode);
    localStorage.setItem("layout_mode", newMode);
    
    // 悄悄更新 URL query 参数，保证刷新或链接分享时仍处于该模式
    const url = new URL(window.location.href);
    url.searchParams.set("layoutMode", newMode);
    window.history.replaceState({}, "", url.toString());
  };

  // 分支 A: 如果是 iframe 嵌入页面，只渲染核心主体，不渲染控制横幅和管理面板
  if (isEmbed) {
    return (
      <>
        <Navbar 
          brandName={siteData.navbar.brandName} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          currentLang={lang}
          onLangChange={handleLangChange}
        />
        <main style={{ marginTop: "0" }}>
          <Hero data={siteData.hero} about={siteData.about} lang={lang} />
          <Showcase data={siteData.showcase} lang={lang} />
          <BentoGrid data={{ founder: siteData.founder, advantages: siteData.advantages }} lang={lang} />
        </main>
        <Footer data={siteData.footer} lang={lang} />
      </>
    );
  }

  // 分支 B: 如果是物理大屏，且切换为移动端适配预览，则渲染仿真 iPhone
  const iframeSrc = `${window.location.origin}${window.location.pathname}?embed=true&layoutMode=mobile&lang=${lang}`;
  const showPhoneSimulator = !isPhysicalMobile && layoutMode === "mobile";

  return (
    <>
      <LayoutSwitcher activeMode={layoutMode} onChange={handleLayoutModeChange} lang={lang} />
      
      {showPhoneSimulator ? (
        <PhoneSimulator src={iframeSrc} />
      ) : (
        <>
          <Navbar 
            brandName={siteData.navbar.brandName} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            hasSwitcher={true}
            currentLang={lang}
            onLangChange={handleLangChange}
          />
          <main style={{ marginTop: "0" }}>
            <Hero data={siteData.hero} about={siteData.about} lang={lang} />
            <Showcase data={siteData.showcase} lang={lang} />
            <BentoGrid data={{ founder: siteData.founder, advantages: siteData.advantages }} lang={lang} />
          </main>
          <Footer data={siteData.footer} lang={lang} />
        </>
      )}

      {/* Floating Visual Admin Dashboard */}
      <AdminPanel 
        siteData={siteData} 
        onSave={handleSaveSiteData} 
      />
    </>
  );
};

export default App;

