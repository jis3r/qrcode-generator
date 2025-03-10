import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
// import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Generate and download QR codes easily",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={GeistMono.className}>
          <main className="min-h-screen bg-background">{children}</main>
      </body>
    </html>
  )
}

