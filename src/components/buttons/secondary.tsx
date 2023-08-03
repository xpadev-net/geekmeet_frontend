import {ComponentProps} from "react";

import Styles from "./secondary.module.scss";

type Props = ComponentProps<"button">;

const SecondaryButton = (props: Props) => {
  return <button {...props} className={`${props.className} ${Styles.button}`}/>
}

export {SecondaryButton}