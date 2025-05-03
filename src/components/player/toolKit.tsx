"use client";

import { BsPauseFill, BsRepeat } from "react-icons/bs";
import { Tool } from "../ui/tooltip";
import { BsShuffle } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AiFillStepForward, AiFillStepBackward } from "react-icons/ai";
import { HiOutlineQueueList } from "react-icons/hi2";
import { SiQuantconnect } from "react-icons/si";
import { Volume } from "./volume";
import { useSongContext } from "@/hooks/songContext";
const ToolKitButton = ({
  content,
  icon,
  isActive,
}: {
  content: string;
  icon: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <Tool content={content}>
      <div className="flex items-center flex-col justify-center cursor-pointer relative gap-2">
        {icon}
        <div
          className={`rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 w-1 h-1 cursor-pointer absolute -bottom-1 transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>
    </Tool>
  );
};
const RandomPlayButton = () => {
  const [isRandom, setIsRandom] = useState(false);
  return (
    <ToolKitButton
      content="随机播放"
      icon={
        <BsShuffle
          size={18}
          className={` cursor-pointer hover:text-white transition-all duration-300 ${
            isRandom ? "text-indigo-500" : "text-neutral-400"
          }`}
          onClick={() => {
            setIsRandom(!isRandom);
          }}
        />
      }
      isActive={isRandom}
    />
  );
};

const RepeatButton = () => {
  const [isRepeat, setIsRepeat] = useState(false);
  return (
    <ToolKitButton
      content="重复播放"
      icon={
        <BsRepeat
          size={18}
          className={` cursor-pointer hover:text-white transition-all duration-300 ${
            isRepeat ? "text-indigo-500" : "text-neutral-400"
          }`}
          onClick={() => {
            setIsRepeat(!isRepeat);
          }}
        />
      }
      isActive={isRepeat}
    />
  );
};

const PlayQueueButton = () => {
  const [isOpenQueue, setIsOpenQueue] = useState(false);
  return (
    <ToolKitButton
      content="播放队列"
      icon={
        <HiOutlineQueueList
          size={18}
          className={` cursor-pointer hover:text-white transition-all duration-300 ${
            isOpenQueue ? "text-indigo-500" : "text-neutral-400"
          }`}
          onClick={() => {
            setIsOpenQueue(!isOpenQueue);
          }}
        />
      }
      isActive={isOpenQueue}
    />
  );
};

const OpenRoomButton = () => {
  const [isOpenRoom, setIsOpenRoom] = useState(false);
  return (
    <ToolKitButton
      content="一起听"
      icon={
        <SiQuantconnect
          size={18}
          className={` cursor-pointer hover:text-white transition-all duration-300 ${
            isOpenRoom ? "text-indigo-500" : "text-neutral-400"
          }`}
          onClick={() => {
            setIsOpenRoom(!isOpenRoom);
          }}
        />
      }
      isActive={isOpenRoom}
    />
  );
};
const BackwardButton = () => {
  return (
    <Tool content="上一首">
      <AiFillStepBackward
        size={20}
        className="text-neutral-400 cursor-pointer hover:text-white transition"
      />
    </Tool>
  );
};

const ForwardButton = () => {
  return (
    <Tool content="下一首">
      <AiFillStepForward
        size={20}
        className="text-neutral-400 cursor-pointer hover:text-white transition"
      />
    </Tool>
  );
};

const PlayButton = () => {
  return (
    <Tool content="播放">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer relative">
        <FaPlay size={15} className="text-[#121212] cursor-pointer translate-x-[1px]" />
      </div>
    </Tool>
  );
};

const PauseButton = () => {
  return (
    <Tool content="暂停">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white p-1 cursor-pointer relative">
        <BsPauseFill size={25} className="text-[#121212] cursor-pointer" />
      </div>
    </Tool>
  );
};

const PlayControlButton = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { playAudio, pauseAudio, timeCalculation, songLength } = useSongContext();
  return (
    <div
      onClick={() => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
          pauseAudio?.();
          console.log(timeCalculation(), songLength);
        } else {
          playAudio?.();
          console.log(timeCalculation(), songLength);
        }
      }}
    >
      {isPlaying ? <PauseButton /> : <PlayButton />}
    </div>
  );
};

const PlayProgressBar = () => {
  const { timeCalculation, songLength } = useSongContext();

  return (
    <div className="w-full h-1 bg-neutral-600 rounded-full">
      <div className="w-1/2 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
    </div>
  );
};

const PlayToolBar = () => {
  return (
    <div className="flex items-center justify-center gap-2 justify-self-end">
      <PlayQueueButton />
      <OpenRoomButton />
      <Volume />
    </div>
  );
};

export {
  RandomPlayButton,
  BackwardButton,
  ForwardButton,
  PlayControlButton,
  RepeatButton,
  PlayProgressBar,
  PlayToolBar,
};
