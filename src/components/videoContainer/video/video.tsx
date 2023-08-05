import Styles from "./Video.module.scss";
import { forwardRef } from "react";

type props = {
  muted?: boolean;
  size: { width: number; height: number };
};

const Video = forwardRef<HTMLVideoElement, props>(function Video(
  { muted, size },
  ref,
) {
  return (
    <div className={Styles.item} style={size}>
      <div className={Styles.container}>
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
