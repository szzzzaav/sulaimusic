"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

const Tool = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timer: NodeJS.Timeout | null = null;
  return (
    <div
      className="flex items-center justify-center cursor-pointer relative"
      onMouseEnter={() => {
        setIsOpen(true);
      }}
      onMouseLeave={() => {
        setIsOpen(false);
      }}
    >
      {children}
      {isOpen && (
        <div
          className={twMerge(
            "absolute -translate-y-[150%] left-1/2 -translate-x-1/2 bg-[#181717] text-sm rounded-md px-3 py-1 text-zinc-300 text-nowrap flex items-center justify-center transition-opacity duration-300 opacity-0 font-bold",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export { Tool };
