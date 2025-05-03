import { LuMinimize2 } from "react-icons/lu";
import Image from "next/image";
import { useEffect, useState } from "react";

const ExpendedPlayHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <div className="w-full relative flex items-center justify-between p-2">
        <div></div>
        <button
          onClick={onClose}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <LuMinimize2 className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};

interface ExpendedPlayCoverProps {
  animationState?: "entering" | "entered" | "shrinking" | "exiting" | "exited";
}

const ExpendedPlayCover = ({ animationState = "entered" }: ExpendedPlayCoverProps) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (animationState === "entered") {
      const timer = setTimeout(() => {
        setExpanded(true);
      }, 300);
      return () => clearTimeout(timer);
    } else if (animationState === "shrinking" || animationState === "exiting") {
      setExpanded(false);
    }
  }, [animationState]);

  return (
    <div className="flex flex-col items-center justify-center w-auto h-[80%]">
      <div
        className={`rounded-2xl relative overflow-hidden transition-all duration-700 ease-in-out`}
        style={{
          width: expanded ? "100%" : "var(--original-image-width, 200px)",
          height: expanded ? "100%" : "var(--original-image-height, 200px)",
          maxWidth: expanded ? "none" : "var(--original-image-width, 200px)",
          maxHeight: expanded ? "none" : "var(--original-image-height, 200px)",
          aspectRatio: "1 / 1", // 保持正方形
          margin: "0 auto", // 居中
        }}
      >
        <Image src="/images/1.png" fill className="object-cover h-full w-full" alt="" />
      </div>
    </div>
  );
};

export { ExpendedPlayHeader, ExpendedPlayCover };
