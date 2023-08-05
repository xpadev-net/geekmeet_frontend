import { ComponentProps } from "react";
import Styles from "./TextInput.module.scss";

type props = ComponentProps<"input">;

const TextInput = (props: props) => {
  return (
    <label className={`${Styles.label} ${props.className}`}>
      <input type={"text"} className={Styles.input} {...props} />
    </label>
  );
};

export { TextInput };
