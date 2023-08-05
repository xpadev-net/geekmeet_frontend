"use client";

import { useAtomValue } from "jotai";
import { localStreamAtom } from "@/context/stream";
import { useEffect, useState } from "react";
import { VideocamFilledIcon } from "@xpadev-net/material-icons/videocam-filled";
import { VideocamOffFilledIcon } from "@xpadev-net/material-icons/videocam-off-filled";

const CameraButton = () => {
  const stream = useAtomValue(localStreamAtom);
  const [isDisabled, setIsDisabled] = useState<boolean>(
    stream?.getVideoTracks().reduce((pv, val) => pv && !val.enabled, true) ??
      false,
  );
  useEffect(() => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !isDisabled;
    });
  }, [stream, isDisabled]);
  if (!stream) return;
  const muteHandler = () => {
    setIsDisabled(!isDisabled);
  };
  return (
    <button onClick={muteHandler}>
      {isDisabled ? <VideocamOffFilledIcon /> : <VideocamFilledIcon />}
    </button>
  );
};

export { CameraButton };
