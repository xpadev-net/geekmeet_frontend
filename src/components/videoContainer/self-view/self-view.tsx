import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

import { Video } from "@/components/videoContainer/video";
import { userNameAtom } from "@/context/name";
import { sharedStreamAtom, stateAtom } from "@/context/stream";

type props = {
  size: { width: number; height: number };
};

const SelfView = ({ size }: props) => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const userName = useAtomValue(userNameAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const localState = useAtomValue(stateAtom);
  const [isSpeaking, setIsSpeaking] = useState(false);
  useEffect(() => {
    if (!videoRef.current || !sharedStream) return;
    const context = new AudioContext();
    const analyser = context.createAnalyser();
    const frequencies = new Uint8Array(analyser.frequencyBinCount);
    context.createMediaStreamSource(sharedStream).connect(analyser);
    const getByteFrequencyDataAverage = () => {
      analyser.getByteFrequencyData(frequencies);
      return (
        frequencies.reduce((pv, current) => {
          return pv + current;
        }) / analyser.frequencyBinCount
      );
    };
    videoRef.current.srcObject = sharedStream;

    const speakingInterval = window.setInterval(() => {
      setIsSpeaking(getByteFrequencyDataAverage() > 128);
    }, 100);

    return () => {
      clearInterval(speakingInterval);
    };
  }, [sharedStream, videoRef]);
  return (
    <Video
      ref={videoRef}
      muted={true}
      name={userName}
      size={size}
      state={localState}
      userId={userName}
      isSpeaking={isSpeaking}
    />
  );
};

export { SelfView };
