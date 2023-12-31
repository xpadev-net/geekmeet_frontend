"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UUID } from "@/@types/brands";
import { PrimaryButton } from "@/components/buttons";
import { BlurButton } from "@/components/controls/BlurButton";
import { CameraButton } from "@/components/controls/CameraButton";
import { MuteButton } from "@/components/controls/MuteButton";
import { NoiseSuppressionButton } from "@/components/controls/NoiseButton";
import { TextInput } from "@/components/input";
import { Video } from "@/components/videoContainer/video";
import { userNameAtom } from "@/context/name";
import { usersAtom } from "@/context/room";
import { socketAtom } from "@/context/socket";
import {
  localStreamAtom,
  originalStreamAtom,
  sharedStreamAtom,
  stateAtom,
} from "@/context/stream";

import Styles from "./page.module.scss";

export default function JoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const setOriginalStream = useSetAtom(originalStreamAtom);
  const [stream, setStream] = useAtom(localStreamAtom);
  const [isRejected, setIsRejected] = useState(false);
  const [name, setName] = useAtom(userNameAtom);
  const setSharedStream = useSetAtom(sharedStreamAtom);
  const socket = useAtomValue(socketAtom);
  const setUsers = useSetAtom(usersAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomId = typeof location !== "undefined" && location?.hash.slice(1);
  const router = useRouter();
  const localState = useAtomValue(stateAtom);

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
      setOriginalStream(mediaStream);
      const stream = new MediaStream(mediaStream);
      setStream(stream);
      const sharedStream = new MediaStream(stream);
      videoRef.current.srcObject = sharedStream;
      setSharedStream(sharedStream);
    } catch (e) {
      setIsRejected(true);
    }
  };

  useEffect(() => {
    void requestMediaStream();
  }, [socket]);

  if (!socket) return <></>;

  const joinRoomHandler = () => {
    socket.once("joinRoom", (param) => {
      setIsLoading(false);
      if (param.code !== 200) {
        alert(param.message);
        return;
      }
      setUsers(
        param.users.map((user) => ({
          userId: user.id,
          name: user.name,
          type: "offer",
        })),
      );
      router.push(`/room/#${roomId}`);
    });
    setIsLoading(true);
    socket.emit("joinRoom", { roomId: roomId as UUID, name });
  };

  return (
    <div className={Styles.wrapper}>
      <div className={Styles.container}>
        <div className={Styles.view}>
          <div className={Styles.videoWrapper}>
            <Video
              ref={videoRef}
              muted={true}
              name={""}
              size={{ width: "100%", height: "100%" }}
              state={localState}
              userId={name}
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
            <BlurButton />
            <NoiseSuppressionButton />
          </div>
        </div>
        <div className={Styles.info}>
          <div>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={true}
              placeholder={"名前"}
            />
            <p className={Styles.tips}>名前は他の参加者に表示されます</p>
          </div>
          <PrimaryButton
            onClick={joinRoomHandler}
            disabled={!stream || isLoading}
          >
            通話に参加する
          </PrimaryButton>
          <div className={Styles.note}>
            参加者を招待するにはこのページまたは通話画面のURLを共有してください
          </div>
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
