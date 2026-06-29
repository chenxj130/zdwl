/**
 * 后台数据仪表盘主组件
 *
 * 三大可视化模块：浏览量统计、页面停留时长分析、预约台账管理
 * 支持管理员完整模式和只读访客模式两种访问权限
 */

import React, { useState, useEffect, useCallback } from "react";
import StatCard from "./StatCard";
import MiniChart from "./MiniChart";
import BookingTable from "./BookingTable";
import {
  getAnalyticsSummary,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  type AnalyticsSummary,
  type BookingRecord,
} from "../../utils/analyticsStorage";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  /** 是否为只读模式（非管理员访问） */
  readOnly?: boolean;
}

/** 区块 ID 到中文名称的映射 */
const SECTION_LABELS: Record<string, string> = {
  hero: "首屏巨幕",
  "company-profile": "公司简介",
  showcase: "产品系列",
  "bento-grid": "核心优势",
  footer: "底部信息",
};

const Dashboard: React.FC<DashboardProps> = ({ readOnly = false }) => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  const refreshData = useCallback(() => {
    setSummary(getAnalyticsSummary());
    setBookings(getBookings());
  }, []);

  useEffect(() => {
    refreshData();
    // 每 30 秒自动刷新数据
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleStatusChange = useCallback(
    (id: string, status: BookingRecord["status"]) => {
      updateBookingStatus(id, status);
      refreshData();
    },
    [refreshData]
  );

  const handleDeleteBooking = useCallback(
    (id: string) => {
      deleteBooking(id);
      refreshData();
    },
    [refreshData]
  );

  if (!summary) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner} />
        <span>加载分析数据中...</span>
      </div>
    );
  }

  // 设备分布饼图数据
  const totalDevices =
    summary.deviceBreakdown.desktop + summary.deviceBreakdown.mobile || 1;
  const desktopPercent = Math.round(
    (summary.deviceBreakdown.desktop / totalDevices) * 100
  );
  const mobilePercent = 100 - desktopPercent;

  // 区块时长数据（按时长排序）
  const sectionData = summary.sectionDurations
    .map((d) => ({
      label: SECTION_LABELS[d.sectionId] || d.sectionId,
      value: Math.round(d.totalSeconds * 10) / 10,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className={styles.dashboard}>
      {/* ── 模块一：浏览量统计 ──────────────────────── */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📊</span>
          网站浏览量
        </h4>

        <div className={styles.cardGrid}>
          <StatCard
            label="总浏览量"
            value={summary.totalViews}
            suffix="次"
            icon="👁"
            accentColor="#2997ff"
          />
          <StatCard
            label="今日访问"
            value={summary.todayViews}
            suffix="次"
            icon="📅"
            trend={summary.todayViews > 0 ? "up" : "neutral"}
            accentColor="#30d158"
          />
          <StatCard
            label="本周访问"
            value={summary.weekViews}
            suffix="次"
            icon="📈"
            accentColor="#ff9f0a"
          />
          <StatCard
            label="本月访问"
            value={summary.monthViews}
            suffix="次"
            icon="📆"
            accentColor="#bf5af2"
          />
        </div>

        {/* 7 天趋势柱状图 */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>最近 7 天浏览趋势</div>
          <MiniChart
            type="bar"
            data={summary.recentDailyViews.map((d) => ({
              label: d.date,
              value: d.count,
            }))}
            height={130}
            color="#2997ff"
          />
        </div>

        {/* 设备分布 */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>访客设备分布</div>
          <div className={styles.deviceRow}>
            <div className={styles.deviceBar}>
              <div
                className={styles.deviceSegment}
                style={{
                  width: `${desktopPercent}%`,
                  background:
                    "linear-gradient(90deg, #2997ff, #64d2ff)",
                  borderRadius:
                    mobilePercent === 0
                      ? "8px"
                      : "8px 0 0 8px",
                }}
              />
              <div
                className={styles.deviceSegment}
                style={{
                  width: `${mobilePercent}%`,
                  background:
                    "linear-gradient(90deg, #ff9f0a, #ffd60a)",
                  borderRadius:
                    desktopPercent === 0
                      ? "8px"
                      : "0 8px 8px 0",
                }}
              />
            </div>
            <div className={styles.deviceLabels}>
              <span>
                <span
                  className={styles.dot}
                  style={{ background: "#2997ff" }}
                />
                桌面端 {desktopPercent}%
              </span>
              <span>
                <span
                  className={styles.dot}
                  style={{ background: "#ff9f0a" }}
                />
                移动端 {mobilePercent}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 模块二：页面停留时长 ──────────────────────── */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>⏱</span>
          页面停留时长
        </h4>

        {sectionData.length > 0 ? (
          <>
            <div className={styles.chartCard}>
              <div className={styles.chartTitle}>各版块累计停留时长排名</div>
              <MiniChart
                type="horizontal-bar"
                data={sectionData}
                height={sectionData.length * 36 + 30}
                color="#30d158"
                showLabels={false}
              />
            </div>

            {/* 热门版块 Top 3 */}
            <div className={styles.topList}>
              {sectionData.slice(0, 3).map((d, i) => (
                <div key={d.label} className={styles.topItem}>
                  <span className={styles.topRank}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className={styles.topLabel}>{d.label}</span>
                  <span className={styles.topValue}>{d.value.toFixed(1)}s</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.emptyHint}>
            浏览页面各版块后，停留时长数据将自动采集并展示
          </div>
        )}
      </section>

      {/* ── 模块三：预约台账管理 ──────────────────────── */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📋</span>
          预约台账管理
        </h4>

        <div className={styles.cardGrid}>
          <StatCard
            label="预约总量"
            value={summary.totalBookings}
            suffix="条"
            icon="📝"
            accentColor="#2997ff"
          />
          <StatCard
            label="今日新增"
            value={summary.todayBookings}
            suffix="条"
            icon="🆕"
            trend={summary.todayBookings > 0 ? "up" : "neutral"}
            accentColor="#30d158"
          />
          <StatCard
            label="待处理"
            value={summary.bookingsByStatus.pending}
            suffix="条"
            icon="⏳"
            accentColor="#ff9f0a"
          />
          <StatCard
            label="已完成"
            value={summary.bookingsByStatus.completed}
            suffix="条"
            icon="✅"
            accentColor="#30d158"
          />
        </div>

        {/* 30 天预约趋势 */}
        {summary.totalBookings > 0 && (
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>最近 30 天预约趋势</div>
            <MiniChart
              type="line"
              data={summary.recentDailyBookings.map((d) => ({
                label: d.date,
                value: d.count,
              }))}
              height={100}
              color="#bf5af2"
            />
          </div>
        )}

        {/* 预约台账列表 */}
        <div className={styles.tableContainer}>
          <BookingTable
            bookings={bookings}
            onStatusChange={
              readOnly ? () => {} : handleStatusChange
            }
            onDelete={readOnly ? () => {} : handleDeleteBooking}
            readOnly={readOnly}
          />
        </div>
      </section>

      {/* 手动刷新按钮 */}
      <button className={styles.refreshBtn} onClick={refreshData}>
        🔄 刷新数据
      </button>
    </div>
  );
};

export default Dashboard;
