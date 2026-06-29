/**
 * 统计数字卡片组件
 *
 * 用于仪表盘中展示单个大数字指标（如总浏览量、今日预约数等）
 * 支持可选的趋势箭头和标签颜色定制
 */

import React from "react";

interface StatCardProps {
  /** 卡片标签文案 */
  label: string;
  /** 主要数字 */
  value: number | string;
  /** 可选的单位或后缀 */
  suffix?: string;
  /** 可选的图标 emoji */
  icon?: string;
  /** 可选的趋势：up / down / neutral */
  trend?: "up" | "down" | "neutral";
  /** 可选的强调色 */
  accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  icon,
  trend,
  accentColor,
}) => {
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  const trendColor =
    trend === "up"
      ? "#30d158"
      : trend === "down"
        ? "#ff453a"
        : "var(--color-text-secondary)";

  return (
    <div
      style={{
        background: "var(--color-surface-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "14px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        transition: "all 0.3s var(--ease-apple)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 装饰色条 */}
      {accentColor && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            borderRadius: "14px 14px 0 0",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--color-text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {icon && <span style={{ fontSize: "14px" }}>{icon}</span>}
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: accentColor || "var(--color-text)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontSize: "14px",
              color: "var(--color-text-secondary)",
              fontWeight: 500,
            }}
          >
            {suffix}
          </span>
        )}
        {trend && trend !== "neutral" && (
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: trendColor,
              marginLeft: "4px",
            }}
          >
            {trendIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
