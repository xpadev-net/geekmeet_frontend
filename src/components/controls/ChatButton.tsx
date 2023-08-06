import { useSetAtom } from "jotai";
import { SecondaryButton } from "@/components/buttons";
import Styles from "./button.module.scss";
import { ChatFilledIcon } from "@xpadev-net/material-icons/chat-filled";
import { chatAtom } from "@/context/chat";

const ChatButton = () => {
  const setChat = useSetAtom(chatAtom);
  const onClick = () => {
    setChat((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };
  return (
    <SecondaryButton onClick={onClick} className={Styles.button}>
      <ChatFilledIcon className={Styles.icon} />
    </SecondaryButton>
  );
};

export { ChatButton };
