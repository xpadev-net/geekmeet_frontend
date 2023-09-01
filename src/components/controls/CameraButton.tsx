"use client";

import { VideocamFilledIcon } from "@xpadev-net/material-icons/videocam-filled";
import { VideocamOffFilledIcon } from "@xpadev-net/material-icons/videocam-off-filled";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { SecondaryButton } from "@/components/buttons";
import { localStreamAtom, stateAtom } from "@/context/stream";

import Styles from "./button.module.scss";

const CameraButton = () => {
  const stream = useAtomValue(localStreamAtom);
  const [state, setState] = useAtom(stateAtom);
  useEffect(() => {
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = state.camera;
    });
  }, [stream, state]);
  if (!stream) return;
  const muteHandler = () => {
    setState((p) => ({ ...p, camera: !p.camera }));
  };
  return (
    <SecondaryButton onClick={muteHandler} className={Styles.button}>
      {state.camera ? (
        <VideocamFilledIcon className={Styles.icon} />
      ) : (
        <VideocamOffFilledIcon className={Styles.icon} />
      )}
    </SecondaryButton>
  );
};

export { CameraButton };
