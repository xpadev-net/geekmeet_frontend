"use client";

import {useAtom, useAtomValue} from "jotai";
import {socketAtom} from "@/context/socket";
import {useEffect} from "react";
import {streamAtom} from "@/context/stream";
import {useRouter} from "next/navigation";
import {usersAtom} from "@/context/room";
import {WebRTCConnection} from "@/components/connection";
import {ConnectingResponse, LeaveResponse} from "@/@types/socket";

export default function Room(){
  const socket = useAtomValue(socketAtom);
  const mediaStream = useAtomValue(streamAtom);
  const [users, setUsers] = useAtom(usersAtom);
  const roomId = location.hash.slice(1);
  const router = useRouter();
  
  useEffect(() => {
    if (!socket||!mediaStream||!users) {
      router.push(`/join/#${roomId}`);
      return;
    }
    const onConnecting = ({userId}:ConnectingResponse) => {
      setUsers([...users,{userId,type:"answer"}])
    }
    
    const onLeave = ({userId}: LeaveResponse) => {
      setUsers(users.filter((user)=>user.userId!==userId))
    }
    
    socket.on("connecting",onConnecting);
    socket.on("leave",onLeave)
    return () => {
      socket.off("connecting",onConnecting);
      socket.off("leave",onLeave)
    }
  }, []);
  
  if (!socket||!mediaStream||!users) {
    return <></>;
  }
  
  return <>
    {users.map((user) => {
      return <WebRTCConnection key={user.userId} target={user.userId} type={user.type}/>
    })}
  </>
}