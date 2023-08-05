"use client";

import { useAtomValue, useSetAtom } from "jotai";
import {
  isScreenSharingAtom,
  localStreamAtom,
  sharedStreamAtom,
} from "@/context/stream";
import { useState } from "react";
import { SecondaryButton } from "@/components/buttons";
import Styles from "./button.module.scss";
import { PresentToAllFilledIcon } from "@xpadev-net/material-icons/present-to-all-filled";

const ScreenShareButton = () => {
  const sharedStream = useAtomValue(sharedStreamAtom);
  const localStream = useAtomValue(localStreamAtom);
  const setIsScreenSharing = useSetAtom(isScreenSharingAtom);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [screenTrack, setScreenTrack] = useState<MediaStreamTrack | undefined>(
    undefined,
  );
  if (!sharedStream) return;
  const shareHandler = () => {
    setIsSharing(!isSharing);
    if (isSharing) {
      if (screenTrack) {
        sharedStream.removeTrack(screenTrack);
        sharedStream.dispatchEvent(
          new CustomEvent("_removetrack", { detail: { track: screenTrack } }),
        );
        screenTrack.stop();
      }
      if (!localStream) return;
      const [videoTrack] = localStream.getVideoTracks();
      sharedStream.addTrack(videoTrack);
      sharedStream.dispatchEvent(
        new CustomEvent("_addtrack", { detail: { track: videoTrack } }),
      );
      setIsScreenSharing(false);
      return;
    }
    (async () => {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const [videoTrack] = stream.getVideoTracks();
      const [sharedVideoTrack] = sharedStream.getVideoTracks();
      sharedStream.removeTrack(sharedVideoTrack);
      sharedStream.dispatchEvent(
        new CustomEvent("_removetrack", {
          detail: { track: sharedVideoTrack },
        }),
      );
      sharedStream.addTrack(videoTrack);
      sharedStream.dispatchEvent(
        new CustomEvent("_addtrack", { detail: { track: videoTrack } }),
      );
      setScreenTrack(videoTrack);
      setIsScreenSharing(true);
    })();
  };
  return (
    <SecondaryButton onClick={shareHandler} className={Styles.button}>
      <PresentToAllFilledIcon className={Styles.icon} />
    </SecondaryButton>
  );
};

export { ScreenShareButton };
