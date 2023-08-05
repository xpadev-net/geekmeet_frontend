import { useState, KeyboardEvent } from "react";
import Styles from "./email-inputs.module.scss";
import { DeleteOutlinedIcon } from "@xpadev-net/material-icons/delete-outlined";

const Email = ({ email, onClick }: { email: string; onClick: () => void }) => {
  return (
    <div className={Styles.email} onClick={onClick} title={email}>
      <span className={Styles.content}>{email}</span>
      <DeleteOutlinedIcon className={Styles.icon} />
    </div>
  );
};

type props = {
  emails: string[];
  onChange: (emails: string[]) => void;
};

const EmailInputs = ({ emails, onChange }: props) => {
  const [input, setInput] = useState("");

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    //@ts-ignore
    if (
      e.code === "Enter" &&
      !emails.includes(input) &&
      !e.nativeEvent.isComposing &&
      e.currentTarget.validity.valid
    ) {
      e.preventDefault();
      onChange([...emails, input]);
      setInput("");
    } else if (e.code === "Backspace" && input === "") {
      onChange(emails.slice(0, -1));
    }
  };

  return (
    <label className={Styles.wrapper} htmlFor={Styles.input}>
      {emails.map((email) => (
        <Email
          key={email}
          email={email}
          onClick={() => onChange(removeItemFromArray(emails, email))}
        />
      ))}
      <input
        id={Styles.input}
        placeholder={"example@example.com"}
        className={Styles.input}
        type="email"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </label>
  );
};

const removeItemFromArray = (array: string[], value: string) => {
  return array.filter((item) => item !== value);
};

export { EmailInputs };
