import { TextArea } from "@/components/chat-box/textarea/textarea";
import { MessageList } from "@/components/chat-box/message-list/message-list";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { socketAtom } from "@/context/socket";
import { useAtom } from "jotai/index";
import { chatAtom } from "@/context/chat";
import { ChatResponse } from "@/@types/socket";
import Styles from "./chat-box.module.scss";
import { CloseFilledIcon } from "@xpadev-net/material-icons/close-filled";

const ChatBox = () => {
  const socket = useAtomValue(socketAtom);
  const [chat, setChat] = useAtom(chatAtom);
  useEffect(() => {
    if (!socket) return;
    const onMessageHandler = (message: ChatResponse) => {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    };
    socket.on("chat", onMessageHandler);
    return () => {
      socket.off("chat", onMessageHandler);
    };
  }, [socket]);

  const submitChat = (content: string) => {
    if (!socket) return;
    socket.emit("chat", { content });
  };

  const closeButton = () => {
    setChat((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className={`${Styles.wrapper} ${!chat.isOpen && Styles.hide}`}>
      <div className={Styles.header}>
        <CloseFilledIcon onClick={closeButton} className={Styles.icon} />
        <h2 className={Styles.title}>Chat</h2>
      </div>
      <MessageList messages={chat.messages} className={Styles.messageList} />
      <TextArea onSubmit={submitChat} className={Styles.textarea} />
    </div>
  );
};

export { ChatBox };
