"use client";

import { useState, useRef, useEffect } from "react";

interface SliderProps {
  value?: number;
  setValue?: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({ value = 50, setValue, max = 100, min = 0 }) => {
  const [hover, setHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (position / rect.width) * 100));
    const newValue = Math.round((percentage * (max - min)) / 100 + min);

    if (setValue && newValue !== value) {
      setValue(newValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={sliderRef}
      className="relative flex items-center w-full h-[10px] cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => !isDragging && setHover(false)}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] rounded-full bg-neutral-600"></div>
      <div
        className={`absolute top-1/2 -translate-y-1/2 left-0 h-[4px] rounded-full ${
          hover || isDragging ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-neutral-300"
        }`}
        style={{
          width: `${getPercentage(value)}%`,
        }}
      ></div>
      <div
        className={`absolute w-3 h-3 rounded-full bg-white border border-gray-300 cursor-pointer transform -translate-y-1/2 -translate-x-1/2 top-1/2 ${
          hover || isDragging ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${getPercentage(value)}%`,
        }}
      ></div>
    </div>
  );
};
