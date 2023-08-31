"use client";

import { useAtomValue, useAtom } from "jotai";
import {
  isNoiseSuppressionAtom,
  localStreamAtom,
  originalStreamAtom,
  sharedStreamAtom,
} from "@/context/stream";
import { useState } from "react";
import { SecondaryButton } from "@/components/buttons";
import Styles from "./button.module.scss";
import { NoiseAwareFilledIcon } from "@xpadev-net/material-icons/noise-aware-filled";
import { addTrackToStream, removeTrackFromStream } from "@/utils/stream";
import { NoiseSuppressionProcessor } from "@shiguredo/noise-suppression";

const NoiseSuppressionButton = () => {
  const processor = useState(
    new NoiseSuppressionProcessor(
      "https://cdn.jsdelivr.net/npm/@shiguredo/noise-suppression@latest/dist",
    ),
  )[0];
  const sharedStream = useAtomValue(sharedStreamAtom);
  const localStream = useAtomValue(localStreamAtom);
  const originalStream = useAtomValue(originalStreamAtom);
  const [isNoiseSuppression, setIsNoiseSuppression] = useAtom(
    isNoiseSuppressionAtom,
  );
  const [noiseSuppressionTrack, setNoiseSuppressionTrack] = useState<
    MediaStreamTrack | undefined
  >(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  if (!sharedStream || !originalStream) return;
  const stopNoiseSuppression = (noiseSuppressionTrack?: MediaStreamTrack) => {
    if (noiseSuppressionTrack) {
      removeTrackFromStream(sharedStream, noiseSuppressionTrack);
      noiseSuppressionTrack.stop();
      processor.stopProcessing();
      setNoiseSuppressionTrack(undefined);
    }
    if (!localStream) return;
    const [audioTrack] = localStream.getAudioTracks();
    addTrackToStream(sharedStream, audioTrack);
    setIsNoiseSuppression(false);
  };
  const startNoiseSuppression = async () => {
    const track = originalStream.getAudioTracks()[0];
    try {
      const processed_audio_track = await processor.startProcessing(track);
      processed_audio_track.onended = (e) => {
        stopNoiseSuppression(processed_audio_track);
      };
      const [sharedAudioTrack] = sharedStream.getAudioTracks();
      removeTrackFromStream(sharedStream, sharedAudioTrack);
      addTrackToStream(sharedStream, processed_audio_track);
      setNoiseSuppressionTrack(processed_audio_track);
      setIsNoiseSuppression(true);
    } catch (e: unknown) {
      if (!(e instanceof Error)) return;
      if (e.message === "Unsupported browser") {
        setErrorMessage("ノイズ抑制はfirefoxでは利用できません");
      }
    }
  };
  const shareHandler = () => {
    if (isNoiseSuppression) {
      stopNoiseSuppression(noiseSuppressionTrack);
    } else {
      void startNoiseSuppression();
    }
  };
  return (
    <SecondaryButton
      onClick={shareHandler}
      className={Styles.button}
      disabled={!!errorMessage}
      title={errorMessage}
    >
      <NoiseAwareFilledIcon className={Styles.icon} />
    </SecondaryButton>
  );
};

export { NoiseSuppressionButton };
