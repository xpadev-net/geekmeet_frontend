"use client";

import { useAtomValue } from "jotai";
import { sharedStreamAtom } from "@/context/stream";
import { MicOffFilledIcon } from "@xpadev-net/material-icons/mic-off-filled";
import { MicFilledIcon } from "@xpadev-net/material-icons/mic-filled";
import { useEffect, useState } from "react";

const MuteButton = () => {
  const stream = useAtomValue(sharedStreamAtom);
  const [isMuted, setIsMuted] = useState<boolean>(
    stream?.getAudioTracks().reduce((pv, val) => pv && !!val, false) ?? false,
  );
  useEffect(() => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
  }, [stream, isMuted]);
  if (!stream) return;
  const muteHandler = () => {
    setIsMuted(!isMuted);
  };
  return (
    <button onClick={muteHandler}>
      {isMuted ? <MicOffFilledIcon /> : <MicFilledIcon />}
    </button>
  );
};

export { MuteButton };
