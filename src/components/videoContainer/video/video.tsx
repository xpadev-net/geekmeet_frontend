import Styles from "./Video.module.scss";
import { forwardRef } from "react";

type props = {
  muted?: boolean;
  name: string;
  size: { width: number; height: number };
};

const Video = forwardRef<HTMLVideoElement, props>(function Video(
  { muted, name, size },
  ref,
) {
  return (
    <div className={Styles.item} style={size}>
      <div className={Styles.container}>
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
