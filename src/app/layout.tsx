import './globals.scss'
import "./variable.scss"

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
    </html>
  )
}
