"use client";

import { SelfView } from "@/components/videoContainer/self-view";
import { WebRTCConnection } from "@/components/videoContainer/connection";
import { usersAtom } from "@/context/room";
import { useAtomValue } from "jotai";

import Styles from "./VideoContainer.module.scss";
import { useEffect, useRef, useState } from "react";

const VideoContainer = () => {
  const users = useAtomValue(usersAtom);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const itemPerRow = Math.ceil(Math.sqrt((users?.length ?? 0) + 1));
  const row = Math.ceil(((users?.length ?? 0) + 1) / itemPerRow);
  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || !users) return;
    const observer = new ResizeObserver(() => {
      const scale = Math.min(
        element.clientWidth / 16,
        element.clientHeight / 9,
      );
      const wrapperWidth = scale * 16;
      const wrapperHeight = scale * 9;
      const itemWidth = wrapperWidth / itemPerRow - 8;
      const itemHeight = wrapperHeight / row - 8;
      setSize({ width: itemWidth, height: itemHeight });
    });

    observer.observe(element);
    return () => {
      observer?.disconnect();
    };
  }, [users]);

  if (!users) return <></>;

  const elements = [
    <SelfView key={"self-view"} size={size} />,
    ...users.map((user) => {
      return (
        <WebRTCConnection
          key={user.userId}
          target={user.userId}
          name={user.name}
          type={user.type}
          size={size}
        />
      );
    }),
  ];

  return (
    <div className={Styles.wrapper} ref={wrapperRef}>
      <div className={Styles.container}>
        {new Array(row).fill(1).map((_, index) => {
          return (
            <div
              className={Styles.row}
              key={`video-container-row-${index}`}
              style={{ height: size.height }}
            >
              {elements
                .slice(index * itemPerRow, (index + 1) * itemPerRow)
                .map((element, index) => element)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export { VideoContainer };
