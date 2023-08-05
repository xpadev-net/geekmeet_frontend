"use client";

import { SelfView } from "@/components/self-view/self-view";
import { WebRTCConnection } from "@/components/connection";
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
      console.log(wrapperHeight, wrapperWidth);
    });

    observer.observe(element);
    return () => {
      observer?.disconnect();
    };
  }, [users]);

  if (!users) return <></>;

  const elements = [
    <div className={Styles.item} key={"self-view"} style={size}>
      <div className={Styles.container}>
        <SelfView className={Styles.video} />
      </div>
    </div>,
    ...users.map((user) => {
      return (
        <div className={Styles.item} key={user.userId} style={size}>
          <div className={Styles.container}>
            <WebRTCConnection
              target={user.userId}
              type={user.type}
              className={Styles.video}
            />
          </div>
        </div>
      );
    }),
  ];

  console.log(elements, itemPerRow, row);

  return (
    <div className={Styles.wrapper} ref={wrapperRef}>
      <div className={Styles.container}>
        {new Array(row).fill(1).map((_, index) => {
          console.log(index, index * itemPerRow, (index + 1) * itemPerRow);
          return (
            <div
              className={Styles.row}
              key={`video-container-row-${index}`}
              style={{ height: size.height }}
            >
              {elements
                .slice(index * itemPerRow, (index + 1) * itemPerRow)
                .map((element) => element)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export { VideoContainer };
