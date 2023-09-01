import { BlurButton } from "@/components/controls/BlurButton";
import { CameraButton } from "@/components/controls/CameraButton";
import { ChatButton } from "@/components/controls/ChatButton";
import { LeaveButton } from "@/components/controls/LeaveButton";
import { MuteButton } from "@/components/controls/MuteButton";
import { NoiseSuppressionButton } from "@/components/controls/NoiseButton";
import { ScreenShareButton } from "@/components/controls/ScreenShareButton";

type props = {
  className?: string;
};

const Controls = ({ className }: props) => {
  return (
    <div className={className}>
      <MuteButton />
      <CameraButton />
      <ScreenShareButton />
      <ChatButton />
      <BlurButton />
      <NoiseSuppressionButton />
      <LeaveButton />
    </div>
  );
};

export { Controls };
