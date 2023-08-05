import { SecondaryButton } from "@/components/buttons";
import { useState } from "react";

type props = {
  onSubmit: (value: string) => void;
};

const TextArea = ({ onSubmit }: props) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} />
      <div>
        <SecondaryButton onClick={() => onSubmit(value)}>送信</SecondaryButton>
      </div>
    </div>
  );
};

export { TextArea };
