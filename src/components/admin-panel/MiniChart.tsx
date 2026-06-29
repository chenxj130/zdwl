/**
 * 迷你图表组件
 *
 * 纯 SVG 实现的轻量图表，支持柱状图、折线图和水平条形图
 * 无需任何第三方图表库依赖
 */

import React from "react";

interface MiniChartProps {
  /** 图表类型 */
  type: "bar" | "line" | "horizontal-bar";
  /** 数据点 */
  data: { label: string; value: number }[];
  /** SVG 容器高度 */
  height?: number;
  /** 主色调 */
  color?: string;
  /** 是否显示标签 */
  showLabels?: boolean;
}

const MiniChart: React.FC<MiniChartProps> = ({
  type,
  data,
  height = 120,
  color = "#2997ff",
  showLabels = true,
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-secondary)",
          fontSize: "12px",
        }}
      >
        暂无数据
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const width = 360;
  const padding = { top: 10, right: 10, bottom: showLabels ? 28 : 10, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (type === "bar") {
    const barGap = 4;
    const barWidth = Math.max(
      8,
      (chartWidth - barGap * (data.length - 1)) / data.length
    );

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ display: "block" }}
      >
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * chartHeight;
          const x = padding.left + i * (barWidth + barGap);
          const y = padding.top + chartHeight - barHeight;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill={color}
                opacity={0.85}
              >
                <title>
                  {d.label}: {d.value}
                </title>
              </rect>
              {showLabels && (
                <text
                  x={x + barWidth / 2}
                  y={height - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-text-secondary)"
                  fontFamily="var(--font-apple)"
                >
                  {d.label.slice(-5)}
                </text>
              )}
              {/* 柱顶数值 */}
              {d.value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-text-secondary)"
                  fontFamily="var(--font-apple)"
                  fontWeight="600"
                >
                  {d.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  if (type === "line") {
    const points = data.map((d, i) => {
      const x = padding.left + (i / Math.max(1, data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - (d.value / maxValue) * chartHeight;
      return { x, y, ...d };
    });

    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    // 渐变填充区域
    const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={color} />
            {showLabels && i % Math.ceil(data.length / 7) === 0 && (
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-text-secondary)"
                fontFamily="var(--font-apple)"
              >
                {p.label.slice(-5)}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  }

  if (type === "horizontal-bar") {
    const barHeight = Math.min(24, (chartHeight - 4 * (data.length - 1)) / data.length);
    const labelWidth = 80;

    return (
      <svg
        viewBox={`0 0 ${width} ${Math.max(height, data.length * (barHeight + 8) + padding.top + padding.bottom)}`}
        width="100%"
        height={Math.max(height, data.length * (barHeight + 8) + padding.top + padding.bottom)}
        style={{ display: "block" }}
      >
        {data.map((d, i) => {
          const barW =
            ((d.value / maxValue) * (chartWidth - labelWidth)) || 0;
          const y = padding.top + i * (barHeight + 8);

          return (
            <g key={i}>
              {/* 标签 */}
              <text
                x={padding.left}
                y={y + barHeight / 2 + 4}
                fontSize="11"
                fill="var(--color-text-secondary)"
                fontFamily="var(--font-apple)"
                fontWeight="500"
              >
                {d.label}
              </text>
              {/* 背景轨道 */}
              <rect
                x={padding.left + labelWidth}
                y={y}
                width={chartWidth - labelWidth}
                height={barHeight}
                rx={barHeight / 2}
                fill="var(--color-border)"
                opacity="0.3"
              />
              {/* 数值条 */}
              <rect
                x={padding.left + labelWidth}
                y={y}
                width={barW}
                height={barHeight}
                rx={barHeight / 2}
                fill={color}
                opacity="0.85"
              />
              {/* 数值标注 */}
              <text
                x={padding.left + labelWidth + barW + 8}
                y={y + barHeight / 2 + 4}
                fontSize="11"
                fill="var(--color-text)"
                fontFamily="var(--font-apple)"
                fontWeight="600"
              >
                {d.value > 0 ? `${d.value.toFixed(1)}s` : "0s"}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  return null;
};

export default MiniChart;
