/**
 * 数据分析采集 Hooks
 *
 * 封装页面访问记录、区块可见时长追踪等采集逻辑
 * 使用 Intersection Observer API 精确追踪区块的屏幕可见时间
 */

import { useEffect, useRef, useCallback } from "react";
import {
  addPageView,
  updateSectionDuration,
} from "../utils/analyticsStorage";

/**
 * 页面访问追踪 Hook
 * 在组件挂载时自动记录一次页面访问
 * NOTE: 使用 sessionStorage 标记防止同一会话内重复计数
 */
export function usePageViewTracker(): void {
  useEffect(() => {
    const sessionKey = "analytics_session_tracked";
    if (sessionStorage.getItem(sessionKey)) return;

    addPageView();
    sessionStorage.setItem(sessionKey, "1");
  }, []);
}

/**
 * 区块可见时长追踪 Hook
 *
 * 使用 Intersection Observer 监测目标区块是否在视口内，
 * 并累计可见时长写入 LocalStorage
 *
 * @param sectionId 区块的唯一标识（如 "hero", "showcase" 等）
 * @returns ref 回调，需要绑定到目标 DOM 元素
 *
 * NOTE: 当页面标签不可见时（用户切走）自动暂停计时
 */
export function useSectionVisibilityTracker(sectionId: string) {
  const elementRef = useRef<HTMLElement | null>(null);
  const isVisibleRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  // 刷写累计时长到 LocalStorage
  const flushDuration = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      accumulatedRef.current += elapsed;
      startTimeRef.current = null;
    }

    if (accumulatedRef.current > 0.5) {
      // 至少 0.5 秒才写入
      updateSectionDuration(sectionId, accumulatedRef.current);
      accumulatedRef.current = 0;
    }
  }, [sectionId]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Intersection Observer 监听区块是否进入视口
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisibleRef.current) {
            // 进入视口 → 开始计时
            isVisibleRef.current = true;
            startTimeRef.current = performance.now();
          } else if (!entry.isIntersecting && isVisibleRef.current) {
            // 离开视口 → 暂停计时并累计
            isVisibleRef.current = false;
            flushDuration();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    // 页面可见性变化监听（标签切换时暂停/恢复）
    const handleVisibilityChange = () => {
      if (document.hidden && isVisibleRef.current) {
        flushDuration();
      } else if (!document.hidden && isVisibleRef.current) {
        startTimeRef.current = performance.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 页面卸载前刷写
    const handleBeforeUnload = () => {
      flushDuration();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      flushDuration();
    };
  }, [flushDuration]);

  // 返回 ref 回调供父组件绑定 DOM
  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return setRef;
}
