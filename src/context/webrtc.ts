import {atom} from "jotai";

export const peerConnectionsAtom = atom<{[userId: string]:RTCPeerConnection}>({});