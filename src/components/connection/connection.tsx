import {useAtomValue} from "jotai";
import {useEffect, useRef} from "react";
import {socketAtom} from "@/context/socket";
import {streamAtom} from "@/context/stream";
import {PeerConnectionConfig} from "@/context/config";
import {WebrtcIceResponse, WebrtcSdpBody, WebrtcSdpResponse} from "@/@types/socket";

type props = {
  target: string,
  type: "offer"|"answer"
}

function errorHandler(error:Error) {
  alert('Signaling error.\n\n' + error.name + ': ' + error.message);
}


const WebRTCConnection = ({target,type}:props) => {
  const socket = useAtomValue(socketAtom);
  const localStream = useAtomValue(streamAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (!socket||!videoRef.current||!localStream) {
      return;
    }
    const pc = new RTCPeerConnection(PeerConnectionConfig);
    let remoteStream: MediaStream;
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcIce",{
          dest: target,
          candidate: event.candidate
        })
      }
    }
    pc.ontrack = (event) => {
      if (!videoRef.current) return;
      if (pc) {
        // Remote側のストリームを設定
        if (event?.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        } else {
          videoRef.current.srcObject = new MediaStream([event.track]);
        }
      }
    };
    for (const track of localStream.getTracks()) {
      pc.addTrack(track, localStream);
    }
    
    const setDescription = (description: RTCSessionDescriptionInit) => {
      pc.setLocalDescription(description).then(()=>{
        if (!pc.localDescription) throw new Error("localDescription is null");
        socket.emit("webrtcSdp",{
          dest: target,
          description: pc.localDescription
        })
      }).catch(errorHandler)
    }
    
    if (type === "offer") {
      pc.createOffer().then(setDescription)
    }
    
    const onWebRTCSdp = (param: WebrtcSdpResponse) => {
      if (param.src !== target)return;
      if (param.description.type === 'offer') {
        pc.setRemoteDescription(param.description).then(() => {
          // Answerの作成
          pc.createAnswer().then(setDescription).catch(errorHandler);
        }).catch(errorHandler);
      } else if (param.description.type === 'answer') {
        pc.setRemoteDescription(param.description).catch(errorHandler);
      }
    }
    const iceQueue:WebrtcIceResponse[] = [];
    const iceHandler = (param: WebrtcIceResponse)=>{
      if (param.src !== target)return;
      if (pc.remoteDescription) {
        pc.addIceCandidate(new RTCIceCandidate(param.candidate)).catch(errorHandler);
      } else {
        // SDPが未処理のためキューに貯める
        iceQueue.push(param);
      }
      const task = iceQueue.shift()
      if (task) {
        iceHandler(task)
      }
    }
    socket.on("webrtcIce",iceHandler)
    
    socket.on("webrtcSdp",onWebRTCSdp)
    return () => {
      socket.off("webrtcSdp",onWebRTCSdp)
      try {
        remoteStream?.getTracks().forEach(track => {
          track.stop();
        });
      } catch (error) {
        console.error(error);
      }
      pc.close();
    }
  }, [target,videoRef]);
  
  return <div>
    <video ref={videoRef} playsInline={true} autoPlay={true}/>
  </div>
}

export {WebRTCConnection};