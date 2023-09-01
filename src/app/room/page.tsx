"use client";

import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ConnectingResponse, LeaveResponse } from "@/@types/socket";
import { ChatBox } from "@/components/chat-box";
import { Controls } from "@/components/controls";
import { VideoContainer } from "@/components/videoContainer/VideoContainer";
import { usersAtom } from "@/context/room";
import { socketAtom } from "@/context/socket";
import { localStreamAtom, stateAtom } from "@/context/stream";

import Styles from "./page.module.scss";

export default function Room() {
  const socket = useAtomValue(socketAtom);
  const mediaStream = useAtomValue(localStreamAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const roomId = typeof location !== "undefined" && location?.hash.slice(1);
  const state = useAtomValue(stateAtom);
  const router = useRouter();

  useEffect(() => {
    if (!socket || !mediaStream || !users) {
      router.push(`/join/#${roomId}`);
      return;
    }
    socket.emit("stateChange", state);
    const onConnecting = ({ userId, name }: ConnectingResponse) => {
      setUsers([...users, { userId, name, type: "answer" }]);
    };

    const onLeave = ({ userId }: LeaveResponse) => {
      setUsers(users.filter((user) => user.userId !== userId));
    };

    socket.on("connecting", onConnecting);
    socket.on("leave", onLeave);
    return () => {
      socket.off("connecting", onConnecting);
      socket.off("leave", onLeave);
    };
  }, [users]);

  useEffect(() => {
    socket?.emit("stateChange", state);
  }, [state, socket]);
  if (!socket || !mediaStream || !users) {
    return <></>;
  }
  return (
    <main className={Styles.wrapper}>
      <div className={Styles.main}>
        <VideoContainer />
        <ChatBox />
      </div>
      <Controls className={Styles.control} />
    </main>
  );
}
