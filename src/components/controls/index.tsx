import { MuteButton } from "@/components/controls/MuteButton";
import { CameraButton } from "@/components/controls/CameraButton";
import { LeaveButton } from "@/components/controls/LeaveButton";

const Controls = () => {
  return (
    <div>
      <MuteButton />
      <CameraButton />
      <LeaveButton />
    </div>
  );
};

export { Controls };
