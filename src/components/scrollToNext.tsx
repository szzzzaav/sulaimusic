"use client";

import { HiArrowCircleRight } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import { useRef, useState, useEffect } from "react";

const ScrollBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-1 rounded-sm bg-zinc-600 overflow-hidden relative">{children}</div>
  );
};

const ScrollContent = ({ width }: { width: number }) => {
  return (
    <div
      className="h-full bg-green-600 absolute top-0 left-0 transition-all duration-300"
      style={{ width: `${width}%` }}
    ></div>
  );
};

const ScrollContainer = ({
  children,
  className,
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement | null>;
}) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className={twMerge(
        "w-full h-[75px] absolute bottom-0 pl-2 pr-2 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer",
        className
      )}
      ref={ref}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let progress = 0;
    const MAX_PROGRESS = 100;
    const SCROLL_SENSITIVITY = 8;
    const DECAY_RATE = 1;
    const DECAY_INTERVAL = 30;

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

    const handleMouseEnter = () => {
      window.addEventListener("wheel", handleWheel, { passive: false });
    };

    const handleMouseLeave = () => {
      window.removeEventListener("wheel", handleWheel);
      startProgressDecay();
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("wheel", handleWheel);

      if (decayTimerId) clearInterval(decayTimerId);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) {
      setWidth(0);
    }
  }, [isTransitioning]);

  return (
    <ScrollContainer ref={containerRef}>
      <ScrollBar>
        <ScrollContent width={width} />
      </ScrollBar>
    </ScrollContainer>
  );
}
