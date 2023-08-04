import './globals.scss'
import "./variable.scss"
import {Socket} from "@/components/socket/Socket";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <title>GeekMeet</title>
      </head>
      <body>{children}</body>
      <Socket/>
    </html>
  )
}
