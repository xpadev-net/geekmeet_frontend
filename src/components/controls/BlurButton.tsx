"use client";

import { useAtomValue } from "jotai";
import {
  isBlurAtom,
  localStreamAtom,
  originalStreamAtom,
  sharedStreamAtom,
} from "@/context/stream";
import { useState } from "react";
import { SecondaryButton } from "@/components/buttons";
import Styles from "./button.module.scss";
import { BlurOnFilledIcon } from "@xpadev-net/material-icons/blur-on-filled";
import { BlurOffFilledIcon } from "@xpadev-net/material-icons/blur-off-filled";
import { addTrackToStream, removeTrackFromStream } from "@/utils/stream";
import { useAtom } from "jotai/index";
import { VirtualBackgroundProcessor } from "@shiguredo/virtual-background";

const BlurButton = () => {
  const processor = useState(
    new VirtualBackgroundProcessor(
      "https://cdn.jsdelivr.net/npm/@shiguredo/virtual-background@latest/dist",
    ),
  )[0];
  const sharedStream = useAtomValue(sharedStreamAtom);
  const localStream = useAtomValue(localStreamAtom);
  const originalStream = useAtomValue(originalStreamAtom);
  const [isBlur, setIsBlur] = useAtom(isBlurAtom);
  const [blurTrack, setBlurTrack] = useState<MediaStreamTrack | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  if (!sharedStream || !originalStream) return;
  const stopBlur = (blurTrack?: MediaStreamTrack) => {
    if (blurTrack) {
      removeTrackFromStream(sharedStream, blurTrack);
      blurTrack.stop();
      processor.stopProcessing();
      setBlurTrack(undefined);
    }
    if (!localStream) return;
    const [videoTrack] = localStream.getVideoTracks();
    addTrackToStream(sharedStream, videoTrack);
    setIsBlur(false);
  };
  const startBlur = async () => {
    const track = originalStream.getVideoTracks()[0];
    try {
      const processed_video_track = await processor.startProcessing(track, {
        blurRadius: 15,
      });
      processed_video_track.onended = (e) => {
        stopBlur(processed_video_track);
      };
      const [sharedVideoTrack] = sharedStream.getVideoTracks();
      removeTrackFromStream(sharedStream, sharedVideoTrack);
      addTrackToStream(sharedStream, processed_video_track);
      setBlurTrack(processed_video_track);
      setIsBlur(true);
    } catch (e: unknown) {
      if (!(e instanceof Error)) return;
      if (e.message === "Unsupported browser") {
        setErrorMessage("背景ぼかしはfirefoxでは利用できません");
      }
    }
  };
  const shareHandler = () => {
    if (isBlur) {
      stopBlur(blurTrack);
    } else {
      void startBlur();
    }
  };
  return (
    <SecondaryButton
      onClick={shareHandler}
      className={Styles.button}
      disabled={!!errorMessage}
      title={
        errorMessage ??
        (isBlur ? "背景ぼかしをオフにする" : "背景ぼかしをオンにする")
      }
    >
      {isBlur ? (
        <BlurOnFilledIcon className={Styles.icon} />
      ) : (
        <BlurOffFilledIcon className={Styles.icon} />
      )}
    </SecondaryButton>
  );
};

export { BlurButton };
