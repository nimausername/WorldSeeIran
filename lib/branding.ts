import type { Metadata } from "next"

import { siteName, siteUrl } from "@/lib/site"

/** Public path to the default Open Graph / Twitter share image. */
export const brandOgImagePath = "/branding/og-1.png"

/** Shared Open Graph image fields — spread into route `openGraph` objects. */
export const brandOpenGraphImage = {
  images: [
    {
      url: brandOgImagePath,
      width: 1200,
      height: 630,
      alt: siteName,
    },
  ],
} as const satisfies Pick<NonNullable<Metadata["openGraph"]>, "images">

/**
 * Favicon / apple icons are provided via App Router file conventions:
 * `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`.
 */

/** Default Twitter / X card using the branding OG image. */
export const brandTwitter = {
  card: "summary_large_image",
  images: [brandOgImagePath],
} as const satisfies Metadata["twitter"]

/**
 * Shared crawl directives — indexable memorial content.
 */
export const brandRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
} as const satisfies NonNullable<Metadata["robots"]>

/**
 * Optional Search Console / Bing HTML-tag verification via env.
 * Set `GOOGLE_SITE_VERIFICATION` (and optionally `BING_SITE_VERIFICATION`)
 * in production when using meta-tag verification instead of DNS/file upload.
 */
export const brandVerification = {
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : {}),
  ...(process.env.BING_SITE_VERIFICATION
    ? {
        other: {
          "msvalidate.01": process.env.BING_SITE_VERIFICATION,
        },
      }
    : {}),
} as const satisfies NonNullable<Metadata["verification"]>

/** Default Open Graph site identity. */
export const brandOpenGraphSite = {
  siteName,
  url: siteUrl,
} as const satisfies Pick<
  NonNullable<Metadata["openGraph"]>,
  "siteName" | "url"
>