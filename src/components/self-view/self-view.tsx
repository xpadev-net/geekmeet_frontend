import { useAtomValue } from "jotai";
import {sharedStreamAtom} from "@/context/stream";
import { useEffect, useRef } from "react";

const SelfView = () => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current || !sharedStream) return;
    videoRef.current.srcObject = sharedStream;
  }, [sharedStream, videoRef]);
  return (
    <video ref={videoRef} playsInline={true} autoPlay={true} muted={true} />
  );
};

export { SelfView };
