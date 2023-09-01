import { atom } from "jotai";
import { Socket } from "socket.io-client";

import { ClientToServerEvents, ServerToClientEvents } from "@/@types/socket";

export const socketAtom = atom<
  Socket<ServerToClientEvents, ClientToServerEvents> | undefined
>(undefined);
