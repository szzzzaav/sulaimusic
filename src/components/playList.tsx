import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

const DEFAULT_SIZE = 25;
const MIN_SIZE = 5;

const COMPACT_THRESHOLD = 220;
const HIDE_TEXT_THRESHOLD = 250;
const HIDE_HEADER_THRESHOLD = 100;
const SHOW_CONTENT_THRESHOLD = 290;

interface PlayListProps {
  panelSize?: number;
  setPanelSize?: (size: number) => void;
}

function usePlayList(props: PlayListProps) {
  const { panelSize, setPanelSize } = props;
  const [internalPanelSize, setInternalPanelSize] = useState(DEFAULT_SIZE);
  const [isCompact, setIsCompact] = useState(false);
  const [containerWidthPx, setContainerWidthPx] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPanelSize = panelSize !== undefined ? panelSize : internalPanelSize;
  const updatePanelSize = setPanelSize || setInternalPanelSize;

  // 使用防抖函数优化尺寸计算
  const calculateWidth = useCallback(() => {
    if (!containerRef.current) return;

    // 直接使用容器的实际宽度，而不是通过计算得到
    const widthInPixels = containerRef.current.offsetWidth;

    if (widthInPixels !== containerWidthPx) {
      setContainerWidthPx(widthInPixels);
      setIsCompact(widthInPixels < COMPACT_THRESHOLD);
    }
  }, [containerWidthPx]);

  // 使用 ResizeObserver 监听容器尺寸变化
  useEffect(() => {
    if (!containerRef.current) return;

    calculateWidth();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(calculateWidth);
    });

    resizeObserver.observe(containerRef.current);

    // 同时保留窗口大小变化的监听
    window.addEventListener("resize", calculateWidth);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener("resize", calculateWidth);
      resizeObserver.disconnect();
    };
  }, [calculateWidth]);

  return {
    containerRef,
    containerWidthPx,
    isCompact,
    setIsCompact,
    updatePanelSize,
    DEFAULT_SIZE,
  };
}

function PlayListHeader({
  containerWidthPx,
  isCompact,
  onExpand,
  isHover,
  onClose,
}: {
  containerWidthPx: number;
  isCompact: boolean;
  onExpand: () => void;
  isHover: boolean;
  onClose: () => void;
}) {
  // 使用 useMemo 缓存样式计算结果
  const headerStyles = useMemo(
    () => ({
      isHidden: containerWidthPx < HIDE_HEADER_THRESHOLD,
      isTextHidden: containerWidthPx < HIDE_TEXT_THRESHOLD,
    }),
    [containerWidthPx]
  );

  return (
    <div
      className={twMerge(
        "flex items-center justify-between mb-4",
        headerStyles.isHidden && "flex-col gap-2"
      )}
    >
      <span
        className={twMerge(
          "text-white font-bold flex items-center relative",
          headerStyles.isHidden && "hidden"
        )}
      >
        <LuPanelLeftClose
          className={twMerge(
            "w-[20px] h-[20px] transition-all duration-400 translate-x-[-150%] absolute opacity-0 text-zinc-400 cursor-pointer",
            isHover && "translate-x-0 opacity-100"
          )}
          onClick={onClose}
        />
        <span
          className={twMerge(
            "ml-2 relative transition-all duration-350",
            isHover && "translate-x-[30px]"
          )}
        >
          音乐库
        </span>
      </span>
      <div className="flex items-center gap-2">
        <Button
          className={`font-bold flex items-center gap-2 cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 border-none text-white hover:text-white transition-all duration-300 ${
            isCompact ? "p-2 text-sm flex-1" : "p-3 rounded-4xl"
          }`}
          variant={"outline"}
        >
          <PlusIcon className={isCompact ? "w-4 h-4" : "w-5 h-5"} />
          {!headerStyles.isTextHidden && <span className="font-bold">创建歌单</span>}
        </Button>
      </div>
      <Button
        variant={"outline"}
        className={twMerge(
          "font-bold flex items-center gap-2 cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 border-none text-white hover:text-white transition-all duration-300 ",
          !headerStyles.isHidden && "hidden"
        )}
        onClick={onExpand}
      >
        <LuPanelLeftOpen className="w-5 h-5" />
      </Button>
    </div>
  );
}

function PlayListContent({
  containerWidthPx,
  isCompact,
}: {
  containerWidthPx: number;
  isCompact: boolean;
}) {
  // 使用 useMemo 缓存内容显示条件
  const shouldShowContent = useMemo(
    () => containerWidthPx > SHOW_CONTENT_THRESHOLD && !isCompact,
    [containerWidthPx, isCompact]
  );

  if (!shouldShowContent) {
    return null;
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-[#181818] rounded-lg w-full px-6 py-10 flex flex-col items-start gap-2 text-center max-w-[90%] shadow-sm">
        <h2 className="text-white font-semibold text-xl mb-2">创建你的第一个歌单</h2>
        <p className="text-zinc-400 text-sm mb-6">很简单，我们将助你一臂之力</p>
        <Button
          className="bg-white hover:bg-gray-100 text-black font-medium rounded-full px-6 py-1.5 text-sm border-none shadow-none transition-colors cursor-pointer"
          variant="default"
        >
          创建歌单
        </Button>
      </div>
    </div>
  );
}

export default function PlayList(props: PlayListProps) {
  const { containerRef, containerWidthPx, isCompact, setIsCompact, updatePanelSize, DEFAULT_SIZE } =
    usePlayList(props);
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#121212] rounded-2xl p-4 transition-all duration-300 flex-col flex justify-start music-playlist"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <PlayListHeader
        containerWidthPx={containerWidthPx}
        isCompact={isCompact}
        onExpand={() => updatePanelSize(DEFAULT_SIZE)}
        onClose={() => {
          updatePanelSize(MIN_SIZE);
          setIsCompact(true);
        }}
        isHover={isHover}
      />
      <PlayListContent containerWidthPx={containerWidthPx} isCompact={isCompact} />
    </div>
  );
}
