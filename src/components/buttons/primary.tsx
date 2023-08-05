import { ComponentProps } from "react";

import Styles from "./primary.module.scss";

type Props = ComponentProps<"button">;

const PrimaryButton = (props: Props) => {
  return (
    <button {...props} className={`${props.className} ${Styles.button}`} />
  );
};

export { PrimaryButton };
