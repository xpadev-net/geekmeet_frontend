import { atom } from "jotai";
const userImgCacheAtom = atom<{ [key: string]: string }>({});

export { userImgCacheAtom };
