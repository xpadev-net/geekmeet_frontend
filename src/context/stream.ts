import { atom } from "jotai";

export const originalStreamAtom = atom<MediaStream | undefined>(undefined);
export const localStreamAtom = atom<MediaStream | undefined>(undefined);
export const sharedStreamAtom = atom<MediaStream | undefined>(undefined);

export const isScreenSharingAtom = atom(false);
export const isBlurAtom = atom(false);
export const isNoiseSuppressionAtom = atom(false);
export const stateAtom = atom({ camera: true, microphone: true });
