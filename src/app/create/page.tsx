"use client";

import Styles from "./page.module.scss";

import { Selector } from "@/components/selector";
import { useState } from "react";
import { RoomType } from "@/@types/types";
import { PrimaryButton } from "@/components/buttons";
import { EmailInputs } from "@/components/email-inputs/email-inputs";
import { useAtomValue } from "jotai";
import { socketAtom } from "@/context/socket";
import { useRouter } from "next/navigation";

export default function CreateRoom() {
  const [roomType, setRoomType] = useState<RoomType>("normal");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [emails, setEmails] = useState<string[]>([]);

  const socket = useAtomValue(socketAtom);

  const router = useRouter();
  if (!socket) return <></>;
  const createRoom = () => {
    socket.once("createRoom", (param) => {
      if (param.code !== 200) return;
      router.push(`/join/#${param.roomId}`);
    });
    socket.emit("createRoom", {
      isPrivate,
      isLt: roomType !== "normal",
      allowed: emails,
    });
  };

  return (
    <main className={Styles.wrapper}>
      <div className={Styles.container}>
        <div>
          <p>種類</p>
          <Selector
            value={roomType}
            options={[
              { label: "通常", value: "normal" },
              { label: "発表会用", value: "presenter", disabled: true },
            ]}
            onChange={(val) => setRoomType(val)}
          />
        </div>
        <div>
          <p>公開設定</p>
          <Selector
            value={`${isPrivate}`}
            options={[
              { label: "限定公開", value: "false" },
              { label: "非公開", value: "true", disabled: true },
            ]}
            onChange={(val) => setIsPrivate(val === "true")}
          />
        </div>
        {isPrivate && (
          <div>
            <p>許可対象</p>
            <EmailInputs onChange={(val) => setEmails(val)} emails={emails} />
          </div>
        )}
        <PrimaryButton className={Styles.createButton} onClick={createRoom}>
          部屋を作成
        </PrimaryButton>
      </div>
    </main>
  );
}
