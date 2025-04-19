"use client";

import ContentArea from "@/components/contentArea";
import PlayCard from "@/components/playCard";
import PlayList from "@/components/playList";
import ResizableContainer from "@/components/resizableContainer";
import { useRef } from "react";
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-screen h-[80%] flex items-center justify-center relative p-2"
      ref={containerRef}
    >
      <ResizableContainer
        maxWidth={32}
        minWidth={5}
        initialWidth={25}
        handlePosition="right"
        containerRef={containerRef}
        limitMinBoundary={10}
      >
        <PlayList />
      </ResizableContainer>
      <ContentArea></ContentArea>
      <ResizableContainer
        maxWidth={30}
        minWidth={18}
        initialWidth={20}
        handlePosition="left"
        containerRef={containerRef}
      >
        <PlayCard />
      </ResizableContainer>
    </div>
  );
}
