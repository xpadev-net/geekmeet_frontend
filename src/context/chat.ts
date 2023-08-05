import { atom } from "jotai";
import { MessageItem } from "@/@types/chat";

export const chatAtom = atom<{
  isOpen: boolean;
  messages: MessageItem[];
}>({
  isOpen: false,
  messages: [],
});
