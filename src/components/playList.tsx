import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { LuPanelLeftOpen } from "react-icons/lu";
import { DEFAULT_PANEL_CONFIG, useLayoutSize } from "../hooks/layoutSizeContext";

export default function PlayList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { firstPanelSize, isFirstPanelCompact, setFirstPanelSize } = useLayoutSize();
  const containerWidth = firstPanelSize / 100;

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#121212] rounded-2xl p-4 transition-all duration-300 flex-col flex justify-start"
    >
      <div
        className={twMerge(
          "flex items-center justify-between mb-4",
          containerWidth < 0.1 && "flex-col gap-2"
        )}
      >
        <span className={twMerge("text-white font-bold", containerWidth < 0.1 && "hidden")}>
          音乐库
        </span>
        <div className="flex items-center gap-2">
          <Button
            className={`font-bold flex items-center gap-2 cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 border-none text-white hover:text-white transition-all duration-300 ${
              isFirstPanelCompact ? "p-2 text-sm flex-1" : "p-3 rounded-4xl"
            }`}
            variant={"outline"}
          >
            <PlusIcon className={isFirstPanelCompact ? "w-4 h-4" : "w-5 h-5"} />
            {containerWidth > 0.18 && <span className="font-bold">创建歌单</span>}
          </Button>
          <Button
            className={twMerge(
              "font-bold flex items-center justify-center cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 border-none text-white hover:text-white transition-all duration-300 ",
              containerWidth <= 0.2 && "hidden"
            )}
            variant={"outline"}
          >
            <RiExpandDiagonalLine className={isFirstPanelCompact ? "w-4 h-4" : "w-5 h-5"} />
          </Button>
        </div>
        <Button
          variant={"outline"}
          className={twMerge(
            "font-bold flex items-center gap-2 cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 border-none text-white hover:text-white transition-all duration-300 ",
            containerWidth >= 0.08 && "hidden"
          )}
          onClick={() => setFirstPanelSize(DEFAULT_PANEL_CONFIG.first.defaultSize)}
        >
          <LuPanelLeftOpen className="w-5 h-5" />
        </Button>
      </div>

      {containerWidth > 0.2 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#181818] rounded-lg w-full px-6 py-10 flex flex-col items-start gap-2 text-center max-w-[90%] shadow-sm">
            <h2 className="text-white font-semibold text-xl mb-2">创建你的第一个歌单</h2>
            <p className="text-zinc-400 text-sm mb-6">很简单，我们将助你一臂之力</p>
            <Button
              className="bg-white hover:bg-gray-100 text-black font-medium rounded-full px-6 py-1.5 text-sm border-none shadow-none transition-colors"
              variant="default"
            >
              创建歌单
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
