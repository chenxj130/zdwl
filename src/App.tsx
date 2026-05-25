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

const DEFAULT_SITE_DATA: SiteData = customSiteData;

const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("theme");
    return (savedTheme === "light" || savedTheme === "dark") ? savedTheme : "dark";
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
    const savedMode = localStorage.getItem("layout_mode");
    return (savedMode === "desktop" || savedMode === "mobile") ? savedMode : "mobile";
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

  // Dynamic Site Text Data state
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const savedData = localStorage.getItem("site_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const oldTitles = ["每日智鼎 味来无限", "智鼎味来 智能炒菜机", "每日智鼎 味道无限", "智鼎味来 智能炒餐机"];
        if (parsed.hero && oldTitles.includes(parsed.hero.title)) {
          parsed.hero.title = "科技向膳 美味生活";
          localStorage.setItem("site_data", JSON.stringify(parsed));
        }
        const oldSubtitles = [
          "将先进的 AI 算法、物联网技术与中餐烹饪艺术深度融合。通过全自动智能炒菜机，为连锁餐饮、学校食堂、企业团餐等提供「高效、标准、健康」的智能烹饪解决方案。",
          "将先进的AI 算法、物联网技术与中餐烹饪艺术深度融合。通过全自动智能炒菜机，为连锁餐饮、学校食堂、企业团餐等提供「高效、标准、健康」的智能烹饪解决方案。"
        ];
        if (parsed.hero && (!parsed.hero.subtitle || oldSubtitles.includes(parsed.hero.subtitle))) {
          parsed.hero.subtitle = "深圳智鼎味来科技有限公司（简称“智鼎味来”）是一家专注研究与推广中餐标准化多场景商业落地设计与应用，通过人工智能软硬件应用系统集成，助力传统中餐向“标准化、规模化、数智化”方向全面升级的服务商企业。";
          localStorage.setItem("site_data", JSON.stringify(parsed));
        }

        if (!parsed.about) {
          parsed.about = DEFAULT_SITE_DATA.about;
          localStorage.setItem("site_data", JSON.stringify(parsed));
        }

        return parsed;
      } catch (e) {
        console.error("Failed to parse site_data", e);
      }
    }
    return DEFAULT_SITE_DATA;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // NOTE: 挂载时异步拉取后端物理持久化的数据，并提供 fallback 缓存兜底机制
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const response = await fetch("http://localhost:9876/api/site-data");
        if (response.ok) {
          const data = await response.json();
          setSiteData(data);
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
      if (e.key === "site_data" && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setSiteData(updated);
        } catch (err) {
          console.error("Storage sync failed inside iframe", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isEmbed]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleSaveSiteData = (newData: SiteData) => {
    setSiteData(newData);
    localStorage.setItem("site_data", JSON.stringify(newData));
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
        />
        <main style={{ marginTop: "0" }}>
          <Hero data={siteData.hero} about={siteData.about} />
          <Showcase data={siteData.showcase} />
          <BentoGrid data={{ founder: siteData.founder, advantages: siteData.advantages }} />
        </main>
        <Footer data={siteData.footer} />
      </>
    );
  }

  // 分支 B: 如果是物理大屏，且切换为移动端适配预览，则渲染仿真 iPhone
  const iframeSrc = `${window.location.origin}${window.location.pathname}?embed=true&layoutMode=mobile`;
  const showPhoneSimulator = !isPhysicalMobile && layoutMode === "mobile";

  return (
    <>
      <LayoutSwitcher activeMode={layoutMode} onChange={handleLayoutModeChange} />
      
      {showPhoneSimulator ? (
        <PhoneSimulator src={iframeSrc} />
      ) : (
        <>
          <Navbar 
            brandName={siteData.navbar.brandName} 
            theme={theme} 
            toggleTheme={toggleTheme} 
            hasSwitcher={true}
          />
          <main style={{ marginTop: "0" }}>
            <Hero data={siteData.hero} about={siteData.about} />
            <Showcase data={siteData.showcase} />
            <BentoGrid data={{ founder: siteData.founder, advantages: siteData.advantages }} />
          </main>
          <Footer data={siteData.footer} />
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

