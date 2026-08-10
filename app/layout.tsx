import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google"

import { JsonLd } from "@/components/seo/json-ld"
import { ThemeProvider } from "@/components/theme-provider"
import {
  brandOpenGraphImage,
  brandOpenGraphSite,
  brandRobots,
  brandTwitter,
  brandVerification,
} from "@/lib/branding"
import { buildSiteGraph } from "@/lib/seo/structured-data"
import { siteName, siteUrl } from "@/lib/site"
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
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description:
    "A memorial for those killed by the Islamic Republic of Iran during the latest uprising.",
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "memorial",
  keywords: [
    "WorldSeeIran",
    "Iran",
    "memorial",
    "uprising",
    "Islamic Republic",
    "javidnam",
    "oppressors",
    "accountability",
    "protests",
    "human rights",
  ],
  robots: brandRobots,
  ...(Object.keys(brandVerification).length > 0
    ? { verification: brandVerification }
    : {}),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    ...brandOpenGraphImage,
    ...brandOpenGraphSite,
    type: "website",
  },
  twitter: brandTwitter,
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
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
        <JsonLd id="site-structured-data" data={buildSiteGraph()} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
