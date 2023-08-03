import Styles from './page.module.scss'
import {ArrowForwardFilledIcon} from "@xpadev-net/material-icons";
import Link from "next/link";

export default function Home() {
  return (
    <main className={Styles.wrapper}>
      <div className={Styles.container}>
        <h1>GeekMeet</h1>
        <label className={Styles.joinRoom}>
          <input className={Styles.input} type="text" placeholder={"参加コード"}/>
          <button className={Styles.button}>
            <ArrowForwardFilledIcon className={Styles.icon}/>
          </button>
        </label>
        <Link href={"/create"} className={Styles.createRoom}>
          部屋を作成
        </Link>
      </div>
    </main>
  )
}
