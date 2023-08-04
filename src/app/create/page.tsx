"use client"

import Styles from "./page.module.scss"

import {Selector} from "@/components/selector";
import {useState} from "react";
import {RoomType} from "@/@types/types";
import {PrimaryButton} from "@/components/buttons";
import {EmailInputs} from "@/components/email-inputs/email-inputs";

export default function CreateRoom() {
  const [roomType,setRoomType] = useState<RoomType>("normal")
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [emails,setEmails] = useState<string[]>([]);
  return <main className={Styles.wrapper}>
    <div className={Styles.container}>
      <div>
        <p>種類</p>
        <Selector value={roomType} options={[{label:"通常",value:"normal"},{label:"発表会用",value:"presenter"}]} onChange={(val)=>setRoomType(val)}/>
      </div>
      <div>
        <p>公開設定</p>
        <Selector value={`${isPrivate}`} options={[{label:"限定公開",value:"false"},{label:"非公開",value:"true"}]} onChange={(val)=>setIsPrivate(val==="true")}/>
      </div>
      {isPrivate && <div>
        <p>許可対象</p>
        <EmailInputs onChange={(val)=>setEmails(val)} emails={emails}/>
      </div>}
      <PrimaryButton className={Styles.createButton}>
        部屋を作成
      </PrimaryButton>
    </div>
  </main>
}