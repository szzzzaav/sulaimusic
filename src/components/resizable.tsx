"use client";

import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ResizablePanelGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ResizablePanelGroup = ({ children, className }: ResizablePanelGroupProps) => {
  return <div className={twMerge("w-full h-full flex", className)}>{children}</div>;
};

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  onResize?: (size: number) => void;
  size?: number;
}

export const ResizablePanel = ({
  children,
  defaultSize,
  minSize = 10,
  maxSize = 90,
  className,
  onResize,
  size: controlledSize,
}: ResizablePanelProps) => {
  const [internalSize, setInternalSize] = useState(defaultSize);
  const size = controlledSize !== undefined ? controlledSize : internalSize;

  useEffect(() => {
    if (onResize && !controlledSize) {
      onResize(internalSize);
    }
  }, [internalSize, onResize, controlledSize]);

  return (
    <div
      className={twMerge("h-full relative overflow-hidden", className)}
      style={{
        width: `${size}%`,
        minWidth: `${minSize}%`,
        maxWidth: `${maxSize}%`,
      }}
    >
      {children}
    </div>
  );
};

interface ResizableHandleProps {
  onResize?: (delta: number) => void;
  className?: string;
}

export const ResizableHandle = ({ onResize, className }: ResizableHandleProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const startPosRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastDeltaRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startPosRef.current = e.clientX;
    document.body.style.cursor = "col-resize";
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!startPosRef.current || !containerRef.current) return;

      const containerWidth = containerRef.current.parentElement?.clientWidth || 1;
      const delta = e.clientX - startPosRef.current;
      const percentDelta = (delta / containerWidth) * 100;

      lastDeltaRef.current += percentDelta;

      if (Math.abs(lastDeltaRef.current) >= 0.1) {
        if (onResize) {
          onResize(lastDeltaRef.current);
          console.log("Resizing, delta:", lastDeltaRef.current);
        }
        lastDeltaRef.current = 0;
      }

      startPosRef.current = e.clientX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      startPosRef.current = null;
      lastDeltaRef.current = 0;
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isDragging, onResize]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "w-[8px] h-full cursor-col-resize relative z-10 flex items-center justify-center hover:bg-gray-600/10",
        isDragging ? "bg-gray-600/20" : "",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className={twMerge(
          "h-[90%] w-[1px] bg-gray-500 rounded-full opacity-0 transition-opacity",
          (isHover || isDragging) && "opacity-100"
        )}
      ></div>
    </div>
  );
};

export const Resizable = {
  PanelGroup: ResizablePanelGroup,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
};
