import { MessageItem } from "@/@types/chat";
import { Message } from "@/components/chat-box/message-list/message/message";

type props = {
  messages: MessageItem[];
};

const MessageList = ({ messages }: props) => {
  return (
    <div>
      {messages.map((message) => {
        return <Message key={message.id} message={message} />;
      })}
    </div>
  );
};

export { MessageList };
