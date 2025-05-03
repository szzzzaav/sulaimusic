"use client";

import { HiArrowCircleRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { useRef, useState, useEffect } from "react";

const MAX_PROGRESS = 100;
const SCROLL_SENSITIVITY = 8;
const DECAY_RATE = 1;
const DECAY_INTERVAL = 30;

const ScrollBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-1 rounded-sm bg-zinc-600 overflow-hidden relative">{children}</div>
  );
};

const ScrollContent = ({ width }: { width: number }) => {
  return (
    <div
      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 absolute top-0 left-0 transition-all duration-300"
      style={{ width: `${width}%` }}
    ></div>
  );
};

const ScrollContainer = ({
  children,
  className,
  ref,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHover(false);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <div
      className={twMerge(
        "w-full h-[75px] absolute bottom-0 pl-2 pr-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer",
        className
      )}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="w-full h-auto flex items-center justify-center gap-2 absolute top-0 left-0 transition-all duration-300 pl-10 pr-10 rounded-sm ">
        <span className="text-sm text-zinc-300 font-bold">NEXT</span>
        {children}
        <HiArrowCircleRight size={35} color="white" />
      </div>
      <div className="w-full p-3 flex items-center justify-center">
        <span
          className={twMerge(
            "text-xs text-zinc-300 font-bold opacity-0 transition-all duration-300",
            isHover && "opacity-100"
          )}
        >
          SCROLL
        </span>
      </div>
    </div>
  );
};

export default function ScrollToNext() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [width, setWidth] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let progress = 0;

    let decayTimerId: NodeJS.Timeout | null = null;

    const startProgressDecay = () => {
      if (decayTimerId) return;

      decayTimerId = setInterval(() => {
        if (progress <= 0) {
          if (decayTimerId) {
            clearInterval(decayTimerId);
            decayTimerId = null;
          }
          return;
        }

        progress = Math.max(0, progress - DECAY_RATE);
        setWidth(progress);
      }, DECAY_INTERVAL);
    };

    const stopProgressDecay = () => {
      if (decayTimerId) {
        clearInterval(decayTimerId);
        decayTimerId = null;
      }
    };

    let wheelTimeout: NodeJS.Timeout | null = null;

    const handleWheel = (event: WheelEvent) => {
      if (isTransitioning) return;

      stopProgressDecay();

      const delta = Math.sign(event.deltaY) * SCROLL_SENSITIVITY;
      progress = Math.min(MAX_PROGRESS, Math.max(0, progress + delta));

      setWidth(progress);

      if (progress >= MAX_PROGRESS && !isTransitioning) {
        setIsTransitioning(true);
      }

      event.preventDefault();

      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }

      wheelTimeout = setTimeout(() => {
        startProgressDecay();
      }, 300);
    };

    if (isHovered) {
      window.addEventListener("wheel", handleWheel, { passive: false });
    } else {
      window.removeEventListener("wheel", handleWheel);
      startProgressDecay();
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (decayTimerId) clearInterval(decayTimerId);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [isTransitioning, isHovered]);

  useEffect(() => {
    if (!isTransitioning) {
      setWidth(0);
    } else {
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);

      return () => clearTimeout(resetTimer);
    }
  }, [isTransitioning]);

  return (
    <ScrollContainer
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ScrollBar>
        <ScrollContent width={width} />
      </ScrollBar>
    </ScrollContainer>
  );
}
