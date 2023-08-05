"use client";

import { useSetAtom } from "jotai";
import { localStreamAtom, sharedStreamAtom } from "@/context/stream";
import { usersAtom } from "@/context/room";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai/index";
import { useEffect } from "react";

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
