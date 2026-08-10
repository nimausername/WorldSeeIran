import { defaultLocale, locales, type Locale } from "@/lib/i18n/config"

/** Canonical production origin used for SEO URLs. */
export const siteUrl = "https://worldseeiran.org"

/** Absolute site name for metadata and structured data. */
export const siteName = "WorldSeeIran"

/**
 * Builds an absolute URL for a path (leading slash optional).
 */
export const absoluteUrl = (path = "/"): string => {
  if (path === "" || path === "/") {
    return siteUrl
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Builds a locale-prefixed path (e.g. `/en/javidnam`).
 */
export const localePath = (locale: Locale, path = ""): string => {
  const normalized =
    path === "" || path === "/"
      ? ""
      : path.startsWith("/")
        ? path
        : `/${path}`

  return `/${locale}${normalized}`
}

/**
 * Absolute URL for a locale + optional path segment.
 */
export const localeUrl = (locale: Locale, path = ""): string =>
  absoluteUrl(localePath(locale, path))

/**
 * hreflang map for a path across all locales, plus `x-default`.
 */
export const languageAlternates = (
  path = ""
): Record<Locale | "x-default", string> => {
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, localeUrl(locale, path)])
  ) as Record<Locale, string>

  return {
    ...languages,
    "x-default": localeUrl(defaultLocale, path),
  }
}

/**
 * Public routes included in the sitemap (path after the locale segment).
 */
export const sitemapRoutes = [
  {
    path: "",
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "javidnam",
    changeFrequency: "daily" as const,
    priority: 0.9,
  },
  {
    path: "oppressors",
    changeFrequency: "weekly" as const,
    priority: 0.85,
  },
] as const
