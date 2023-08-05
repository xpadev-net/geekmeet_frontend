import { CallEndFilledIcon } from "@xpadev-net/material-icons/call-end-filled";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { socketAtom } from "@/context/socket";
import { useRouter } from "next/navigation";
import { localStreamAtom, sharedStreamAtom } from "@/context/stream";
import { usersAtom } from "@/context/room";

const LeaveButton = () => {
  const socket = useAtomValue(socketAtom);
  const [sharedStream, setSharedStream] = useAtom(sharedStreamAtom);
  const [localStream, setLocalStream] = useAtom(localStreamAtom);
  const setUsersAtom = useSetAtom(usersAtom);
  const router = useRouter();
  if (!socket) return <></>;
  const onClick = () => {
    socket.emit("leaveRoom");
    localStream?.getTracks().forEach((track) => track.stop());
    sharedStream?.getTracks().forEach((track) => track.stop());
    setSharedStream(undefined);
    setLocalStream(undefined);
    setUsersAtom(undefined);
    router.push("/");
  };
  return (
    <button onClick={onClick}>
      <CallEndFilledIcon />
    </button>
  );
};

export { LeaveButton };
