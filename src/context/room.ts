import { atom } from "jotai";

export const usersAtom = atom<
  { userId: string; name: string; type: "offer" | "answer" }[] | undefined
>(undefined);
