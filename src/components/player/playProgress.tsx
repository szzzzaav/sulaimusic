"use client";

import { useEffect, useRef, useState } from "react";
import { useSongContext } from "@/hooks/songContext";
import { twMerge } from "tailwind-merge";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const PlayProgress = () => {
  const { songLength, timeCalculation } = useSongContext();
  const timeRef = useRef<HTMLSpanElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    if (timeRef.current) {
      timeRef.current.textContent = formatTime(timeCalculation()!);
    }
  }, [songLength]);
  useEffect(() => {
    if (timeRef.current) {
      const func = () => {
        if (timeRef.current) {
          timeRef.current.textContent = formatTime(timeCalculation()!);
          requestAnimationFrame(func);
        }
      };
      func();
      const event = requestAnimationFrame(func);
      return () => cancelAnimationFrame(event);
    }
  }, [timeCalculation]);

  return (
    <div className="w-full h-3 flex items-center justify-center gap-2 text-zinc-400 text-sm relative">
      <span className="text-nowrap relative z-0" ref={timeRef}>
        -:--
      </span>

      <Slider max={songLength} min={0} currentTime={currentTime} setCurrentTime={setCurrentTime} />
      <span className="text-nowrap">{formatTime(songLength) || "-:--"}</span>
    </div>
  );
};

interface SliderProps {
  max?: number;
  min?: number;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
}

const Slider: React.FC<SliderProps> = ({ max = 100, min = 0, currentTime, setCurrentTime }) => {
  const [hover, setHover] = useState(false);
  const { timeCalculation, isPlaying } = useSongContext();
  const progressRef = useRef<HTMLDivElement>(null);
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };
  useEffect(() => {
    if (progressRef.current && isPlaying) {
      const func = () => {
        if (progressRef.current) {
          progressRef.current.style.width = `${getPercentage(timeCalculation()!)}%`;
        }
        requestAnimationFrame(func);
      };
      const event = requestAnimationFrame(func);
      return () => cancelAnimationFrame(event);
    }
  }, [isPlaying]);
  return (
    <div
      className="relative flex items-center w-full h-[10px] cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="absolute top-1/2 -translate-y-1/2 w-full h-[4px] rounded-full bg-neutral-600 overflow-hidden">
        <div
          ref={progressRef}
          className={twMerge(
            "absolute top-0 left-0 h-full rounded-full bg-neutral-300",
            hover && "opacity-0"
          )}
        ></div>
      </div>
      <Input hover={hover} max={max} min={min} setCurrentTime={setCurrentTime} />
    </div>
  );
};

const Input = ({
  hover,
  max,
  min,
  setCurrentTime,
}: {
  hover: boolean;
  max: number;
  min: number;
  setCurrentTime: (currentTime: number) => void;
}) => {
  const { timeCalculation, jumpAudio } = useSongContext();
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const time = timeCalculation();
    if (time !== undefined) {
      setValue(time);
    }
  }, []);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  useEffect(() => {
    if (hover) {
      const time = timeCalculation();
      if (time !== undefined) {
        setValue(time);
      }
    }
  }, [hover, timeCalculation]);

  return (
    <div
      className={twMerge(
        "absolute top-1/2 -translate-y-1/2 w-full h-[4px] rounded-full opacity-0",
        hover && "opacity-100"
      )}
    >
      <div
        className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
        style={{
          width: `${getPercentage(value)}%`,
        }}
      ></div>
      <CustomInput
        hover={hover}
        max={max}
        min={min}
        value={value}
        onMouseDown={() => {
          const time = timeCalculation();
          if (time !== undefined) {
            setCurrentTime(time);
          }
        }}
        onChange={(e) => {
          setValue(Number(e.target.value));
          setCurrentTime(Number(e.target.value));
        }}
        onMouseUp={() => {
          setCurrentTime(0);
          jumpAudio(value);
        }}
      />
    </div>
  );
};

const CustomInput = ({
  hover,
  max,
  min,
  value,
  onChange,
  onMouseUp,
  onMouseDown,
}: {
  hover: boolean;
  max: number;
  min: number;
  value?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMouseUp?: () => void;
  onMouseDown?: () => void;
}) => {
  return (
    <input
      className={`absolute top-1/2 -translate-y-1/2 w-full h-[4px] rounded-full m-0 outline-none bg-transparent z-10
        appearance-none
        [&::-webkit-slider-runnable-track]:bg-transparent
        [&::-webkit-slider-container]:bg-transparent
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-3
        [&::-webkit-slider-thumb]:h-3
        [&::-webkit-slider-thumb]:z-20
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:border
        [&::-webkit-slider-thumb]:border-gray-300
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:${hover ? "opacity-100" : "opacity-0"}
        [&::-moz-range-track]:bg-transparent
        [&::-moz-range-thumb]:appearance-none
        [&::-moz-range-thumb]:w-3
        [&::-moz-range-thumb]:h-3
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:bg-white
        [&::-moz-range-thumb]:border
        [&::-moz-range-thumb]:border-gray-300
        [&::-moz-range-thumb]:cursor-pointer
        [&::-moz-range-thumb]:${hover ? "opacity-100" : "opacity-0"}
        [&::-ms-track]:bg-transparent
        [&::-ms-thumb]:w-3
        [&::-ms-thumb]:h-3
        [&::-ms-thumb]:rounded-full
        [&::-ms-thumb]:bg-white
        [&::-ms-thumb]:border
        [&::-ms-thumb]:border-gray-300
        [&::-ms-thumb]:cursor-pointer
        [&::-ms-thumb]:${hover ? "opacity-100" : "opacity-0"}`}
      type="range"
      max={max}
      min={min}
      value={value || 0}
      onChange={onChange}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
    />
  );
};
