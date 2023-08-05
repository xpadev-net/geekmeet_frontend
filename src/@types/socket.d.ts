import { UUID } from "@/@types/brands";

export type ServerToClientEvents = {
  joinRoom: (param: JoinRoomResponse) => void;
  connecting: (param: ConnectingResponse) => void;
  leave: (param: LeaveResponse) => void;
  webrtcSdp: (param: WebrtcSdpResponse) => void;
  webrtcIce: (param: WebrtcIceResponse) => void;
  createRoom: (param: CreateRoomResponse) => void;
  message: (param: SendMessageResponse) => void;
};

export type SendMessageResponse = {
  src: string;
  data: unknown;
};
export type CreateRoomResponse = {
  code: 200;
  roomId: UUID;
};
export type WebrtcSdpResponse = {
  description: RTCSessionDescription;
  src: string;
};
export type WebrtcIceResponse = {
  candidate: RTCIceCandidate;
  src: string;
};
export type LeaveResponse = { userId: string };
export type ConnectingResponse = { userId: string };

export type JoinRoomResponse =
  | {
      code: 404;
      message: string;
    }
  | {
      code: 403;
      message: string;
    }
  | {
      code: 200;
      users: string[];
    };

export type CreateRoomBody =
  | {
      isPrivate: false;
      isLt: boolean;
    }
  | {
      isPrivate: true;
      isLt: boolean;
      allowed: string[];
    };

export type JoinRoomBody = {
  roomId: UUID;
};

export type SendMessageBody =
  | {
      type: "private";
      dest: string;
      data: unknown;
    }
  | {
      type: "public";
      data: unknown;
    };

export type WebrtcSdpBody = {
  description: RTCSessionDescription;
  dest: string;
};

export type WebrtcIceBody = {
  candidate: RTCIceCandidate;
  dest: string;
};

export type ClientToServerEvents = {
  createRoom: (param: CreateRoomBody) => void;
  joinRoom: (param: JoinRoomBody) => void;
  webrtcIce: (param: WebrtcIceBody) => void;
  webrtcSdp: (param: WebrtcSdpBody) => void;
  message: (param: SendMessageBody) => void;
  leaveRoom: () => void;
};
