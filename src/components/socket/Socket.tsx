"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { socketAtom } from "@/context/socket";
import { io } from "socket.io-client";

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
