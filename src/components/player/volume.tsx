"use client";

import { useState } from "react";
import { RxSpeakerOff, RxSpeakerQuiet, RxSpeakerModerate, RxSpeakerLoud } from "react-icons/rx";
import { Slider } from "./slider";

export const Volume = () => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const computedVolume = isMuted ? 0 : volume;
  let VolumeIcon = RxSpeakerOff;
  if (computedVolume === 0) {
    VolumeIcon = RxSpeakerOff;
  }
  if (computedVolume > 0 && computedVolume <= 30) {
    VolumeIcon = RxSpeakerQuiet;
  }
  if (computedVolume > 30 && computedVolume <= 70) {
    VolumeIcon = RxSpeakerModerate;
  }
  if (computedVolume > 70) {
    VolumeIcon = RxSpeakerLoud;
  }
  return (
    <div className="hidden md:flex w-full pr-2">
      <div className="flex items-center gap-x-2 pr-2 w-[160px]">
        <VolumeIcon
          size={25}
          className="text-neutral-300 cursor-pointer hover:text-white transition"
          onClick={() => setIsMuted(!isMuted)}
        />
        <Slider value={computedVolume} setValue={setVolume} max={100} min={0} step={1} />
      </div>
    </div>
  );
};
