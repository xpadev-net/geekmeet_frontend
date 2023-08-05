import { MessageItem } from "@/@types/chat";

type props = {
  message: MessageItem;
};
const Message = ({ message }: props) => {
  return (
    <div>
      <p>{message.name}</p>
      <div>{message.content}</div>
    </div>
  );
};

export { Message };
