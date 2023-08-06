import { MessageItem } from "@/@types/chat";
import { Message } from "@/components/chat-box/message-list/message/message";

type props = {
  messages: MessageItem[];
  className?: string;
};

const MessageList = ({ messages, className }: props) => {
  return (
    <div className={className}>
      {messages.map((message) => {
        return <Message key={message.id} message={message} />;
      })}
    </div>
  );
};

export { MessageList };
