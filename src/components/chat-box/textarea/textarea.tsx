import { SecondaryButton } from "@/components/buttons";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import Styles from "./textarea.module.scss";
import { SendFilledIcon } from "@xpadev-net/material-icons/send-filled";

type props = {
  onSubmit: (value: string) => void;
  className?: string;
};

const TextArea = ({ onSubmit, className }: props) => {
  const [value, setValue] = useState("");

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (value === "") return;
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      onSubmitClick();
    }
  };

  const onSubmitClick = () => {
    onSubmit(value);
    setValue("");
  };

  return (
    <div className={`${className} ${Styles.wrapper}`}>
      <textarea
        value={value}
        onKeyDown={onKeyDown}
        onChange={(e) => setValue(e.target.value)}
        className={Styles.textarea}
      />
      <div className={Styles.control}>
        <SecondaryButton className={Styles.button} onClick={onSubmitClick}>
          <SendFilledIcon className={Styles.icon} />
        </SecondaryButton>
      </div>
    </div>
  );
};

export { TextArea };
