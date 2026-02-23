import './globals.css'

export const metadata = {
  title: 'Sila Arctic Sailing',
  description: 'Arctic sailing expeditions aboard yacht Sila',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
