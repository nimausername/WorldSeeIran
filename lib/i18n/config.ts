/**
 * Supported site locales for WorldSeeIran.
 */
export const locales = ["en", "de", "fa"] as const

/**
 * Locale identifier used in URL segments.
 */
export type Locale = (typeof locales)[number]

/**
 * Default locale when no preference can be matched.
 */
export const defaultLocale: Locale = "en"

/**
 * Short labels for compact UI.
 */
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  fa: "فا",
}

/**
 * Full language names for the language menu.
 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fa: "فارسی",
}

/**
 * Returns true when the value is a supported locale.
 */
export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale)

/**
 * Returns text direction for a locale.
 */
export const getLocaleDirection = (locale: Locale): "ltr" | "rtl" =>
  locale === "fa" ? "rtl" : "ltr"
