import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

import { Video } from "@/components/videoContainer/video";
import { userNameAtom } from "@/context/name";
import { sharedStreamAtom } from "@/context/stream";

type props = {
  size: { width: number; height: number };
};

const SelfView = ({ size }: props) => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const userName = useAtomValue(userNameAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!videoRef.current || !sharedStream) return;
    videoRef.current.srcObject = sharedStream;
  }, [sharedStream, videoRef]);
  return <Video ref={videoRef} muted={true} name={userName} size={size} />;
};

export { SelfView };
