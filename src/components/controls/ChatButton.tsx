import { ChatFilledIcon } from "@xpadev-net/material-icons/chat-filled";
import { useSetAtom } from "jotai";

import { SecondaryButton } from "@/components/buttons";
import { chatAtom } from "@/context/chat";

import Styles from "./button.module.scss";

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
