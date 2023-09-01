"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";

import { socketAtom } from "@/context/socket";

const Socket = () => {
  const setSocket = useSetAtom(socketAtom);
  useEffect(() => {
    const sock = io(process.env.NEXT_PUBLIC_API_ENDPOINT || "");
    sock.on("connect", () => {
      setSocket(sock);
    });
  }, []);
  return <></>;
};

export { Socket };
