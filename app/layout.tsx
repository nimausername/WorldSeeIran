import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { brandOpenGraphImage, brandTwitter } from "@/lib/branding"
import { cn } from "@/lib/utils"

import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-fa",
})

export const metadata: Metadata = {
  title: "WorldSeeIran",
  description:
    "A memorial for those killed by the Islamic Republic of Iran during the latest uprising.",
  metadataBase: new URL("https://worldseeiran.org"),
  openGraph: {
    ...brandOpenGraphImage,
    siteName: "WorldSeeIran",
    type: "website",
  },
  twitter: brandTwitter,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
}

/**
 * Root layout shared across all locales.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geist.variable,
        geistMono.variable,
        vazirmatn.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
