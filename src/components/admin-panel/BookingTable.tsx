/**
 * 预约台账管理表格组件
 *
 * 展示所有"立即预约"提交的记录，支持状态筛选、状态修改和删除操作
 */

import React, { useState, useMemo } from "react";
import type { BookingRecord } from "../../utils/analyticsStorage";

interface BookingTableProps {
  /** 预约记录列表 */
  bookings: BookingRecord[];
  /** 状态变更回调 */
  onStatusChange: (id: string, status: BookingRecord["status"]) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
  /** 是否为只读模式 */
  readOnly?: boolean;
}

const STATUS_MAP: Record<
  BookingRecord["status"],
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "待处理",
    color: "#ff9f0a",
    bg: "rgba(255, 159, 10, 0.12)",
  },
  contacted: {
    label: "已联系",
    color: "#2997ff",
    bg: "rgba(41, 151, 255, 0.12)",
  },
  completed: {
    label: "已完成",
    color: "#30d158",
    bg: "rgba(48, 209, 88, 0.12)",
  },
};

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onStatusChange,
  onDelete,
  readOnly = false,
}) => {
  const [filter, setFilter] = useState<"all" | BookingRecord["status"]>("all");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredBookings = useMemo(() => {
    const filtered =
      filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
    // 按时间倒序（最新在前）
    return [...filtered].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [bookings, filter]);

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // 3秒后自动取消确认态
      setTimeout(() => setConfirmDeleteId(null), 3000);
    }
  };

  /** 格式化时间为可读的本地时间 */
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hour = String(d.getHours()).padStart(2, "0");
      const min = String(d.getMinutes()).padStart(2, "0");
      return `${month}-${day} ${hour}:${min}`;
    } catch {
      return iso;
    }
  };

  const filterOptions: { key: "all" | BookingRecord["status"]; label: string }[] = [
    { key: "all", label: `全部 (${bookings.length})` },
    {
      key: "pending",
      label: `待处理 (${bookings.filter((b) => b.status === "pending").length})`,
    },
    {
      key: "contacted",
      label: `已联系 (${bookings.filter((b) => b.status === "contacted").length})`,
    },
    {
      key: "completed",
      label: `已完成 (${bookings.filter((b) => b.status === "completed").length})`,
    },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {filterOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFilter(opt.key)}
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border:
                filter === opt.key
                  ? "1px solid var(--color-link)"
                  : "1px solid var(--color-border)",
              background:
                filter === opt.key
                  ? "rgba(41, 151, 255, 0.1)"
                  : "var(--color-surface-elevated)",
              color:
                filter === opt.key
                  ? "var(--color-link)"
                  : "var(--color-text-secondary)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 预约列表 */}
      {filteredBookings.length === 0 ? (
        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--color-text-secondary)",
            fontSize: "13px",
          }}
        >
          {filter === "all" ? "暂无预约记录" : "该状态下暂无记录"}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredBookings.map((booking, idx) => {
            const statusInfo = STATUS_MAP[booking.status];
            const isConfirming = confirmDeleteId === booking.id;

            return (
              <div
                key={booking.id}
                style={{
                  background: "var(--color-surface-elevated)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "all 0.2s",
                }}
              >
                {/* 第一行：序号 + 姓名 + 电话 + 时间 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-secondary)",
                      fontWeight: 600,
                      minWidth: "24px",
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-text)",
                    }}
                  >
                    {booking.name}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--color-link)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {booking.phone}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--color-text-secondary)",
                      marginLeft: "auto",
                    }}
                  >
                    {formatTime(booking.timestamp)}
                  </span>
                </div>

                {/* 第二行：状态选择 + 操作按钮 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* 状态标签 */}
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: statusInfo.color,
                      background: statusInfo.bg,
                      padding: "3px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {statusInfo.label}
                  </span>

                  {/* 状态切换下拉 */}
                  {!readOnly && (
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        onStatusChange(
                          booking.id,
                          e.target.value as BookingRecord["status"]
                        )
                      }
                      style={{
                        fontSize: "11px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg)",
                        color: "var(--color-text)",
                        cursor: "pointer",
                      }}
                    >
                      <option value="pending">待处理</option>
                      <option value="contacted">已联系</option>
                      <option value="completed">已完成</option>
                    </select>
                  )}

                  {/* 删除按钮（二次确认） */}
                  {!readOnly && (
                    <button
                      onClick={() => handleDelete(booking.id)}
                      style={{
                        marginLeft: "auto",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: isConfirming
                          ? "1px solid var(--color-accent-red)"
                          : "1px solid rgba(255, 69, 58, 0.3)",
                        background: isConfirming
                          ? "rgba(255, 69, 58, 0.15)"
                          : "transparent",
                        color: "var(--color-accent-red)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {isConfirming ? "确认删除?" : "删除"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingTable;
