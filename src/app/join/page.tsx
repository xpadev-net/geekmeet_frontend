"use client";

import {useEffect, useRef, useState} from "react";
import {useAtom, useAtomValue} from "jotai";
import {streamAtom} from "@/context/stream";
import {socketAtom} from "@/context/socket";
import {UUID} from "@/@types/brands";
import {redirect, useRouter} from "next/navigation";

export default function JoinRoom(){
  const [isLoading,setIsLoading] = useState(false);
  const [stream,setStream] = useAtom(streamAtom)
  const socket = useAtomValue(socketAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const roomId = location.hash.slice(1);
  const router = useRouter()
  useEffect(()=>{
    (async () => {
      if (videoRef.current === null) return;
      if (!navigator.mediaDevices.getUserMedia) return;
      
      if (stream) {
        try {
          stream.getTracks().forEach(track => {
            track.stop();
          });
        } catch(error) {
          console.error(error);
        }
      }
      const constraints = {
        audio: true,
        video: true
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    })();
  },[videoRef]);
  
  if (!socket) return <></>;
  
  const joinRoomHandler = () => {
    socket.once("joinRoom",(param)=>{
      setIsLoading(false);
      if (param.code !== 200){
        alert(param.message);
        return;
      }
      router.push(`/room/#${roomId}`)
    })
    setIsLoading(true);
    socket.emit("joinRoom",{roomId: roomId as UUID})
  }
  
  return <div>
    <video ref={videoRef}/>
    <button onClick={joinRoomHandler}>join</button>
  </div>
}