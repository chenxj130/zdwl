import React, { useState, useEffect } from "react";
import styles from "./AdminPanel.module.css";

export interface ProductStat {
  label: string;
  highlight: string;
  text: string;
  fullWidth?: boolean;
}

export interface ProductCase {
  id: number;
  model: string;
  title: string;
  description: string;
  stats: ProductStat[];
  image: string;
  imageAlt?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  id: string;
  title: string;
  titleLink?: string;
  links: FooterLink[];
}

export interface SiteData {
  navbar: {
    brandName: string;
  };
  about?: {
    title: string;
    content: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    products: ProductCase[];
  };
  advantages: {
    sectionEyebrow: string;
    sectionTitle: string;
    techTitle: string;
    techDesc: string;
    techImage: string;
    techImageAlt?: string;
    standardTitle: string;
    standardDesc: string;
    syncTitle: string;
    syncDesc: string;
  };
  founder: {
    name: string;
    title: string;
    bio: string;
    image: string;
    imageAlt?: string;
    badgeLine: string;
    badgeLabel: string;
  };
  footer: {
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

interface AdminPanelProps {
  siteData: SiteData;
  onSave: (newData: SiteData) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ siteData, onSave }) => {
  // 相对路径适配工具函数，用于解决 file:// 协议绝对路径寻址 Bug
  const resolveImagePath = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    if (path.startsWith("/")) {
      return path.slice(1);
    }
    return path;
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [activeSection, setActiveSection] = useState<string>("navbar");

  // Form states
  const [navbarBrand, setNavbarBrand] = useState(siteData.navbar.brandName);
  
  const [aboutTitle, setAboutTitle] = useState(siteData.about?.title || "公司简介");
  const [aboutContent, setAboutContent] = useState(siteData.about?.content || "");

  const [heroEyebrow, setHeroEyebrow] = useState(siteData.hero.eyebrow);
  const [heroTitle, setHeroTitle] = useState(siteData.hero.title);
  const [heroSubtitle, setHeroSubtitle] = useState(siteData.hero.subtitle);

  // Showcase States
  const [showcaseEyebrow, setShowcaseEyebrow] = useState(siteData.showcase?.eyebrow || "产品系列");
  const [showcaseTitle, setShowcaseTitle] = useState(siteData.showcase?.title || "卓越性能，硬核出餐");
  const [products, setProducts] = useState<ProductCase[]>(siteData.showcase?.products || []);

  // Advantages States
  const [advantagesEyebrow, setAdvantagesEyebrow] = useState(siteData.advantages?.sectionEyebrow || "核心技术与优势");
  const [advantagesTitle, setAdvantagesTitle] = useState(siteData.advantages?.sectionTitle || "开启智慧烹饪新纪元");
  const [techTitle, setTechTitle] = useState(siteData.advantages.techTitle);
  const [techDesc, setTechDesc] = useState(siteData.advantages.techDesc);
  const [techImage, setTechImage] = useState(siteData.advantages.techImage || "");
  const [techImageAlt, setTechImageAlt] = useState(siteData.advantages.techImageAlt || "");
  const [standardTitle, setStandardTitle] = useState(siteData.advantages.standardTitle);
  const [standardDesc, setStandardDesc] = useState(siteData.advantages.standardDesc);
  const [syncTitle, setSyncTitle] = useState(siteData.advantages.syncTitle);
  const [syncDesc, setSyncDesc] = useState(siteData.advantages.syncDesc);

  // Founder States
  const [founderName, setFounderName] = useState(siteData.founder.name);
  const [founderTitle, setFounderTitle] = useState(siteData.founder.title);
  const [founderBio, setFounderBio] = useState(siteData.founder.bio);
  const [founderImage, setFounderImage] = useState(siteData.founder.image || "");
  const [founderImageAlt, setFounderImageAlt] = useState(siteData.founder.imageAlt || "");
  const [founderBadgeLine, setFounderBadgeLine] = useState(siteData.founder.badgeLine || "16+ YEARS");
  const [founderBadgeLabel, setFounderBadgeLabel] = useState(siteData.founder.badgeLabel || "AI COOKING EXPLORATION");

  // Footer States
  const [footerDisclaimer, setFooterDisclaimer] = useState(siteData.footer?.disclaimer || "");
  const [footerAddress, setFooterAddress] = useState(siteData.footer?.address || "");
  const [footerPhone, setFooterPhone] = useState(siteData.footer?.phone || "");
  const [footerCopyright, setFooterCopyright] = useState(siteData.footer?.copyright || "");
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>(
    (siteData.footer?.columns && siteData.footer.columns.length > 0) ? siteData.footer.columns : DEFAULT_COLUMNS
  );

  // 检查本地 Token 自动解锁
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token === "mock_admin_token_session_2026") {
      setIsUnlocked(true);
    }
  }, []);

  // Sync state if parent props change
  useEffect(() => {
    setNavbarBrand(siteData.navbar.brandName);
    
    setAboutTitle(siteData.about?.title || "公司简介");
    setAboutContent(siteData.about?.content || "");

    setHeroEyebrow(siteData.hero.eyebrow);
    setHeroTitle(siteData.hero.title);
    setHeroSubtitle(siteData.hero.subtitle);

    setShowcaseEyebrow(siteData.showcase?.eyebrow || "产品系列");
    setShowcaseTitle(siteData.showcase?.title || "卓越性能，硬核出餐");
    setProducts(siteData.showcase?.products || []);

    setAdvantagesEyebrow(siteData.advantages?.sectionEyebrow || "核心技术与优势");
    setAdvantagesTitle(siteData.advantages?.sectionTitle || "开启智慧烹饪新纪元");
    setTechTitle(siteData.advantages.techTitle);
    setTechDesc(siteData.advantages.techDesc);
    setTechImage(siteData.advantages.techImage || "");
    setTechImageAlt(siteData.advantages.techImageAlt || "");
    setStandardTitle(siteData.advantages.standardTitle);
    setStandardDesc(siteData.advantages.standardDesc);
    setSyncTitle(siteData.advantages.syncTitle);
    setSyncDesc(siteData.advantages.syncDesc);

    setFounderName(siteData.founder.name);
    setFounderTitle(siteData.founder.title);
    setFounderBio(siteData.founder.bio);
    setFounderImage(siteData.founder.image || "");
    setFounderImageAlt(siteData.founder.imageAlt || "");
    setFounderBadgeLine(siteData.founder.badgeLine || "16+ YEARS");
    setFounderBadgeLabel(siteData.founder.badgeLabel || "AI COOKING EXPLORATION");

    setFooterDisclaimer(siteData.footer?.disclaimer || "");
    setFooterAddress(siteData.footer?.address || "");
    setFooterPhone(siteData.footer?.phone || "");
    setFooterCopyright(siteData.footer?.copyright || "");
    setFooterColumns(
      (siteData.footer?.columns && siteData.footer.columns.length > 0) ? siteData.footer.columns : DEFAULT_COLUMNS
    );
  }, [siteData]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch("http://localhost:9876/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordInput }),
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        localStorage.setItem("admin_token", resData.token);
        setIsUnlocked(true);
        setPasswordInput("");
      } else {
        setErrorMsg(resData.error || "登录失败，请检查密码");
      }
    } catch (err) {
      // 离线 Fallback: 后端离线时，本地输入 admin 依然允许编辑 localStorage，保障离线演示可用性
      if (passwordInput === "admin") {
        localStorage.setItem("admin_token", "mock_admin_token_session_2026");
        setIsUnlocked(true);
        setErrorMsg("");
        setPasswordInput("");
      } else {
        setErrorMsg("密码错误，请输入正确的管理员密码");
      }
    }
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    setProducts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleProductStatChange = (prodIndex: number, statIndex: number, field: string, value: any) => {
    setProducts((prev) => {
      const copy = [...prev];
      const prodCopy = { ...copy[prodIndex] };
      const statsCopy = [...prodCopy.stats];
      statsCopy[statIndex] = { ...statsCopy[statIndex], [field]: value };
      prodCopy.stats = statsCopy;
      copy[prodIndex] = prodCopy;
      return copy;
    });
  };

  const handleAddProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts((prev) => [
      ...prev,
      {
        id: newId,
        model: "新产品型号",
        title: "新产品名称",
        description: "请输入新产品相关的技术参数及文字描述。",
        stats: [
          { label: "单锅平均烹饪用时", highlight: "3", text: " min/times" },
          { label: "额定功率", highlight: "8", text: " kW" }
        ],
        image: "",
        imageAlt: "新产品外观展示",
        videoUrl: "",
        audioUrl: ""
      }
    ]);
    setToastMsg("新产品已成功添加！请配置其参数与资源。");
    setTimeout(() => setToastMsg(""), 1500);
  };

  const handleDeleteProduct = (index: number) => {
    if (window.confirm("确定要彻底删除这款产品吗？此操作无法撤销。")) {
      setProducts((prev) => prev.filter((_, idx) => idx !== index));
      setToastMsg("产品已删除。");
      setTimeout(() => setToastMsg(""), 1500);
    }
  };

  const handleAddProductStat = (prodIndex: number) => {
    setProducts((prev) => {
      const copy = [...prev];
      const prodCopy = { ...copy[prodIndex] };
      prodCopy.stats = [...(prodCopy.stats || []), { label: "新参数标签", highlight: "数值", text: "单位" }];
      copy[prodIndex] = prodCopy;
      return copy;
    });
  };

  const handleDeleteProductStat = (prodIndex: number, statIndex: number) => {
    setProducts((prev) => {
      const copy = [...prev];
      const prodCopy = { ...copy[prodIndex] };
      prodCopy.stats = prodCopy.stats.filter((_, idx) => idx !== statIndex);
      copy[prodIndex] = prodCopy;
      return copy;
    });
  };

  const handleFooterColChange = (colIdx: number, field: string, value: string) => {
    setFooterColumns((prev) => {
      const copy = [...prev];
      copy[colIdx] = { ...copy[colIdx], [field]: value };
      return copy;
    });
  };

  const handleFooterLinkChange = (colIdx: number, linkIdx: number, field: "text" | "href", value: string) => {
    setFooterColumns((prev) => {
      const copy = [...prev];
      const colCopy = { ...copy[colIdx] };
      const linksCopy = [...colCopy.links];
      linksCopy[linkIdx] = { ...linksCopy[linkIdx], [field]: value };
      colCopy.links = linksCopy;
      copy[colIdx] = colCopy;
      return copy;
    });
  };

  const addFooterLink = (colIdx: number) => {
    setFooterColumns((prev) => {
      const copy = [...prev];
      const colCopy = { ...copy[colIdx] };
      colCopy.links = [...colCopy.links, { text: "新链接", href: "#" }];
      copy[colIdx] = colCopy;
      return copy;
    });
  };

  const deleteFooterLink = (colIdx: number, linkIdx: number) => {
    setFooterColumns((prev) => {
      const copy = [...prev];
      const colCopy = { ...copy[colIdx] };
      colCopy.links = colCopy.links.filter((_, idx) => idx !== linkIdx);
      copy[colIdx] = colCopy;
      return copy;
    });
  };

  const deleteFooterColumn = (colIdx: number) => {
    if (window.confirm("确定要删除这一整列导航吗？")) {
      setFooterColumns((prev) => prev.filter((_, idx) => idx !== colIdx));
    }
  };

  const addFooterColumn = () => {
    if (footerColumns.length >= 5) {
      alert("最多只能配置 5 列导航栏。");
      return;
    }
    const newColId = `col_${Date.now()}`;
    setFooterColumns((prev) => [
      ...prev,
      {
        id: newColId,
        title: "新导航列",
        titleLink: "#",
        links: [{ text: "新子链接", href: "#" }]
      }
    ]);
  };

  const resetFooterColumns = () => {
    if (window.confirm("确定要将页脚导航重置为默认的5列配置吗？这会覆盖当前编辑的内容。")) {
      setFooterColumns(DEFAULT_COLUMNS);
    }
  };

  const handleClearImage = (targetField: "techImage" | "founderImage" | "productImage", productIndex?: number) => {
    if (targetField === "techImage") {
      setTechImage("");
    } else if (targetField === "founderImage") {
      setFounderImage("");
    } else if (targetField === "productImage" && productIndex !== undefined) {
      setProducts((prev) => {
        const copy = [...prev];
        copy[productIndex] = { ...copy[productIndex], image: "" };
        return copy;
      });
    }
  };

  const handleUploadClick = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "techImage" | "founderImage" | "productImage", productIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      setErrorMsg("只支持 jpg, jpeg, png, gif, webp, svg 格式图片");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("admin_token") || "";
    setIsSaving(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:9876/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const uploadedUrl = resData.url;
        if (targetField === "techImage") {
          setTechImage(uploadedUrl);
        } else if (targetField === "founderImage") {
          setFounderImage(uploadedUrl);
        } else if (targetField === "productImage" && productIndex !== undefined) {
          setProducts((prev) => {
            const copy = [...prev];
            copy[productIndex] = { ...copy[productIndex], image: uploadedUrl };
            return copy;
          });
        }
        setToastMsg("图片上传成功！");
        setTimeout(() => setToastMsg(""), 1500);
      } else {
        setErrorMsg(resData.error || "图片上传失败");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("图片上传异常，请确保后台代理已启动");
    } finally {
      setIsSaving(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg("");
    
    const updatedData: SiteData = {
      navbar: {
        brandName: navbarBrand
      },
      about: {
        title: aboutTitle,
        content: aboutContent
      },
      hero: {
        eyebrow: heroEyebrow,
        title: heroTitle,
        subtitle: heroSubtitle
      },
      showcase: {
        eyebrow: showcaseEyebrow,
        title: showcaseTitle,
        products: products
      },
      advantages: {
        sectionEyebrow: advantagesEyebrow,
        sectionTitle: advantagesTitle,
        techTitle,
        techDesc,
        techImage,
        techImageAlt,
        standardTitle,
        standardDesc,
        syncTitle,
        syncDesc
      },
      founder: {
        name: founderName,
        title: founderTitle,
        bio: founderBio,
        image: founderImage,
        imageAlt: founderImageAlt,
        badgeLine: founderBadgeLine,
        badgeLabel: founderBadgeLabel
      },
      footer: {
        disclaimer: footerDisclaimer,
        address: footerAddress,
        phone: footerPhone,
        copyright: footerCopyright,
        columns: footerColumns
      }
    };

    const token = localStorage.getItem("admin_token") || "";

    try {
      const response = await fetch("http://localhost:9876/api/site-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      const resData = await response.json();
      if (response.ok && resData.success) {
        onSave(updatedData);
        setToastMsg("保存并发布成功！");
        setTimeout(() => {
          setToastMsg("");
          setIsOpen(false);
        }, 1500);
      } else {
        setErrorMsg(resData.error || "保存失败，请重新登录");
        if (response.status === 401) {
          localStorage.removeItem("admin_token");
          setIsUnlocked(false);
        }
      }
    } catch (err) {
      // 离线 Fallback
      onSave(updatedData);
      setToastMsg("本地保存成功 (持久化后端未连通)");
      setTimeout(() => {
        setToastMsg("");
        setIsOpen(false);
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsUnlocked(false);
    setPasswordInput("");
    setErrorMsg("");
  };

  const handleClose = () => {
    if (isSaving) return;
    setIsOpen(false);
    setPasswordInput("");
    setErrorMsg("");
  };

  const renderImageUpload = (
    label: string, 
    value: string, 
    targetField: "techImage" | "founderImage" | "productImage", 
    productIndex?: number,
    altValue?: string,
    onAltChange?: (newAlt: string) => void
  ) => {
    return (
      <div className={styles.imageUploadGroup}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label className={styles.uploadLabel}>{label}</label>
          <div>
            {value ? (
              <span className={styles.badgeUploaded}>✅ 已物理上传</span>
            ) : (
              <span className={styles.badgeDefault}>ℹ️ 默认本地图片</span>
            )}
          </div>
        </div>
        <div className={styles.imageUploadControl}>
          <div className={styles.imagePreviewWrapper}>
            {value ? (
              <img src={resolveImagePath(value)} alt="Preview" className={styles.imagePreview} />
            ) : (
              <div className={styles.emptyPreview}>默认本地图片</div>
            )}
          </div>
          <div className={styles.imageUploadActions}>
            <div className={styles.fileInputWrapper}>
              <button type="button" className={styles.uploadBtn}>
                {isSaving ? "正在上传..." : "上传新图片"}
              </button>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleUploadClick(e, targetField, productIndex)} 
                disabled={isSaving}
                className={styles.hiddenFileInput}
              />
            </div>
            {value && (
              <button 
                type="button" 
                className={styles.clearImageBtn}
                onClick={() => handleClearImage(targetField, productIndex)}
                disabled={isSaving}
              >
                清除/恢复默认
              </button>
            )}
          </div>
        </div>
        <div className={styles.imageUrlInputGroup}>
          <span className={styles.urlLabel}>图片路径/URL</span>
          <input 
            type="text" 
            className={styles.inputField} 
            value={value} 
            onChange={(e) => {
              const val = e.target.value;
              if (targetField === "techImage") {
                setTechImage(val);
              } else if (targetField === "founderImage") {
                setFounderImage(val);
              } else if (targetField === "productImage" && productIndex !== undefined) {
                setProducts((prev) => {
                  const copy = [...prev];
                  copy[productIndex] = { ...copy[productIndex], image: val };
                  return copy;
                });
              }
            }}
            placeholder="上传后自动生成，也可手动填入相对或绝对路径"
          />
        </div>
        {onAltChange && (
          <div className={styles.imageUrlInputGroup} style={{ marginTop: "10px" }}>
            <span className={styles.urlLabel}>图片标识 (Alt 文字)</span>
            <input 
              type="text" 
              className={styles.inputField} 
              value={altValue || ""} 
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="用于无障碍与 SEO 优化，描述图片中的内容"
            />
          </div>
        )}
      </div>
    );
  };

  const handleMediaUploadClick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: "productVideo" | "productAudio",
    productIndex: number,
    allowedExts: string[]
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExts.includes(ext)) {
      setErrorMsg(`只支持 ${allowedExts.join(", ")} 格式文件`);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("admin_token") || "";
    setIsSaving(true);
    setErrorMsg("");

    try {
      const response = await fetch("http://localhost:9876/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        const uploadedUrl = resData.url;
        const fieldName = targetField === "productVideo" ? "videoUrl" : "audioUrl";
        setProducts((prev) => {
          const copy = [...prev];
          copy[productIndex] = { ...copy[productIndex], [fieldName]: uploadedUrl };
          return copy;
        });
        setToastMsg("媒体文件上传成功！");
        setTimeout(() => setToastMsg(""), 1500);
      } else {
        setErrorMsg(resData.error || "媒体文件上传失败");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("媒体文件上传异常，请确保后台代理已启动");
    } finally {
      setIsSaving(false);
      e.target.value = "";
    }
  };

  const renderMediaUpload = (
    label: string, 
    value: string, 
    targetField: "productVideo" | "productAudio", 
    productIndex: number,
    acceptType: string,
    allowedExts: string[]
  ) => {
    const isVideo = targetField === "productVideo";
    const fieldName = isVideo ? "videoUrl" : "audioUrl";
    return (
      <div className={styles.imageUploadGroup} style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <label className={styles.uploadLabel}>{label}</label>
          <div>
            {value ? (
              <span className={styles.badgeUploaded}>✅ 已物理上传</span>
            ) : (
              <span className={styles.badgeDefault}>ℹ️ 暂无资源 (可选)</span>
            )}
          </div>
        </div>
        <div className={styles.imageUploadControl}>
          <div className={styles.imagePreviewWrapper} style={{ height: "46px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {value ? (
              <span style={{ fontSize: "11px", color: "var(--color-link)", wordBreak: "break-all", textAlign: "center", padding: "0 8px" }}>
                {value.substring(value.lastIndexOf('/') + 1) || value}
              </span>
            ) : (
              <div className={styles.emptyPreview}>暂无文件</div>
            )}
          </div>
          <div className={styles.imageUploadActions}>
            <div className={styles.fileInputWrapper}>
              <button type="button" className={styles.uploadBtn}>
                {isSaving ? "正在上传..." : "上传文件"}
              </button>
              <input 
                type="file" 
                accept={acceptType} 
                onChange={(e) => handleMediaUploadClick(e, targetField, productIndex, allowedExts)} 
                disabled={isSaving}
                className={styles.hiddenFileInput}
              />
            </div>
            {value && (
              <button 
                type="button" 
                className={styles.clearImageBtn}
                onClick={() => {
                  setProducts((prev) => {
                    const copy = [...prev];
                    copy[productIndex] = { ...copy[productIndex], [fieldName]: "" };
                    return copy;
                  });
                }}
                disabled={isSaving}
              >
                清除/恢复
              </button>
            )}
          </div>
        </div>
        <div className={styles.imageUrlInputGroup}>
          <span className={styles.urlLabel}>资源路径/URL</span>
          <input 
            type="text" 
            className={styles.inputField} 
            value={value || ""} 
            onChange={(e) => {
              const val = e.target.value;
              setProducts((prev) => {
                const copy = [...prev];
                copy[productIndex] = { ...copy[productIndex], [fieldName]: val };
                return copy;
              });
            }}
            placeholder="上传后自动生成，也可手动输入外部视频/音频 URL"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Gear Button in Corner */}
      <button 
        className={styles.adminTrigger} 
        onClick={() => setIsOpen(true)}
        aria-label="Open administration panel"
        title="网站内容管理后台"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {/* Drawer Overlay */}
      <div 
        className={`${styles.drawerOverlay} ${isOpen ? styles.drawerOverlayActive : ""}`} 
        onClick={handleClose}
      ></div>

      {/* Drawer Content */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerActive : ""}`}>
        <div className={styles.header}>
          <h3>网站内容可视化管理后台</h3>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Close panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {!isUnlocked ? (
          /* Password Lock view */
          <div style={{ padding: "40px 24px" }}>
            <form onSubmit={handleUnlock} className={styles.lockModal}>
              <div className={styles.lockTitle}>访问管理员后台</div>
              <div className={styles.lockDesc}>此区域受密码保护，请输入管理员密码进行操作。 (默认密码: <code>admin</code>)</div>
              
              <div className={styles.formGroup}>
                <input 
                  type="password" 
                  className={styles.inputField} 
                  placeholder="请输入管理密码" 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                {errorMsg && <span className={styles.errorText}>{errorMsg}</span>}
              </div>

              <button type="submit" className={styles.saveBtn} style={{ marginTop: "12px", width: "100%" }}>
                进入后台
              </button>
            </form>
          </div>
        ) : (
          /* Editor Dashboard view */
          <>
            <div className={styles.content}>
              {/* Accordion List */}
              <div className={styles.accordionList}>
                {/* 1. 全局导航配置 */}
                <div className={`${styles.accordionSection} ${activeSection === "navbar" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "navbar" ? "" : "navbar")}
                  >
                    <span>全局导航配置</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>品牌/Logo名称</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={navbarBrand} 
                        onChange={(e) => setNavbarBrand(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 首页首屏巨幕 */}
                <div className={`${styles.accordionSection} ${activeSection === "hero" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "hero" ? "" : "hero")}
                  >
                    <span>首页首屏巨幕 (Hero)</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>标题上方小字 (Eyebrow)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={heroEyebrow} 
                        onChange={(e) => setHeroEyebrow(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>主标题 (Title)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={heroTitle} 
                        onChange={(e) => setHeroTitle(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>副标题 (Subtitle)</label>
                      <textarea 
                        className={styles.textareaField} 
                        value={heroSubtitle} 
                        onChange={(e) => setHeroSubtitle(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 2.5 公司简介 */}
                <div className={`${styles.accordionSection} ${activeSection === "about" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "about" ? "" : "about")}
                  >
                    <span>公司简介 (About)</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>板块标题 (Title)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={aboutTitle} 
                        onChange={(e) => setAboutTitle(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>简介正文 (Content)</label>
                      <textarea 
                        className={styles.textareaField} 
                        value={aboutContent} 
                        onChange={(e) => setAboutContent(e.target.value)} 
                        style={{ height: "120px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. 产品系列配置 */}
                <div className={`${styles.accordionSection} ${activeSection === "showcase" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "showcase" ? "" : "showcase")}
                  >
                    <span>产品系列配置 (Showcase)</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>板块小标题 (Eyebrow)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={showcaseEyebrow} 
                        onChange={(e) => setShowcaseEyebrow(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>板块大标题 (Title)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={showcaseTitle} 
                        onChange={(e) => setShowcaseTitle(e.target.value)} 
                      />
                    </div>

                    {products.map((prod, idx) => (
                      <div key={prod.id} className={styles.productEditBlock}>
                        <div className={styles.productBlockTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>产品 {idx + 1}: {prod.model || `产品 ID ${prod.id}`}</span>
                          <button
                            type="button"
                            className={styles.deleteColBtn}
                            onClick={() => handleDeleteProduct(idx)}
                            title="删除此产品"
                          >
                            删除产品
                          </button>
                        </div>
                        <div className={styles.formGroup}>
                          <label>产品型号</label>
                          <input 
                            type="text" 
                            className={styles.inputField} 
                            value={prod.model} 
                            onChange={(e) => handleProductChange(idx, "model", e.target.value)} 
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>产品名称</label>
                          <input 
                            type="text" 
                            className={styles.inputField} 
                            value={prod.title} 
                            onChange={(e) => handleProductChange(idx, "title", e.target.value)} 
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>产品描述</label>
                          <textarea 
                            className={styles.textareaField} 
                            value={prod.description} 
                            onChange={(e) => handleProductChange(idx, "description", e.target.value)} 
                          />
                        </div>
                        
                        {/* 产品大图上传 */}
                        {renderImageUpload(
                          `产品大图 (推荐尺寸 16:9 镂空图)`, 
                          prod.image, 
                          "productImage", 
                          idx, 
                          prod.imageAlt || "", 
                          (newAlt) => handleProductChange(idx, "imageAlt", newAlt)
                        )}

                        {/* 产品音视频配置 */}
                        {renderMediaUpload(
                          `演示视频 (支持 mp4, mov, webm)`,
                          prod.videoUrl || "",
                          "productVideo",
                          idx,
                          "video/*",
                          ["mp4", "mov", "webm"]
                        )}
                        {renderMediaUpload(
                          `语音介绍音频 (支持 mp3, wav, m4a, ogg)`,
                          prod.audioUrl || "",
                          "productAudio",
                          idx,
                          "audio/*",
                          ["mp3", "wav", "m4a", "ogg"]
                        )}

                        {/* 指标配置 */}
                        <div className={styles.statsSectionLabel}>核心性能指标配置</div>
                        {(prod.stats || []).map((stat, statIdx) => (
                          <div key={statIdx} className={styles.statEditCard}>
                            <div className={styles.statEditHeader} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>指标 {statIdx + 1}</span>
                              <button
                                type="button"
                                className={styles.deleteColBtn}
                                style={{ padding: "2px 6px", fontSize: "10px" }}
                                onClick={() => handleDeleteProductStat(idx, statIdx)}
                                title="删除此指标"
                              >
                                删除指标
                              </button>
                            </div>
                            <div className={styles.grid2Col}>
                              <div className={styles.formGroup}>
                                <label>指标标签 (如 "温控精度")</label>
                                <input 
                                  type="text" 
                                  className={styles.inputField} 
                                  value={stat.label} 
                                  onChange={(e) => handleProductStatChange(idx, statIdx, "label", e.target.value)} 
                                />
                              </div>
                              <div className={styles.formGroup}>
                                <label>高亮数值 (如 "±0.1")</label>
                                <input 
                                  type="text" 
                                  className={styles.inputField} 
                                  value={stat.highlight} 
                                  onChange={(e) => handleProductStatChange(idx, statIdx, "highlight", e.target.value)} 
                                />
                              </div>
                            </div>
                            <div className={styles.formGroup}>
                              <label>指标描述文案 (如 "°C")</label>
                              <input 
                                type="text" 
                                className={styles.inputField} 
                                value={stat.text} 
                                onChange={(e) => handleProductStatChange(idx, statIdx, "text", e.target.value)} 
                              />
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className={styles.addLinkBtn}
                          style={{ marginTop: "4px", marginBottom: "16px" }}
                          onClick={() => handleAddProductStat(idx)}
                        >
                          + 添加参数指标
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className={styles.addColBtn}
                      style={{ marginTop: "16px", width: "100%" }}
                      onClick={handleAddProduct}
                    >
                      + 添加新产品
                    </button>
                  </div>
                </div>

                {/* 4. 核心技术与优势 */}
                <div className={`${styles.accordionSection} ${activeSection === "advantages" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "advantages" ? "" : "advantages")}
                  >
                    <span>核心技术与优势 (Bento Grid)</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>板块小标题 (Eyebrow)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={advantagesEyebrow} 
                        onChange={(e) => setAdvantagesEyebrow(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>板块大标题 (Title)</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={advantagesTitle} 
                        onChange={(e) => setAdvantagesTitle(e.target.value)} 
                      />
                    </div>

                    {/* 卡片一 */}
                    <div className={styles.productEditBlock}>
                      <div className={styles.productBlockTitle}>优势卡片 1 - 核心科技</div>
                      <div className={styles.formGroup}>
                        <label>卡片标题</label>
                        <input 
                          type="text" 
                          className={styles.inputField} 
                          value={techTitle} 
                          onChange={(e) => setTechTitle(e.target.value)} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>卡片描述</label>
                        <textarea 
                          className={styles.textareaField} 
                          value={techDesc} 
                          onChange={(e) => setTechDesc(e.target.value)} 
                        />
                      </div>
                      {/* 上传卡片背景图 */}
                      {renderImageUpload(
                        "核心科技背景图", 
                        techImage, 
                        "techImage", 
                        undefined, 
                        techImageAlt, 
                        setTechImageAlt
                      )}
                    </div>

                    {/* 卡片二 */}
                    <div className={styles.productEditBlock}>
                      <div className={styles.productBlockTitle}>优势卡片 2 - 解决痛点</div>
                      <div className={styles.formGroup}>
                        <label>卡片标题</label>
                        <input 
                          type="text" 
                          className={styles.inputField} 
                          value={standardTitle} 
                          onChange={(e) => setStandardTitle(e.target.value)} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>卡片描述</label>
                        <textarea 
                          className={styles.textareaField} 
                          value={standardDesc} 
                          onChange={(e) => setStandardDesc(e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* 卡片三 */}
                    <div className={styles.productEditBlock}>
                      <div className={styles.productBlockTitle}>优势卡片 3 - 物联控制</div>
                      <div className={styles.formGroup}>
                        <label>卡片标题</label>
                        <input 
                          type="text" 
                          className={styles.inputField} 
                          value={syncTitle} 
                          onChange={(e) => setSyncTitle(e.target.value)} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>卡片描述</label>
                        <textarea 
                          className={styles.textareaField} 
                          value={syncDesc} 
                          onChange={(e) => setSyncDesc(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. 创始人与科研实力 */}
                <div className={`${styles.accordionSection} ${activeSection === "founder" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "founder" ? "" : "founder")}
                  >
                    <span>创始人与科研实力</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>创始人姓名</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={founderName} 
                        onChange={(e) => setFounderName(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>核心头衔</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={founderTitle} 
                        onChange={(e) => setFounderTitle(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>人物履历</label>
                      <textarea 
                        className={styles.textareaField} 
                        value={founderBio} 
                        onChange={(e) => setFounderBio(e.target.value)} 
                      />
                    </div>

                    {/* 上传照片 */}
                    {renderImageUpload(
                      "创始人照片 (推荐竖版半身像)", 
                      founderImage, 
                      "founderImage", 
                      undefined, 
                      founderImageAlt, 
                      setFounderImageAlt
                    )}

                    <div className={styles.grid2Col} style={{ marginTop: "16px" }}>
                      <div className={styles.formGroup}>
                        <label>荣誉勋章文案</label>
                        <input 
                          type="text" 
                          className={styles.inputField} 
                          value={founderBadgeLine} 
                          onChange={(e) => setFounderBadgeLine(e.target.value)} 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>勋章说明小字</label>
                        <input 
                          type="text" 
                          className={styles.inputField} 
                          value={founderBadgeLabel} 
                          onChange={(e) => setFounderBadgeLabel(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. 底部信息栏 */}
                <div className={`${styles.accordionSection} ${activeSection === "footer" ? styles.sectionExpanded : ""}`}>
                  <button 
                    type="button" 
                    className={styles.accordionHeader} 
                    onClick={() => setActiveSection(activeSection === "footer" ? "" : "footer")}
                  >
                    <span>底部信息栏 (Footer)</span>
                    <svg className={styles.accordionArrow} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div className={styles.accordionContent}>
                    <div className={styles.formGroup}>
                      <label>研发免责声明</label>
                      <textarea 
                        className={styles.textareaField} 
                        style={{ height: "100px" }}
                        value={footerDisclaimer} 
                        onChange={(e) => setFooterDisclaimer(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>办公地标地址</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={footerAddress} 
                        onChange={(e) => setFooterAddress(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>商务联系电话</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={footerPhone} 
                        onChange={(e) => setFooterPhone(e.target.value)} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Copyright版权声明</label>
                      <input 
                        type="text" 
                        className={styles.inputField} 
                        value={footerCopyright} 
                        onChange={(e) => setFooterCopyright(e.target.value)} 
                      />
                    </div>

                    {/* 底部导航列配置 */}
                    <div className={styles.footerColumnsSection}>
                      <div className={styles.statsSectionLabel} style={{ marginTop: "24px", marginBottom: "12px" }}>
                        底部导航列配置 (最多5列)
                      </div>
                      {(footerColumns || []).map((col, colIdx) => (
                        <div key={col.id || colIdx} className={styles.footerColEditBlock}>
                          <div className={styles.productBlockTitle} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>第 {colIdx + 1} 列: {col.title || `未命名列`}</span>
                            <button
                              type="button"
                              className={styles.deleteColBtn}
                              onClick={() => deleteFooterColumn(colIdx)}
                              title="删除此列配置"
                            >
                              删除整列
                            </button>
                          </div>
                          <div className={styles.grid2Col}>
                            <div className={styles.formGroup}>
                              <label>列标题</label>
                              <input 
                                type="text" 
                                className={styles.inputField} 
                                value={col.title} 
                                onChange={(e) => handleFooterColChange(colIdx, "title", e.target.value)} 
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label>标题链接 (如 #advantages 或 /#advantages)</label>
                              <input 
                                type="text" 
                                className={styles.inputField} 
                                value={col.titleLink || ""} 
                                onChange={(e) => handleFooterColChange(colIdx, "titleLink", e.target.value)} 
                                placeholder="点击标题时的跳转路径，例如 #advantages"
                              />
                            </div>
                          </div>

                          <div className={styles.linksSubSection}>
                            <label className={styles.uploadLabel} style={{ display: "block", marginBottom: "8px" }}>子链接列表</label>
                            {(col.links || []).map((link, linkIdx) => (
                              <div key={linkIdx} className={styles.footerLinkRow}>
                                <input 
                                  type="text" 
                                  className={styles.inputField} 
                                  value={link.text} 
                                  onChange={(e) => handleFooterLinkChange(colIdx, linkIdx, "text", e.target.value)} 
                                  placeholder="链接文字"
                                  style={{ flex: 2 }}
                                />
                                <input 
                                  type="text" 
                                  className={styles.inputField} 
                                  value={link.href} 
                                  onChange={(e) => handleFooterLinkChange(colIdx, linkIdx, "href", e.target.value)} 
                                  placeholder="链接地址"
                                  style={{ flex: 3 }}
                                />
                                <button 
                                  type="button" 
                                  className={styles.deleteLinkBtn} 
                                  onClick={() => deleteFooterLink(colIdx, linkIdx)}
                                  title="删除此链接"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            ))}
                            <button 
                              type="button" 
                              className={styles.addLinkBtn} 
                              onClick={() => addFooterLink(colIdx)}
                            >
                              + 添加子链接
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                        {footerColumns.length < 5 && (
                          <button
                            type="button"
                            className={styles.addColBtn}
                            onClick={addFooterColumn}
                          >
                            + 新增导航列 ({footerColumns.length}/5)
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.resetColBtn}
                          onClick={resetFooterColumns}
                        >
                          🔄 重置为默认导航列配置
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button 
                type="button" 
                className={styles.logoutBtn} 
                onClick={handleLogout}
                disabled={isSaving}
              >
                注销登录
              </button>
              <div className={styles.footerRight}>
                <button 
                  type="button" 
                  className={styles.cancelBtn} 
                  onClick={handleClose} 
                  disabled={isSaving}
                >
                  取消
                </button>
                <button 
                  type="button" 
                  className={styles.saveBtn} 
                  onClick={handleSave} 
                  disabled={isSaving}
                >
                  {isSaving ? "正在保存..." : "保存并发布"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toastMsg && (
        <div className={styles.toast}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "#34C759" }}>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
