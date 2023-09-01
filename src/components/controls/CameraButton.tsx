"use client";

import { VideocamFilledIcon } from "@xpadev-net/material-icons/videocam-filled";
import { VideocamOffFilledIcon } from "@xpadev-net/material-icons/videocam-off-filled";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { SecondaryButton } from "@/components/buttons";
import { localStreamAtom, stateAtom } from "@/context/stream";

import Styles from "./button.module.scss";

const CameraButton = () => {
  const stream = useAtomValue(localStreamAtom);
  const setState = useSetAtom(stateAtom);
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
    setState((p) => ({ ...p, camera: isDisabled }));
  };
  return (
    <SecondaryButton onClick={muteHandler} className={Styles.button}>
      {isDisabled ? (
        <VideocamOffFilledIcon className={Styles.icon} />
      ) : (
        <VideocamFilledIcon className={Styles.icon} />
      )}
    </SecondaryButton>
  );
};

export { CameraButton };
