"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// 面板配置类型定义
export interface PanelConfig {
  minSize: number;
  maxSize?: number;
  defaultSize: number;
  toMinSizeBoundary?: number;
}

// 布局配置
export const DEFAULT_PANEL_CONFIG = {
  first: {
    minSize: 5,
    maxSize: 32,
    defaultSize: 25,
    toMinSizeBoundary: 10,
  },
  middle: {
    minSize: 40,
    defaultSize: 60,
  },
  last: {
    minSize: 18,
    maxSize: 30,
    defaultSize: 20,
  },
};

// Context类型定义
interface LayoutSizeContextType {
  // 面板尺寸
  firstPanelSize: number;
  middlePanelSize: number;
  lastPanelSize: number;
  setFirstPanelSize: (size: number) => void;
  setMiddlePanelSize: (size: number) => void;
  setLastPanelSize: (size: number) => void;

  // 调整状态
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;

  // 布局配置
  panelConfig: typeof DEFAULT_PANEL_CONFIG;

  // 辅助函数
  handleFirstPanelResize: (delta: number) => void;
  handleLastPanelResize: (delta: number) => void;

  // 响应式状态
  isFirstPanelCompact: boolean;
  isLastPanelCompact: boolean;
}

// 创建Context
export const LayoutSizeContext = createContext<LayoutSizeContextType | undefined>(undefined);

// Context Provider组件
export function LayoutSizeProvider({ children }: { children: ReactNode }) {
  // 面板尺寸状态
  const [firstPanelSize, setFirstPanelSize] = useState(DEFAULT_PANEL_CONFIG.first.defaultSize);
  const [middlePanelSize, setMiddlePanelSize] = useState(DEFAULT_PANEL_CONFIG.middle.defaultSize);
  const [lastPanelSize, setLastPanelSize] = useState(DEFAULT_PANEL_CONFIG.last.defaultSize);
  const [isResizing, setIsResizing] = useState(false);

  // 响应式布局状态
  const [isFirstPanelCompact, setIsFirstPanelCompact] = useState(false);
  const [isLastPanelCompact, setIsLastPanelCompact] = useState(false);

  // 调整第一个面板时的处理函数
  const handleFirstPanelResize = (delta: number) => {
    setIsResizing(true);

    const newFirstPanelSize = Math.max(
      DEFAULT_PANEL_CONFIG.first.minSize,
      Math.min(DEFAULT_PANEL_CONFIG.first.maxSize || 100, firstPanelSize + delta)
    );

    if (newFirstPanelSize <= DEFAULT_PANEL_CONFIG.first.toMinSizeBoundary!) {
      setFirstPanelSize(DEFAULT_PANEL_CONFIG.first.minSize);
      setMiddlePanelSize(
        middlePanelSize + (newFirstPanelSize - DEFAULT_PANEL_CONFIG.first.minSize)
      );
    }

    const sizeDelta = newFirstPanelSize - firstPanelSize;

    if (sizeDelta !== 0) {
      setFirstPanelSize(newFirstPanelSize);
      setMiddlePanelSize(middlePanelSize - sizeDelta);
    }
  };

  // 调整最后一个面板时的处理函数
  const handleLastPanelResize = (delta: number) => {
    setIsResizing(true);

    const newLastPanelSize = Math.max(
      DEFAULT_PANEL_CONFIG.last.minSize,
      Math.min(DEFAULT_PANEL_CONFIG.last.maxSize || 100, lastPanelSize - delta)
    );
    const sizeDelta = newLastPanelSize - lastPanelSize;

    if (sizeDelta !== 0) {
      setLastPanelSize(newLastPanelSize);
      setMiddlePanelSize(middlePanelSize - sizeDelta);
    }
  };

  // 监听面板尺寸变化，更新响应式状态
  useEffect(() => {
    // 计算第一个面板的相对宽度
    const firstPanelRelativeWidth = firstPanelSize / 100;

    // 更新第一个面板的响应式状态
    if (firstPanelRelativeWidth <= 0.05 && !isFirstPanelCompact) {
      setIsFirstPanelCompact(true);
    } else if (firstPanelRelativeWidth > 0.05 && isFirstPanelCompact) {
      setIsFirstPanelCompact(false);
    }

    // 计算最后一个面板的相对宽度
    const lastPanelRelativeWidth = lastPanelSize / 100;

    // 更新最后一个面板的响应式状态
    if (lastPanelRelativeWidth <= 0.05 && !isLastPanelCompact) {
      setIsLastPanelCompact(true);
    } else if (lastPanelRelativeWidth > 0.05 && isLastPanelCompact) {
      setIsLastPanelCompact(false);
    }
  }, [firstPanelSize, lastPanelSize, isFirstPanelCompact, isLastPanelCompact]);

  // 调整大小后的超时处理
  useEffect(() => {
    if (!isResizing) return;

    const timer = setTimeout(() => {
      if (
        firstPanelSize <= DEFAULT_PANEL_CONFIG.first.toMinSizeBoundary! &&
        firstPanelSize > DEFAULT_PANEL_CONFIG.first.minSize
      ) {
        setFirstPanelSize(DEFAULT_PANEL_CONFIG.first.minSize);
        setMiddlePanelSize(middlePanelSize + (firstPanelSize - DEFAULT_PANEL_CONFIG.first.minSize));
      }
      setIsResizing(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [firstPanelSize, middlePanelSize, isResizing]);

  return (
    <LayoutSizeContext.Provider
      value={{
        firstPanelSize,
        middlePanelSize,
        lastPanelSize,
        setFirstPanelSize,
        setMiddlePanelSize,
        setLastPanelSize,
        isResizing,
        setIsResizing,
        panelConfig: DEFAULT_PANEL_CONFIG,
        handleFirstPanelResize,
        handleLastPanelResize,
        isFirstPanelCompact,
        isLastPanelCompact,
      }}
    >
      {children}
    </LayoutSizeContext.Provider>
  );
}

// 自定义Hook，方便使用Context
export function useLayoutSize() {
  const context = useContext(LayoutSizeContext);

  if (context === undefined) {
    throw new Error("useLayoutSize must be used within a LayoutSizeProvider");
  }

  return context;
}
