/**
 * 数据分析 LocalStorage 存储层
 *
 * 负责所有分析数据的读写操作：页面访问、区块停留时长、预约记录
 * 数据保留策略：尽可能保留全量数据，仅在 LocalStorage 空间不足时才清理最早的记录
 */

// ─── 存储键常量 ─────────────────────────────────────────────
const KEYS = {
  PAGE_VIEWS: "analytics_pageviews",
  TOTAL_VIEWS: "analytics_total_views",
  SECTION_DURATIONS: "analytics_section_durations",
  BOOKINGS: "analytics_bookings",
} as const;

// ─── 数据类型定义 ─────────────────────────────────────────────

export interface PageViewRecord {
  /** ISO 8601 时间戳 */
  timestamp: string;
  /** 页面路径 */
  page: string;
  /** 来源（referrer） */
  referrer: string;
  /** 用户代理标识 */
  ua: string;
  /** 设备类型推断 */
  device: "desktop" | "mobile";
}

export interface SectionDuration {
  /** 区块 ID（如 hero, showcase, bento-grid 等） */
  sectionId: string;
  /** 累计可见秒数 */
  totalSeconds: number;
  /** 最后一次更新时间 */
  lastUpdated: string;
}

export interface BookingRecord {
  /** 唯一标识 */
  id: string;
  /** 预约人姓名 */
  name: string;
  /** 联系电话 */
  phone: string;
  /** 预约提交时间 (ISO 8601) */
  timestamp: string;
  /** 处理状态 */
  status: "pending" | "contacted" | "completed";
}

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  recentDailyViews: { date: string; count: number }[];
  deviceBreakdown: { desktop: number; mobile: number };
  sectionDurations: SectionDuration[];
  totalBookings: number;
  todayBookings: number;
  bookingsByStatus: { pending: number; contacted: number; completed: number };
  recentDailyBookings: { date: string; count: number }[];
}

// ─── 内部工具函数 ─────────────────────────────────────────────

/**
 * 安全读取 LocalStorage JSON 数据
 * NOTE: 当解析失败或键不存在时返回 fallback 值，避免 JSON.parse 异常中断流程
 */
function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * 安全写入 LocalStorage JSON 数据
 * NOTE: 当 LocalStorage 空间不足时捕获 QuotaExceededError 并尝试缩减数据
 */
function safeWrite<T>(key: string, data: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    // 空间不足时尝试清理最早 20% 的页面访问记录
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      try {
        const views = safeRead<PageViewRecord[]>(KEYS.PAGE_VIEWS, []);
        const trimCount = Math.max(1, Math.floor(views.length * 0.2));
        const trimmed = views.slice(trimCount);
        localStorage.setItem(KEYS.PAGE_VIEWS, JSON.stringify(trimmed));
        // 重试写入
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch {
        console.error("LocalStorage 空间严重不足，无法写入分析数据");
        return false;
      }
    }
    console.error("LocalStorage 写入失败:", e);
    return false;
  }
}

/** 判断是否为移动设备 */
function detectDevice(): "desktop" | "mobile" {
  if (typeof navigator === "undefined") return "desktop";
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth <= 768;
  return isMobileUA || isSmallScreen ? "mobile" : "desktop";
}

/** 获取今天的 ISO 日期字符串 (YYYY-MM-DD) */
function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 获取 N 天前的 ISO 日期字符串 */
function getDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ─── 页面访问 API ─────────────────────────────────────────────

/** 记录一次页面访问 */
export function addPageView(): void {
  const record: PageViewRecord = {
    timestamp: new Date().toISOString(),
    page: window.location.pathname + window.location.search,
    referrer: document.referrer || "direct",
    ua: navigator.userAgent,
    device: detectDevice(),
  };

  const views = safeRead<PageViewRecord[]>(KEYS.PAGE_VIEWS, []);
  views.push(record);
  safeWrite(KEYS.PAGE_VIEWS, views);

  // 总量计数器独立存储（更高效）
  const total = safeRead<number>(KEYS.TOTAL_VIEWS, 0);
  safeWrite(KEYS.TOTAL_VIEWS, total + 1);
}

/** 获取总浏览量 */
export function getTotalViews(): number {
  return safeRead<number>(KEYS.TOTAL_VIEWS, 0);
}

/** 获取所有页面访问记录 */
export function getPageViews(): PageViewRecord[] {
  return safeRead<PageViewRecord[]>(KEYS.PAGE_VIEWS, []);
}

// ─── 区块浏览时长 API ─────────────────────────────────────────

/** 更新某个区块的累计可见秒数 */
export function updateSectionDuration(
  sectionId: string,
  additionalSeconds: number
): void {
  const durations = safeRead<SectionDuration[]>(KEYS.SECTION_DURATIONS, []);
  const existing = durations.find((d) => d.sectionId === sectionId);

  if (existing) {
    existing.totalSeconds += additionalSeconds;
    existing.lastUpdated = new Date().toISOString();
  } else {
    durations.push({
      sectionId,
      totalSeconds: additionalSeconds,
      lastUpdated: new Date().toISOString(),
    });
  }

  safeWrite(KEYS.SECTION_DURATIONS, durations);
}

/** 获取所有区块的浏览时长数据 */
export function getSectionDurations(): SectionDuration[] {
  return safeRead<SectionDuration[]>(KEYS.SECTION_DURATIONS, []);
}

// ─── 预约记录 API ─────────────────────────────────────────────

/** 新增一条预约记录 */
export function addBooking(name: string, phone: string): BookingRecord {
  const record: BookingRecord = {
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone,
    timestamp: new Date().toISOString(),
    status: "pending",
  };

  const bookings = safeRead<BookingRecord[]>(KEYS.BOOKINGS, []);
  bookings.push(record);
  safeWrite(KEYS.BOOKINGS, bookings);

  return record;
}

/** 获取所有预约记录 */
export function getBookings(): BookingRecord[] {
  return safeRead<BookingRecord[]>(KEYS.BOOKINGS, []);
}

/** 更新预约状态 */
export function updateBookingStatus(
  id: string,
  status: BookingRecord["status"]
): void {
  const bookings = safeRead<BookingRecord[]>(KEYS.BOOKINGS, []);
  const target = bookings.find((b) => b.id === id);
  if (target) {
    target.status = status;
    safeWrite(KEYS.BOOKINGS, bookings);
  }
}

/** 删除预约记录 */
export function deleteBooking(id: string): void {
  const bookings = safeRead<BookingRecord[]>(KEYS.BOOKINGS, []);
  const filtered = bookings.filter((b) => b.id !== id);
  safeWrite(KEYS.BOOKINGS, filtered);
}

// ─── 聚合统计 API ─────────────────────────────────────────────

/**
 * 生成全局分析数据摘要，供仪表盘一次性消费
 * NOTE: 这个函数会扫描全量数据，不要在渲染循环中频繁调用
 */
export function getAnalyticsSummary(): AnalyticsSummary {
  const views = getPageViews();
  const bookings = getBookings();
  const durations = getSectionDurations();
  const today = getToday();
  const weekAgo = getDaysAgo(7);
  const monthAgo = getDaysAgo(30);

  // 浏览量分时段统计
  const todayViews = views.filter(
    (v) => v.timestamp.slice(0, 10) === today
  ).length;
  const weekViews = views.filter(
    (v) => v.timestamp.slice(0, 10) >= weekAgo
  ).length;
  const monthViews = views.filter(
    (v) => v.timestamp.slice(0, 10) >= monthAgo
  ).length;

  // 最近 7 天每日浏览量
  const recentDailyViews: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = getDaysAgo(i);
    const count = views.filter(
      (v) => v.timestamp.slice(0, 10) === date
    ).length;
    recentDailyViews.push({ date, count });
  }

  // 设备分布
  const desktop = views.filter((v) => v.device === "desktop").length;
  const mobile = views.filter((v) => v.device === "mobile").length;

  // 预约统计
  const todayBookings = bookings.filter(
    (b) => b.timestamp.slice(0, 10) === today
  ).length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const contacted = bookings.filter((b) => b.status === "contacted").length;
  const completed = bookings.filter((b) => b.status === "completed").length;

  // 最近 30 天每日预约量
  const recentDailyBookings: { date: string; count: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = getDaysAgo(i);
    const count = bookings.filter(
      (b) => b.timestamp.slice(0, 10) === date
    ).length;
    recentDailyBookings.push({ date, count });
  }

  return {
    totalViews: getTotalViews(),
    todayViews,
    weekViews,
    monthViews,
    recentDailyViews,
    deviceBreakdown: { desktop, mobile },
    sectionDurations: durations,
    totalBookings: bookings.length,
    todayBookings,
    bookingsByStatus: { pending, contacted, completed },
    recentDailyBookings,
  };
}
