import { useAtomValue } from "jotai";
import { sharedStreamAtom } from "@/context/stream";
import { useEffect, useRef } from "react";
import { Video } from "@/components/videoContainer/video";

type props = {
  size: { width: number; height: number };
};

const SelfView = ({ size }: props) => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current || !sharedStream) return;
    videoRef.current.srcObject = sharedStream;
  }, [sharedStream, videoRef]);
  return <Video ref={videoRef} muted={true} size={size} />;
};

export { SelfView };
