import { TextArea } from "@/components/chat-box/textarea/textarea";
import { MessageList } from "@/components/chat-box/message-list/message-list";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { socketAtom } from "@/context/socket";
import { useAtom } from "jotai/index";
import { chatAtom } from "@/context/chat";
import { ChatResponse } from "@/@types/socket";

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

  return (
    <div>
      <MessageList messages={chat.messages} />
      <TextArea onSubmit={submitChat} />
    </div>
  );
};

export { ChatBox };
