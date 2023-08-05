import { MuteButton } from "@/components/controls/MuteButton";
import { CameraButton } from "@/components/controls/CameraButton";
import { LeaveButton } from "@/components/controls/LeaveButton";

type props = {
  className?: string;
};

const Controls = ({ className }: props) => {
  return (
    <div className={className}>
      <MuteButton />
      <CameraButton />
      <LeaveButton />
    </div>
  );
};

export { Controls };
