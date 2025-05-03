"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
// 跳转 totalPauseTime = clacTime - jump
export const useAudio = ({
  bufferData,
  isLoaded,
}: {
  bufferData: ArrayBuffer;
  isLoaded: boolean;
}) => {
  const songLengthRef = useRef<number>(0);
  const startTimeStampRef = useRef<number>(0);
  const startPauseTimeStampRef = useRef<number>(0);
  const endPauseTimeStampRef = useRef<number>(0);
  const totalPauseTimeRef = useRef<number>(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const audioGainRef = useRef<GainNode | null>(null);

  const [started, setStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const initAudio = async (bufferData: ArrayBuffer) => {
    audioContextRef.current = new AudioContext();
    const audioContext = audioContextRef.current;
    audioContext.suspend();
    audioSourceRef.current = audioContext.createBufferSource();
    audioAnalyserRef.current = audioContext.createAnalyser();
    audioGainRef.current = audioContext.createGain();

    const audioAnalyser = audioAnalyserRef.current;
    const audioGain = audioGainRef.current;
    const audioSource = audioSourceRef.current;
    audioSource.connect(audioAnalyser);
    audioSource.connect(audioGain);
    audioGain.connect(audioContext.destination);
    audioGain.gain.value = 0.5;

    try {
      audioBufferRef.current = await audioContext.decodeAudioData(bufferData);
      songLengthRef.current = audioBufferRef.current.duration;
      audioSource.buffer = audioBufferRef.current;
    } catch (error) {
      console.error(error);
    } finally {
      console.log("ok");
    }
  };
  useEffect(() => {
    if (!bufferData) return;
    initAudio(bufferData);
  }, [bufferData, isLoaded]);
  const timeCalculation = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    const currentTime = audioContextRef.current.currentTime;
    if (isPlaying) {
      return currentTime - startTimeStampRef.current - totalPauseTimeRef.current;
    } else {
      return startPauseTimeStampRef.current - startTimeStampRef.current - totalPauseTimeRef.current;
    }
  };
  const playAudio = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    if (!started) {
      audioContextRef.current.resume();
      startTimeStampRef.current = audioContextRef.current.currentTime;
      audioSourceRef.current.start(0);
      setStarted(true);
    } else {
      endPauseTimeStampRef.current = audioContextRef.current.currentTime;
      totalPauseTimeRef.current += endPauseTimeStampRef.current - startPauseTimeStampRef.current;
      audioContextRef.current.resume();
    }
    setIsPlaying(true);
  };
  const pauseAudio = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    startPauseTimeStampRef.current = audioContextRef.current.currentTime;
    audioContextRef.current.suspend();
    setIsPlaying(false);
  };
  return {
    audioContext: audioContextRef.current,
    audioSource: audioSourceRef.current,
    audioBuffer: audioBufferRef.current,
    audioAnalyser: audioAnalyserRef.current,
    audioGain: audioGainRef.current,
    playAudio,
    pauseAudio,
    timeCalculation,
    songLength: songLengthRef.current,
  };
};
