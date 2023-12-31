"use client";

import { MicFilledIcon } from "@xpadev-net/material-icons/mic-filled";
import { MicOffFilledIcon } from "@xpadev-net/material-icons/mic-off-filled";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { SecondaryButton } from "@/components/buttons";
import { localStreamAtom, stateAtom } from "@/context/stream";

import Styles from "./button.module.scss";

const MuteButton = () => {
  const stream = useAtomValue(localStreamAtom);
  const setState = useSetAtom(stateAtom);
  const [isMuted, setIsMuted] = useState<boolean>(
    stream?.getAudioTracks().reduce((pv, val) => pv && !val.enabled, true) ??
      false,
  );
  useEffect(() => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
  }, [stream, isMuted]);
  if (!stream) return;
  const muteHandler = () => {
    setIsMuted(!isMuted);
    setState((p) => ({ ...p, microphone: isMuted }));
  };
  return (
    <SecondaryButton onClick={muteHandler} className={Styles.button}>
      {isMuted ? (
        <MicOffFilledIcon className={Styles.icon} />
      ) : (
        <MicFilledIcon className={Styles.icon} />
      )}
    </SecondaryButton>
  );
};

export { MuteButton };
