"use client";

import { forwardRef, useState } from "react";

import Styles from "./Video.module.scss";

type props = {
  muted?: boolean;
  name: string;
  size: { width: number; height: number };
};

const Video = forwardRef<HTMLVideoElement, props>(function Video(
  { muted, name, size },
  ref,
) {
  const [isFocus, setIsFocus] = useState(false);

  const toggleFocus = () => {
    setIsFocus(!isFocus);
  };

  return (
    <div className={Styles.item} style={size} onClick={toggleFocus}>
      <div className={`${Styles.container} ${isFocus && Styles.focus}`}>
        <span className={Styles.name}>{name}</span>
        <video
          playsInline={true}
          autoPlay={true}
          muted={muted}
          className={Styles.video}
          ref={ref}
        />
      </div>
    </div>
  );
});

export { Video };
