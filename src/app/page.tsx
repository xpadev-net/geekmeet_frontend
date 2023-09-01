"use client";

import { ArrowForwardFilledIcon } from "@xpadev-net/material-icons/arrow-forward-filled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { useState } from "react";

import { SecondaryButton } from "@/components/buttons";

import Styles from "./page.module.scss";

export default function Home() {
  const [code, setCode] = useState<string>("");

  const router = useRouter();
  const onJoinClick = () => {
    router.push(`/join#${code}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.code !== "Enter") return;
    onJoinClick();
  };

  return (
    <main className={Styles.wrapper}>
      <div className={Styles.container}>
        <h1>GeekMeet</h1>
        <label className={Styles.joinRoom}>
          <input
            className={Styles.input}
            type="text"
            placeholder={"参加コード"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className={Styles.button} onClick={onJoinClick}>
            <ArrowForwardFilledIcon className={Styles.icon} />
          </button>
        </label>
        <Link href={"/create"} className={Styles.create}>
          <SecondaryButton className={Styles.button}>
            部屋を作成
          </SecondaryButton>
        </Link>
      </div>
    </main>
  );
}
