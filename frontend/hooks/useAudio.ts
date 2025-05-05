"use client"

import { useEffect, useRef, useCallback } from "react";

const useAudio = (src: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // restart
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
    }
  }, []);

  return { play };
};

export default useAudio;