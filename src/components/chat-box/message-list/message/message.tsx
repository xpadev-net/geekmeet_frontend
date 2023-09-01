import { MessageItem } from "@/@types/chat";

import Styles from "./message.module.scss";

type props = {
  message: MessageItem;
};
const Message = ({ message }: props) => {
  return (
    <div className={Styles.wrapper}>
      <p className={Styles.sender}>{message.name}</p>
      <div className={Styles.content}>{message.content}</div>
    </div>
  );
};

export { Message };
