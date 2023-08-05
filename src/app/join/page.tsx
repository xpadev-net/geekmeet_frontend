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
      console.log("test");
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
    <div>
      <div>
        <video ref={videoRef} playsInline={true} autoPlay={true} muted={true} />
        <div>
          <MuteButton />
          <CameraButton />
        </div>
      </div>
      <div>
        <button onClick={joinRoomHandler}>join</button>
        {isRejected && (
          <div>
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
  );
}
