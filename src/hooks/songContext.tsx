"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAudio } from "./useAudio";

interface SongContextType {
  songRef: React.RefObject<ArrayBuffer | null>;
  isLoading: boolean;
  playAudio: () => void;
  pauseAudio: () => void;
  timeCalculation: () => number | undefined;
  songLength: number;
  // audioContextRef: React.RefObject<AudioContext | null>;
  // audioSourceRef: React.RefObject<AudioBufferSourceNode | null>;
  // audioBufferRef: React.RefObject<AudioBuffer | null>;
  // audioAnalyserRef: React.RefObject<AnalyserNode | null>;
  // audioGainRef: React.RefObject<GainNode | null>;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

const SongContextProvider = ({ children }: { children: React.ReactNode }) => {
  // const [song, setSong] = useState<ArrayBuffer | null>(null);
  // const [songUrl, setSongUrl] = useState("");
  // useEffect(() => {
  //   const fetchSong = async () => {
  //     setIsLoading(true);
  //     const res = await fetch(`/api/song?url=${songUrl}`);
  //     const data = await res.json();
  //     setSong(data);
  //     setIsLoading(false);
  //   };
  //   fetchSong();
  // }, [songUrl]);
  const songRef = useRef<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetchSong = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/test/testSong.mp3");
        const data = await res.arrayBuffer();
        songRef.current = data;
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };
    fetchSong();
  }, []);
  const { playAudio, pauseAudio, timeCalculation, songLength } = useAudio({
    bufferData: songRef.current!,
    isLoaded,
  });

  return (
    <SongContext.Provider
      value={{
        songRef,
        isLoading,
        playAudio,
        pauseAudio,
        timeCalculation,
        songLength,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongContext must be used within a SongContextProvider");
  }
  return context;
};

export { SongContextProvider, useSongContext };
