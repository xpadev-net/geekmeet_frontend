import { CallEndFilledIcon } from "@xpadev-net/material-icons/call-end-filled";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

import { SecondaryButton } from "@/components/buttons";
import { socketAtom } from "@/context/socket";

import Styles from "./button.module.scss";

const LeaveButton = () => {
  const socket = useAtomValue(socketAtom);
  const router = useRouter();
  if (!socket) return <></>;
  const onClick = () => {
    router.push("/leave");
    socket.emit("leaveRoom");
  };
  return (
    <SecondaryButton onClick={onClick} className={Styles.button}>
      <CallEndFilledIcon className={Styles.icon} />
    </SecondaryButton>
  );
};

export { LeaveButton };
