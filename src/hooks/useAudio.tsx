"use client";

import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
// 跳转 totalPauseTime = clacTime - jump
export const useAudio = ({
  bufferData,
  isLoaded,
}: {
  bufferData: ArrayBuffer;
  isLoaded: boolean;
}) => {
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
  const [songLength, setSongLength] = useState<number>(0);

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
      setSongLength(audioBufferRef.current.duration);
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
      setStarted(true);
    } else {
      endPauseTimeStampRef.current = audioContextRef.current.currentTime;
      totalPauseTimeRef.current += endPauseTimeStampRef.current - startPauseTimeStampRef.current;
      audioContextRef.current.resume();
    }
    try {
      // 获取当前应该播放的时间位置
      const playPosition = timeCalculation();
      if (playPosition !== undefined) {
        audioSourceRef.current.start(0, playPosition);
      } else {
        audioSourceRef.current.start(0);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
    }
  };

  const pauseAudio = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    startPauseTimeStampRef.current = audioContextRef.current.currentTime;
    audioContextRef.current.suspend();
    setIsPlaying(false);
  };
  const disconnectAudio = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    audioSourceRef.current.disconnect(audioAnalyserRef.current!);
    audioSourceRef.current.disconnect(audioGainRef.current!);
    audioGainRef.current!.disconnect(audioContextRef.current!.destination);
  };

  const initSource = () => {
    if (!audioContextRef.current || !audioSourceRef.current) return;
    audioSourceRef.current = audioContextRef.current.createBufferSource();
    const audioSource = audioSourceRef.current;
    audioSource.buffer = audioBufferRef.current!;
    audioSource.connect(audioAnalyserRef.current!);
    audioSource.connect(audioGainRef.current!);
    audioGainRef.current!.connect(audioContextRef.current!.destination);
  };

  const jumpAudio = (time: number) => {
    if (!audioContextRef.current || !audioSourceRef.current) return;

    try {
      // 停止当前播放
      audioSourceRef.current.stop();
    } catch (error) {
      // 忽略未开始播放时调用stop的错误
      console.log("Audio source not started");
    }

    disconnectAudio();

    initSource();

    const currentTime = audioContextRef.current.currentTime;
    startTimeStampRef.current = currentTime - time;

    if (isPlaying) {
      audioSourceRef.current.start(0, time);
      audioContextRef.current.resume();
    } else {
      startPauseTimeStampRef.current = currentTime;
    }

    totalPauseTimeRef.current = 0;
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
    songLength,
    jumpAudio,
    isPlaying,
  };
};
