import type { MetadataRoute } from "next"

import { siteName } from "@/lib/site"

/**
 * Web app manifest for installability and richer browser/search signals.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteName,
    description:
      "A memorial for those killed by the Islamic Republic of Iran during the latest uprising.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#252525",
    lang: "en",
    dir: "auto",
    categories: ["social", "news", "education"],
    icons: [
      {
        src: "/branding/wsi-icon.png",
        sizes: "2000x2000",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  }
}
