import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Hero from "./components/hero/Hero";
import BentoGrid from "./components/bento-grid/BentoGrid";
import Showcase from "./components/showcase/Showcase";
import Footer from "./components/footer/Footer";
import AdminPanel, { type SiteData } from "./components/admin-panel/AdminPanel";
import LayoutSwitcher from "./components/layout-switcher/LayoutSwitcher";
import PhoneSimulator from "./components/phone-simulator/PhoneSimulator";

const DEFAULT_SITE_DATA: SiteData = {
  navbar: {
    brandName: "智鼎味来"
  },
  about: {
    title: "公司简介",
    content: "深圳智鼎味来科技有限公司（简称“智鼎味来”）是一家专注研究与推广中餐标准化多场景商业落地设计与应用，通过人工智能软硬件应用系统集成，助力传统中餐向“标准化、规模化、数智化”方向全面升级的服务商企业。"
  },
  hero: {
    eyebrow: "人工智能时代的餐饮革命",
    title: "科技向膳 美味生活",
    subtitle: "深圳智鼎味来科技有限公司（简称“智鼎味来”）是一家专注研究与推广中餐标准化多场景商业落地设计与应用，通过人工智能软硬件应用系统集成，助力传统中餐向“标准化、规模化、数智化”方向全面升级的服务商企业。"
  },
  showcase: {
    eyebrow: "产品系列",
    title: "卓越性能，硬核出餐",
    products: [
      {
        id: 1,
        model: "ZDWL-300D",
        title: "小锅现炒电磁型商用智能炒菜机",
        description: "擅长单份例牌高温爆炒，适合正餐、特色小炒及盖浇小炒系列连锁快餐等餐饮场景。产品解构设计紧凑，占地面积小，配合高灵敏度电磁感应加热技术，实现精准温控还原菜品烹饪过程中火候曲线复现。支持云端电子菜谱一键下载并发，让每一锅现炒都能还原传统手艺美味。",
        stats: [
          { label: "单锅平均烹饪用时", highlight: "3", text: " min/times" },
          { label: "额定功率", highlight: "8", text: " kW" },
          { label: "输入电压", highlight: "380", text: " V / 50Hz" },
          { label: "单锅出品量", highlight: "0.35-1", text: " kg/锅 (最佳 0.5kg)" },
          { label: "调味料自动添加", highlight: "4路主辅料 + 7路液体调味料", text: " (含勾芡、盐水、味水符合调味汁) 自动添加", fullWidth: true },
          { label: "机器规格尺寸", highlight: "W760 × D740 × H1450", text: " mm", fullWidth: true }
        ],
        image: "",
        imageAlt: "ZDWL-300D 商用智能炒菜机外观展示"
      },
      {
        id: 2,
        model: "ZDWL-350D",
        title: "中型电磁型商用智能炒菜机",
        description: "擅长小批量灵活供餐，兼容小炒和多份拼单一锅成菜，是自选快餐和中小型团餐食堂批量供餐首选。单锅中等容量的设计，配备全自动机械臂倒菜结构，支持精准温控和精量固液体调味料全自动控制，轻松驾驭各个菜系复杂煸炒 and 烧制工艺菜的高效供餐。",
        stats: [
          { label: "单锅平均烹饪用时", highlight: "5", text: " min/times" },
          { label: "额定功率", highlight: "15", text: " kW" },
          { label: "输入电压", highlight: "380", text: " V / 50Hz" },
          { label: "单锅出品量", highlight: "0.5-4", text: " kg/锅 (最佳 2kg)" },
          { label: "调味料自动添加", highlight: "4路主辅料 + 4路粉状料 + 9路液体调味料", text: " (含勾芡和稠酱汁) 自动添加", fullWidth: true },
          { label: "机器规格尺寸", highlight: "W760 × D940 × H1650", text: " mm", fullWidth: true }
        ],
        image: "",
        imageAlt: "ZDWL-350D 中型商用智能炒菜机外观展示"
      },
      {
        id: 3,
        model: "ZDWL-600D",
        title: "大型电磁型商用智能炒菜机",
        description: "大中型团餐集中生产巨无霸，专为企事业单位食堂、高校、医院及中央厨房应用场景而配套。可倾斜式滚筒360度正逆向旋转，配合不同力度及方向的主动搅拌，确保锅内大批量食材均匀加热，实现轻松烹饪高效高产供餐。",
        stats: [
          { label: "单锅平均烹饪用时", highlight: "10", text: " min/times" },
          { label: "额定功率", highlight: "30", text: " kW" },
          { label: "输入电压", highlight: "380", text: " V / 50Hz" },
          { label: "单锅出品量", highlight: "10-30", text: " kg/锅" },
          { label: "机器规格尺寸", highlight: "W1350 × D1250 × H1400", text: " mm", fullWidth: true }
        ],
        image: "",
        imageAlt: "ZDWL-600D 大型商用智能炒菜机外观展示"
      }
    ]
  },
  advantages: {
    sectionEyebrow: "核心技术与优势",
    sectionTitle: "开启智慧烹饪新纪元",
    techTitle: "科技向膳",
    techDesc: "基于自研 AURA 核心烹饪算法与多模态温控感知，100% 精确控制烹饪火候，完美还原大师级颠勺、抛炒与控温火功。",
    techImage: "",
    techImageAlt: "智鼎味来智能烹饪核心技术演示图",
    standardTitle: "中餐标准化落地",
    standardDesc: "云端同步海量精品菜谱，一键下发至终端，完美解决传统餐饮口味波动大、厨师成本高、难以连锁标准化的痛点。",
    syncTitle: "多端智能协同",
    syncDesc: "基于自研物联网中台，实现炒菜设备状态的秒级监控、菜谱配方远程升级及烹饪参数实时校准，轻松管理大型连锁店。"
  },
  founder: {
    name: "程华",
    title: "中餐标准化多场景商业落地先行者",
    bio: "16年专注研究与推广中餐标准化多场景商业落地，探索科技与美食融合，助力传统中餐向“标准化、数字化、智能化”方向全面升级。",
    image: "",
    imageAlt: "智鼎味来创始人程华肖像照",
    badgeLine: "16+ YEARS",
    badgeLabel: "AI COOKING EXPLORATION"
  },
  footer: {
    disclaimer: "本网站的所有智能烹饪硬件结构、物联网云端调度系统及烹饪温控曲线算法均由设备生产制造厂家所有。部分 3D 产品渲染由神经网络自主训练生成，用于功能示意展示。智鼎味来致力于将先进的 AI 科技与传统烹饪艺术深度融汇，开启餐饮智能化革命。",
    address: "深圳市龙华区观澜街道君子布社区君新工业路6号厂房102",
    phone: "15507556167（微信同号）",
    copyright: "Copyright © 2026 深圳智鼎味来科技有限公司. 保留所有权利。",
    columns: [
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
    ]
  }
};

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
    return (savedMode === "desktop" || savedMode === "mobile") ? savedMode : "desktop";
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

