import { brandOgImagePath } from "@/lib/branding"
import { FALLEN_PEOPLE_META } from "@/lib/fallen/people"
import type { Locale } from "@/lib/i18n/config"
import { OPPRESSORS_META } from "@/lib/oppressors"
import { absoluteUrl, localeUrl, siteName, siteUrl } from "@/lib/site"

const localeToSchema = (locale: Locale): string => {
  if (locale === "fa") {
    return "fa-IR"
  }

  if (locale === "de") {
    return "de-DE"
  }

  return "en-US"
}

/**
 * Organization + WebSite graph shared across the site.
 */
export const buildSiteGraph = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteName,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/branding/wsi-icon.png"),
      },
      image: absoluteUrl(brandOgImagePath),
      description:
        "A memorial for those killed by the Islamic Republic of Iran during the latest uprising.",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description:
        "A memorial for those killed by the Islamic Republic of Iran during the latest uprising.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: ["en", "de", "fa"],
    },
  ],
})

/**
 * WebPage schema for the localized home page.
 */
export const buildHomePageSchema = (locale: Locale, description: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${localeUrl(locale)}#webpage`,
  url: localeUrl(locale),
  name: siteName,
  description,
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: localeToSchema(locale),
})

/**
 * CollectionPage schema for the javidnam memorial field.
 */
export const buildJavidnamPageSchema = (
  locale: Locale,
  title: string,
  description: string
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${localeUrl(locale, "javidnam")}#webpage`,
  url: localeUrl(locale, "javidnam"),
  name: title,
  description,
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: localeToSchema(locale),
  numberOfItems: FALLEN_PEOPLE_META.count,
  dateModified: FALLEN_PEOPLE_META.fetchedAt,
})

/**
 * CollectionPage schema for the oppressors accountability directory.
 */
export const buildOppressorsPageSchema = (
  locale: Locale,
  title: string,
  description: string
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${localeUrl(locale, "oppressors")}#webpage`,
  url: localeUrl(locale, "oppressors"),
  name: title,
  description,
  isPartOf: {
    "@id": `${siteUrl}/#website`,
  },
  about: {
    "@id": `${siteUrl}/#organization`,
  },
  inLanguage: localeToSchema(locale),
  numberOfItems: OPPRESSORS_META.count,
  dateModified: OPPRESSORS_META.updatedAt,
})
