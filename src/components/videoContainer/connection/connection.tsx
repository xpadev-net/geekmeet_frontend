import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

import { TrackUpdateEvent } from "@/@types/global";
import {
  StateChangeResponse,
  WebrtcIceResponse,
  WebrtcSdpResponse,
} from "@/@types/socket";
import { Video } from "@/components/videoContainer/video";
import { PeerConnectionConfig } from "@/context/config";
import { socketAtom } from "@/context/socket";
import { sharedStreamAtom, stateAtom } from "@/context/stream";

type props = {
  target: string;
  name: string;
  type: "offer" | "answer";
  size: { width: number; height: number };
};

function errorHandler(error: Error) {
  console.error("Signaling error.\n\n" + error.name + ": " + error.message);
}

const WebRTCConnection = ({ target, name, type, size }: props) => {
  const socket = useAtomValue(socketAtom);
  const sharedStream = useAtomValue(sharedStreamAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const state = useAtomValue(stateAtom);
  const [remoteState, setRemoteState] = useState({
    camera: true,
    microphone: true,
  });

  useEffect(() => {
    if (!socket || !videoRef.current || !sharedStream) {
      return;
    }
    const pc = new RTCPeerConnection(PeerConnectionConfig);
    let remoteStream: MediaStream;
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIce", {
          dest: target,
          candidate: event.candidate,
        });
      }
    };
    pc.ontrack = (event) => {
      if (!videoRef.current) return;
      if (pc) {
        if (event?.streams[0]) {
          remoteStream = event.streams[0];
        } else {
          remoteStream = new MediaStream([event.track]);
        }
        videoRef.current.srcObject = remoteStream;
      }
    };
    for (const track of sharedStream.getTracks()) {
      pc.addTrack(track, sharedStream);
    }

    const onTrackRemove = (e: TrackUpdateEvent) => {
      const sender = pc.getSenders().find((s) => s.track === e.detail.track);
      if (!sender) return;
      pc.removeTrack(sender);
    };

    const onTrackAdd = (e: TrackUpdateEvent) => {
      pc.addTrack(e.detail.track, sharedStream);

      pc.createOffer().then(setDescription);
    };

    sharedStream.addEventListener("_removetrack", onTrackRemove);
    sharedStream.addEventListener("_addtrack", onTrackAdd);

    const setDescription = (description: RTCSessionDescriptionInit) => {
      pc.setLocalDescription(description)
        .then(() => {
          if (!pc.localDescription) throw new Error("localDescription is null");
          socket.emit("webrtcSdp", {
            dest: target,
            description: pc.localDescription,
          });
        })
        .catch(errorHandler);
    };

    if (type === "offer") {
      pc.createOffer().then(setDescription);
    }

    const onWebRTCSdp = (param: WebrtcSdpResponse) => {
      if (param.src !== target) return;
      if (param.description.type === "offer") {
        pc.setRemoteDescription(param.description)
          .then(() => {
            // Answerの作成
            pc.createAnswer().then(setDescription).catch(errorHandler);
          })
          .catch(errorHandler);
      } else if (param.description.type === "answer") {
        pc.setRemoteDescription(param.description).catch(errorHandler);
      }
      socket.emit("stateChange", state);
    };
    const iceQueue: WebrtcIceResponse[] = [];
    const iceHandler = (param: WebrtcIceResponse) => {
      if (param.src !== target) return;
      if (pc.remoteDescription) {
        pc.addIceCandidate(new RTCIceCandidate(param.candidate)).catch(
          errorHandler,
        );
      } else {
        iceQueue.push(param);
      }
      if (iceQueue.length > 0 && pc.remoteDescription) {
        const task = iceQueue.shift();
        if (!task) throw new Error("task is null");
        iceHandler(task);
      }
    };
    const onStateChange = (state: StateChangeResponse) => {
      if (state.src !== target) return;
      setRemoteState(state.data);
    };

    socket.on("webrtcIce", iceHandler);

    socket.on("webrtcSdp", onWebRTCSdp);

    socket.on("stateChange", onStateChange);

    return () => {
      socket.off("webrtcSdp", onWebRTCSdp);
      socket.off("webrtcIce", iceHandler);
      socket.off("stateChange", onStateChange);
      sharedStream.removeEventListener("_removetrack", onTrackRemove);
      sharedStream.removeEventListener("_addtrack", onTrackAdd);
      try {
        remoteStream?.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (error) {
        console.error(error);
      }
      pc.close();
    };
  }, [target, videoRef]);
  return (
    <>
      <Video ref={videoRef} name={name} size={size} />
    </>
  );
};

export { WebRTCConnection };
