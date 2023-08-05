import { atom } from "jotai";

export const localStreamAtom = atom<MediaStream | undefined>(undefined);
export const sharedStreamAtom = atom<MediaStream | undefined>(undefined);

export const isScreenSharingAtom = atom(false);
