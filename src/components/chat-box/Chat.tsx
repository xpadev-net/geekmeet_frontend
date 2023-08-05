import { TextArea } from "@/components/chat-box/textarea/textarea";
import { MessageList } from "@/components/chat-box/message-list/message-list";

const ChatBox = () => {
  return (
    <div>
      <MessageList messages={[]} />
      <TextArea onSubmit={() => 0} />
    </div>
  );
};

export { ChatBox };
