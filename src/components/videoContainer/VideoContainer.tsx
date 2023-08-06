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
      const itemWidth = element.clientWidth / itemPerRow - 8;
      const itemHeight = element.clientHeight / row - 8;
      const scale = Math.min(itemWidth / 16, itemHeight / 9);
      setSize({ width: scale * 16, height: scale * 9 });
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
