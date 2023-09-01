"use client";

import { PresentToAllFilledIcon } from "@xpadev-net/material-icons/present-to-all-filled";
import { useAtomValue } from "jotai";
import { useAtom } from "jotai/index";
import { useState } from "react";

import { SecondaryButton } from "@/components/buttons";
import {
  isScreenSharingAtom,
  localStreamAtom,
  sharedStreamAtom,
} from "@/context/stream";
import { addTrackToStream, removeTrackFromStream } from "@/utils/stream";

import Styles from "./button.module.scss";

const ScreenShareButton = () => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const localStream = useAtomValue(localStreamAtom);
  const [isScreenSharing, setIsScreenSharing] = useAtom(isScreenSharingAtom);
  const [captureTrack, setCaptureTrack] = useState<
    MediaStreamTrack | undefined
  >(undefined);
  if (!sharedStream) return;
  const stopScreenSharing = (captureTrack?: MediaStreamTrack) => {
    if (captureTrack) {
      removeTrackFromStream(sharedStream, captureTrack);
      captureTrack.stop();
      setCaptureTrack(undefined);
    }
    if (!localStream) return;
    const [videoTrack] = localStream.getVideoTracks();
    addTrackToStream(sharedStream, videoTrack);
    setIsScreenSharing(false);
  };
  const startScreenSharing = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const [captureTrack] = stream.getVideoTracks();
    captureTrack.onended = () => {
      stopScreenSharing(captureTrack);
    };
    const [sharedVideoTrack] = sharedStream.getVideoTracks();
    removeTrackFromStream(sharedStream, sharedVideoTrack);
    addTrackToStream(sharedStream, captureTrack);
    setCaptureTrack(captureTrack);
    setIsScreenSharing(true);
  };
  const shareHandler = () => {
    if (isScreenSharing) {
      stopScreenSharing(captureTrack);
    } else {
      void startScreenSharing();
    }
  };
  return (
    <SecondaryButton onClick={shareHandler} className={Styles.button}>
      <PresentToAllFilledIcon className={Styles.icon} />
    </SecondaryButton>
  );
};

export { ScreenShareButton };
