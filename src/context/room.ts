import {atom} from "jotai";

export const usersAtom = atom<{ userId: string, type: "offer"|"answer" }[]|undefined>(undefined);