"use client";

import { PlayProgress } from "./playProgress";
import {
  ForwardButton,
  PlayControlButton,
  BackwardButton,
  RandomPlayButton,
  RepeatButton,
} from "./toolKit";

export const MainContent = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-2">
      <div className=" h-full flex justify-center items-center w-full max-w-[722px] gap-x-6">
        <RandomPlayButton />
        <BackwardButton />
        <PlayControlButton />
        <ForwardButton />
        <RepeatButton />
      </div>
      <PlayProgress />
    </div>
  );
};
