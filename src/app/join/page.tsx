"use client";

import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { localStreamAtom, sharedStreamAtom } from "@/context/stream";
import { socketAtom } from "@/context/socket";
import { UUID } from "@/@types/brands";
import { useRouter } from "next/navigation";
import { usersAtom } from "@/context/room";
import { MuteButton } from "@/components/controls/MuteButton";
import { CameraButton } from "@/components/controls/CameraButton";
import Styles from "./page.module.scss";
import { PrimaryButton } from "@/components/buttons";

export default function JoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [stream, setStream] = useAtom(localStreamAtom);
  const [isRejected, setIsRejected] = useState(false);
  const setSharedStream = useSetAtom(sharedStreamAtom);
  const socket = useAtomValue(socketAtom);
  const setUsers = useSetAtom(usersAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomId = typeof location !== "undefined" && location?.hash.slice(1);
  const router = useRouter();

  const requestMediaStream = async () => {
    if (!navigator.mediaDevices.getUserMedia || !videoRef.current) return;

    if (stream) {
      try {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (error) {
        console.error(error);
      }
    }
    try {
      const constraints = {
        audio: true,
        video: { width: 640, height: 360 },
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints,
      );
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
      setSharedStream(new MediaStream(mediaStream));
    } catch (e) {
      setIsRejected(true);
    }
  };

  useEffect(() => {
    void requestMediaStream();
  }, [trigger, socket]);

  if (!socket) return <></>;

  const joinRoomHandler = () => {
    socket.once("joinRoom", (param) => {
      setIsLoading(false);
      if (param.code !== 200) {
        alert(param.message);
        return;
      }
      setUsers(param.users.map((user) => ({ userId: user, type: "offer" })));
      router.push(`/room/#${roomId}`);
    });
    setIsLoading(true);
    socket.emit("joinRoom", { roomId: roomId as UUID });
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <h1></h1>
        <div className={Styles.view}>
          <div className={Styles.videoWrapper}>
            <video
              className={Styles.video}
              ref={videoRef}
              playsInline={true}
              autoPlay={true}
              muted={true}
            />
            {!stream && (
              <div className={Styles.overlay}>
                カメラとマイクの使用を許可してください
              </div>
            )}
          </div>
          <div className={Styles.controls}>
            <MuteButton />
            <CameraButton />
          </div>
        </div>
        <div className={Styles.info}>
          <PrimaryButton onClick={joinRoomHandler} disabled={!stream}>
            通話に参加する
          </PrimaryButton>
          {isRejected && (
            <div className={Styles.error}>
              <div>
                通話に参加するにはマイクとカメラの使用を許可する必要があります
              </div>
              <div>
                許可するにはブロックを解除してページをリロードしてください
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
