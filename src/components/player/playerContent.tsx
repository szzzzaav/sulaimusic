"use client";

import { MediaItem } from "./mediaItem";
import { MainContent } from "./mainContent";
import { PlayToolBar } from "./toolKit";

export const PlayerContent = () => {
  return (
    <div className="grid grid-cols-3 h-full">
      <Media />
      <MainContent />
      <PlayToolBar />
    </div>
  );
};

const Media = () => {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-x-4">
        <MediaItem />
      </div>
    </div>
  );
};
