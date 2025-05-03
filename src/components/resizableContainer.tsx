import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import React from "react";

interface ResizableContainerProps {
  children?: React.ReactNode;
  initialWidth?: number;
  maxWidth?: number;
  minWidth?: number;
  limitMinBoundary?: number;
  limitMaxBoundary?: number;
  onResize?: (width: number) => void;
  handlePosition?: "left" | "right";
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

interface PanelSizeProps {
  panelSize: number;
  setPanelSize: (size: number) => void;
}

const ResizableHandle = ({
  setWidth,
  containerRef,
  width,
  position,
  limitMinBoundary,
  limitMaxBoundary,
  minWidth,
  maxWidth,
}: {
  setWidth: (width: number) => void;
  position: "left" | "right";
  containerRef?: React.RefObject<HTMLDivElement | null>;
  width: number;
  limitMinBoundary?: number;
  limitMaxBoundary?: number;
  minWidth: number;
  maxWidth: number;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const startPositionRef = useRef<null | number>(null);
  const initialWidthRef = useRef<number>(width);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isHover) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      startPositionRef.current = e.clientX;
      document.body.style.cursor = "col-resize";
      initialWidthRef.current = width;
    }
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.cursor = "grab";
        const delta = e.pageX - (startPositionRef.current || 0);
        const containerWidth = containerRef?.current?.clientWidth || 0;
        const percentWidth = (delta / containerWidth) * 100;
        let newWidth = initialWidthRef.current - percentWidth;
        if (position === "right") {
          newWidth = initialWidthRef.current + percentWidth;
        }
        if (limitMinBoundary && newWidth < limitMinBoundary) {
          newWidth = minWidth;
        }
        if (limitMaxBoundary && newWidth > limitMaxBoundary) {
          newWidth = maxWidth;
        }
        setWidth(newWidth);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        startPositionRef.current = null;
        document.body.style.cursor = "";
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, containerRef, setWidth, position]);

  return (
    <div
      className={twMerge(
        "w-[8px] h-full cursor-col-resize relative z-10 flex items-center justify-center shrink-0"
      )}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={handleMouseDown}
    >
      <div
        className={twMerge(
          "h-[90%] w-[2px] bg-gray-500 rounded-full opacity-0 transition-opacity shrink-0",
          (isHover || isDragging) && "opacity-100",
          isDragging && "bg-white"
        )}
      ></div>
    </div>
  );
};

export default function ResizableContainer({
  children,
  initialWidth = 20,
  maxWidth = 30,
  minWidth = 10,
  handlePosition = "left",
  containerRef,
  onResize,
  limitMinBoundary,
  limitMaxBoundary,
}: ResizableContainerProps) {
  const [width, setWidth] = useState(initialWidth);

  const setWidthControlled = (newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(clampedWidth);

    if (onResize) {
      onResize(clampedWidth);
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        panelSize: width,
        setPanelSize: setWidthControlled,
      } as PanelSizeProps);
    }
    return child;
  });

  return (
    <div
      className="flex items-center gap-0 h-full justify-center shrink-0"
      style={{
        width: `${width}%`,
        minWidth: `${minWidth}%`,
        maxWidth: `${maxWidth}%`,
      }}
    >
      {handlePosition === "left" && (
        <ResizableHandle
          setWidth={setWidthControlled}
          containerRef={containerRef}
          width={width}
          position={handlePosition}
          limitMinBoundary={limitMinBoundary}
          limitMaxBoundary={limitMaxBoundary}
          minWidth={minWidth}
          maxWidth={maxWidth}
        />
      )}
      {childrenWithProps}
      {handlePosition === "right" && (
        <ResizableHandle
          setWidth={setWidthControlled}
          containerRef={containerRef}
          width={width}
          position={handlePosition}
          limitMinBoundary={limitMinBoundary}
          limitMaxBoundary={limitMaxBoundary}
          minWidth={minWidth}
          maxWidth={maxWidth}
        />
      )}
    </div>
  );
}
