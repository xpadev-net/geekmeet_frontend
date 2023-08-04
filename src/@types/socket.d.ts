import {UUID} from "@/@types/brands";

export type ServerToClientEvents = {
  joinRoom: (param: JoinRoomResponse) => void,
};

export type JoinRoomResponse = {
  code: 404,
  message: "room not found"
} | {
  code: 403,
  message: "not allowed",
} | {
  code: 200,
  users: string[],
}

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
  dest: UUID;
  data: unknown;
}
  | {
  type: "public";
  data: unknown;
};

export type WebrtcSdpBody = {
  description: RTCSessionDescription;
  dest: UUID;
};

export type WebrtcIceBody = {
  candidate: RTCIceCandidate;
  dest: UUID;
};

export type ClientToServerEvents = {
  createRoom:(param:CreateRoomBody) =>void
  joinRoom: (param: JoinRoomBody) => void,
  webrtcIce: (param: WebrtcIceBody) => void,
  webrtcSdp: (param: WebrtcSdpBody) => void;
  message: (param: SendMessageBody) => void,
  leaveRoom: () => void,
};