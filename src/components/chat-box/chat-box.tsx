import { CloseFilledIcon } from "@xpadev-net/material-icons/close-filled";
import { useAtomValue } from "jotai";
import { useAtom } from "jotai/index";
import { useEffect, useState } from "react";

import { ChatResponse } from "@/@types/socket";
import { MessageList } from "@/components/chat-box/message-list/message-list";
import { TextArea } from "@/components/chat-box/textarea/textarea";
import { chatAtom } from "@/context/chat";
import { socketAtom } from "@/context/socket";

import Styles from "./chat-box.module.scss";

const ChatBox = () => {
  const socket = useAtomValue(socketAtom);
  const [chat, setChat] = useAtom(chatAtom);
  const [width, setWidth] = useState(250);
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

  const onMouseMove = (e: MouseEvent) => {
    const width = document.body.clientWidth - e.clientX;
    setWidth(Math.min(Math.max(width, 250), document.body.clientWidth / 2));
  };

  const onMouseDown = () => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("onmouseup", onMouseUp);
  };

  return (
    <div
      className={`${Styles.wrapper} ${!chat.isOpen && Styles.hide}`}
      style={{ width }}
    >
      <div className={Styles.grubber} onMouseDown={onMouseDown} />
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
