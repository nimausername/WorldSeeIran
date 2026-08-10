import type { Locale } from "@/lib/i18n/config"

/**
 * BCP 47 locale tag for Intl formatters.
 */
const intlLocaleTag = (locale: Locale): string => {
  if (locale === "fa") {
    return "fa-IR"
  }

  if (locale === "de") {
    return "de-DE"
  }

  return "en-US"
}

/**
 * Replaces `{key}` placeholders in a copy template.
 */
export const formatTemplate = (
  template: string,
  values: Readonly<Record<string, string>>
): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)

/**
 * Formats an integer for display in the active locale.
 */
export const formatLocaleNumber = (locale: Locale, value: number): string =>
  new Intl.NumberFormat(intlLocaleTag(locale)).format(value)

/**
 * Formats a calendar date (from an ISO timestamp) for display in the active locale.
 */
export const formatLocaleDate = (locale: Locale, isoDate: string): string =>
  new Intl.DateTimeFormat(intlLocaleTag(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate))
