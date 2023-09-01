"use client";

import { useSetAtom } from "jotai";
import { useAtom } from "jotai/index";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { usersAtom } from "@/context/room";
import { localStreamAtom, sharedStreamAtom } from "@/context/stream";

export default function Leave() {
  const [sharedStream, setSharedStream] = useAtom(sharedStreamAtom);
  const [localStream, setLocalStream] = useAtom(localStreamAtom);
  const setUsersAtom = useSetAtom(usersAtom);
  const router = useRouter();
  useEffect(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    sharedStream?.getTracks().forEach((track) => track.stop());
    setSharedStream(undefined);
    setLocalStream(undefined);
    setUsersAtom(undefined);
    router.replace("/");
  }, []);
  return <></>;
}
