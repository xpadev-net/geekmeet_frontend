import { useAtomValue } from "jotai";
import { localStreamAtom } from "@/context/stream";
import { useEffect, useRef } from "react";

const SelfView = () => {
  const localStream = useAtomValue(localStreamAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current || !localStream) return;
    videoRef.current.srcObject = localStream;
  }, [localStream, videoRef]);
  return (
    <video ref={videoRef} playsInline={true} autoPlay={true} muted={true} />
  );
};

export { SelfView };
