import type { Metadata } from "next"

/** Public path to the default Open Graph / Twitter share image. */
export const brandOgImagePath = "/branding/og-1.png"

/** Shared Open Graph image fields — spread into route `openGraph` objects. */
export const brandOpenGraphImage = {
  images: [
    {
      url: brandOgImagePath,
      width: 1200,
      height: 630,
      alt: "WorldSeeIran",
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
