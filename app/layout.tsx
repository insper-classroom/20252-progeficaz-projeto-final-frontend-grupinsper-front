import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "InvoiceFlow - Gestão de Faturas",
  description: "Sistema de gestão de faturas bancárias",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <style>{`
          button#next-logo,
          [data-nextjs-devtools],
          [data-next-badge-root],
          nextjs-portal,
          next-route-announcer button,
          [data-nextjs-scroll-focus-boundary] button {
            display: none !important;
          }
        `}</style>
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
        <Script id="hide-next-button" strategy="afterInteractive">
          {`
            (function hideNextDevTools() {
              const hide = () => {
                document.querySelectorAll(
                  'button#next-logo, [data-nextjs-devtools], [data-next-badge-root], nextjs-portal button'
                ).forEach(el => el?.remove());
              };
              hide();
              setInterval(hide, 500);
              new MutationObserver(hide).observe(document.body, { childList: true, subtree: true });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}