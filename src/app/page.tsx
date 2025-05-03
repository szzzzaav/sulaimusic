"use client";

import ContentArea from "@/components/content/contentArea";
import PlayCard from "@/components/playCard/playCard";
import PlayList from "@/components/playList";
import ResizableContainer from "@/components/resizableContainer";

import { useRef, useState } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playListWidth, setPlayListWidth] = useState(25);
  const [playCardWidth, setPlayCardWidth] = useState(20);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const handlePlayCardResize = (size: number) => {
    setPlayCardWidth(size);
  };

  const handlePlayListResize = (size: number) => {
    setPlayListWidth(size);
  };

  const handleCardExpandToggle = (expanded: boolean) => {
    setIsCardExpanded(expanded);
  };

  return (
    <div
      className="w-screen h-full flex items-center justify-center relative overflow-hidden"
      ref={containerRef}
    >
      <div
        className={`flex w-auto h-full transition-transform duration-500 ease-in-out ${
          isCardExpanded ? "-translate-x-[110%]" : "translate-x-0"
        }`}
        style={{ width: `${100 - playCardWidth}%` }}
      >
        <ResizableContainer
          maxWidth={32}
          minWidth={5}
          initialWidth={playListWidth}
          handlePosition="right"
          containerRef={containerRef}
          limitMinBoundary={15}
          onResize={handlePlayListResize}
        >
          <PlayList panelSize={playListWidth} setPanelSize={setPlayListWidth} />
        </ResizableContainer>

        <div style={{ width: `${100 - playListWidth}%` }} className="h-full">
          <ContentArea />
        </div>
      </div>

      <ResizableContainer
        maxWidth={25}
        minWidth={18}
        initialWidth={playCardWidth}
        handlePosition="left"
        containerRef={containerRef}
        onResize={handlePlayCardResize}
      >
        <PlayCard onExpandToggle={handleCardExpandToggle} />
      </ResizableContainer>
    </div>
  );
}
