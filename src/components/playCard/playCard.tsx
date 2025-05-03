import { useState, useRef } from "react";
import ScrollToNext from "../scrollToNext";
import { RiExpandDiagonalLine } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import ExpandedPlayCard from "./expandedPlayCard";
import PlayCardContent from "./playCardContent";

interface PlayCardProps {
  onExpandToggle?: (expanded: boolean) => void;
}

export default function PlayCard({ onExpandToggle }: PlayCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    if (onExpandToggle) onExpandToggle(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    if (onExpandToggle) onExpandToggle(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        className={twMerge(
          "w-full h-full bg-[#121212] rounded-xl relative transition-all duration-500",
          isExpanded && "opacity-0"
        )}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="w-full relative flex items-center justify-between p-2">
          <div></div>
          <button
            onClick={handleExpand}
            className="text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition-colors"
          >
            <RiExpandDiagonalLine className="w-5 h-5" />
          </button>
        </div>

        <PlayCardContent />
        <div className="h-full w-full flex items-center justify-center">
          <ScrollToNext />
        </div>
      </div>

      <ExpandedPlayCard isVisible={isExpanded} onClose={handleClose} originalCardRef={cardRef} />
    </>
  );
}
