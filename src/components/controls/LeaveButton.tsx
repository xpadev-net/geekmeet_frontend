import { CallEndFilledIcon } from "@xpadev-net/material-icons/call-end-filled";
import { useAtomValue, useSetAtom } from "jotai";
import { socketAtom } from "@/context/socket";
import { useRouter } from "next/navigation";
import { localStreamAtom, sharedStreamAtom } from "@/context/stream";
import { usersAtom } from "@/context/room";

const LeaveButton = () => {
  const socket = useAtomValue(socketAtom);
  const setSharedStream = useSetAtom(sharedStreamAtom);
  const setLocalStream = useSetAtom(localStreamAtom);
  const setUsersAtom = useSetAtom(usersAtom);
  const router = useRouter();
  if (!socket) return <></>;
  const onClick = () => {
    socket.emit("leaveRoom");
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
