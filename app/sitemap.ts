import type { MetadataRoute } from "next"

import { FALLEN_PEOPLE_META } from "@/lib/fallen/people"
import { locales } from "@/lib/i18n/config"
import {
  languageAlternates,
  localeUrl,
  sitemapRoutes,
} from "@/lib/site"

/**
 * Localized XML sitemap for Google Search Console and crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(FALLEN_PEOPLE_META.fetchedAt)

  return sitemapRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: localeUrl(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: languageAlternates(route.path),
      },
    }))
  )
}
