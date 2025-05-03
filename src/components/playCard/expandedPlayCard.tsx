import { useState, useEffect, useRef, CSSProperties } from "react";
import { LuMinimize2 } from "react-icons/lu";
import Image from "next/image";
import { ExpendedPlayHeader, ExpendedPlayCover } from "./expendedPlayCardContent";
// 动画状态类型
type AnimationState =
  | "entering" // 进入中
  | "entered" // 已展开
  | "shrinking" // 宽度收缩中
  | "exiting" // 淡出中
  | "exited"; // 已移除

interface ExpandedPlayCardProps {
  onClose: () => void;
  isVisible: boolean;
  originalCardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ExpandedPlayCard({
  onClose,
  isVisible,
  originalCardRef,
}: ExpandedPlayCardProps) {
  const [animationState, setAnimationState] = useState<AnimationState>(
    isVisible ? "entering" : "exited"
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const [originalRect, setOriginalRect] = useState<DOMRect | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // 获取原始卡片位置和窗口尺寸
  useEffect(() => {
    // 设置窗口宽度
    setWindowWidth(window.innerWidth);

    // 监听窗口大小变化
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // 获取原始卡片位置
    if (isVisible && originalCardRef?.current) {
      const rect = originalCardRef.current.getBoundingClientRect();
      setOriginalRect(rect);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible, originalCardRef]);

  // 处理动画状态转换
  useEffect(() => {
    if (isVisible) {
      // 展开动画
      setAnimationState("entering");
      const timer = setTimeout(() => {
        setAnimationState("entered");
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // 分两阶段收缩: 先宽度收缩，然后淡出
      setAnimationState("shrinking");

      // 第一阶段: 宽度收缩
      const shrinkTimer = setTimeout(() => {
        setAnimationState("exiting");

        const exitTimer = setTimeout(() => {
          setAnimationState("exited");
        }, 300);

        return () => clearTimeout(exitTimer);
      }, 400);

      return () => clearTimeout(shrinkTimer);
    }
  }, [isVisible]);

  if (animationState === "exited" || !originalRect || !windowWidth) {
    return null;
  }

  const calculateExpandedPosition = () => {
    const margin = windowWidth * 0.01;

    const expandedWidth = windowWidth - margin * 2;

    const expandedLeft = margin;

    return { width: expandedWidth, left: expandedLeft };
  };

  const expandedPosition = calculateExpandedPosition();

  const getAnimationStyles = (): CSSProperties => {
    const defaultStyle: CSSProperties = {
      position: "fixed",
      transition: "all 300ms cubic-bezier(0.165, 0.84, 0.44, 1)",
      height: `${originalRect.height}px`,
      zIndex: 50,
      overflow: "hidden",
    };

    if (animationState === "entering") {
      return {
        ...defaultStyle,
        top: `${originalRect.top}px`,
        left: `${originalRect.left}px`,
        width: `${originalRect.width}px`,
        borderRadius: "0.75rem",
      };
    } else if (animationState === "entered") {
      return {
        ...defaultStyle,
        top: `${originalRect.top}px`,
        left: `${expandedPosition.left}px`,
        width: `${expandedPosition.width}px`,
        borderRadius: "0.75rem",
      };
    } else if (animationState === "shrinking") {
      return {
        ...defaultStyle,
        transition: "all 400ms cubic-bezier(0.165, 0.84, 0.44, 1)",
        top: `${originalRect.top}px`,
        left: `${originalRect.left}px`,
        width: `${originalRect.width}px`,
        borderRadius: "0.75rem",
      };
    } else if (animationState === "exiting") {
      return {
        ...defaultStyle,
        top: `${originalRect.top}px`,
        left: `${originalRect.left}px`,
        width: `${originalRect.width}px`,
        borderRadius: "0.75rem",
        opacity: 0,
      };
    }

    return defaultStyle;
  };

  return (
    <div
      ref={cardRef}
      className="bg-[#181818] flex flex-col items-center justify-start"
      style={getAnimationStyles()}
    >
      <ExpendedPlayHeader onClose={onClose} />
      <ExpendedPlayCover animationState={animationState} />
    </div>
  );
}
