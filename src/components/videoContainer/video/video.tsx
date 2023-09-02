"use client";

import { MicOffFilledIcon } from "@xpadev-net/material-icons/mic-off-filled";
import { forwardRef, useState } from "react";

import { UserImg } from "@/components/user-img";

import Styles from "./Video.module.scss";

type props = {
  muted?: boolean;
  name: string;
  userId: string;
  size: { width: number | string; height: number | string };
  state: { camera: boolean; microphone: boolean };
  isSpeaking?: boolean;
};

const Video = forwardRef<HTMLVideoElement, props>(function Video(
  { muted, name, size, state, userId, isSpeaking },
  ref,
) {
  const [isFocus, setIsFocus] = useState(false);

  const toggleFocus = () => {
    setIsFocus(!isFocus);
  };

  return (
    <div
      className={`${Styles.item} ${isFocus && Styles.focus} ${
        isSpeaking && Styles.isSpeaking
      }`}
      style={size}
      onClick={toggleFocus}
    >
      <div className={Styles.container}>
        <span className={Styles.name}>{name}</span>
        <video
          playsInline={true}
          autoPlay={true}
          muted={muted}
          className={Styles.video}
          ref={ref}
        />
        {!state.microphone && <MicOffFilledIcon className={Styles.mutedIcon} />}
        {!state.camera && (
          <div className={Styles.camera}>
            <UserImg userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
});

export { Video };
