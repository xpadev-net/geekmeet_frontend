import { MuteButton } from "@/components/controls/MuteButton";
import { CameraButton } from "@/components/controls/CameraButton";
import { LeaveButton } from "@/components/controls/LeaveButton";
import { ScreenShareButton } from "@/components/controls/ScreenShareButton";
import { ChatButton } from "@/components/controls/ChatButton";
import { BlurButton } from "@/components/controls/BlurButton";

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
      <LeaveButton />
    </div>
  );
};

export { Controls };
