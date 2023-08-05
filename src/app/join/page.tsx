"use client";

import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { streamAtom } from "@/context/stream";
import { socketAtom } from "@/context/socket";
import { UUID } from "@/@types/brands";
import { useRouter } from "next/navigation";
import { usersAtom } from "@/context/room";

export default function JoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const [stream, setStream] = useAtom(streamAtom);
  const socket = useAtomValue(socketAtom);
  const setUsers = useSetAtom(usersAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomId = location.hash.slice(1);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      if (videoRef.current === null) return;
      if (!navigator.mediaDevices.getUserMedia) return;

      if (stream) {
        try {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        } catch (error) {
          console.error(error);
        }
      }
      const constraints = {
        audio: true,
        video: true,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints,
      );
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    })();
  }, [videoRef, trigger]);

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
      <video ref={videoRef} />
      <button onClick={joinRoomHandler}>join</button>
      <button onClick={() => setTrigger(trigger + 1)}>camera</button>
    </div>
  );
}
