import type { Locale } from "@/lib/i18n/config"

/**
 * Localized string map for oppressors copy fields.
 */
export type LocalizedString = Readonly<Record<Locale, string>>

/**
 * Accountability category for filtering the directory.
 */
export type OppressorCategory = "command" | "security" | "judiciary"

/**
 * Documented responsibility tags shown as badges.
 */
export type OppressorTag = "massacre" | "executions" | "enabling"

/**
 * External source citation for an entry.
 */
export type OppressorSource = {
  readonly label: string
  readonly url: string
}

/**
 * One documented individual in the oppressors record.
 */
export type OppressorPerson = {
  readonly id: string
  readonly name: LocalizedString
  readonly role: LocalizedString
  readonly summary: LocalizedString
  readonly category: OppressorCategory
  readonly tags: readonly OppressorTag[]
  readonly imageFile: string | null
  readonly sources: readonly OppressorSource[]
}

/**
 * Bundle meta for the oppressors dataset.
 */
export type OppressorsBundle = {
  readonly meta: {
    readonly updatedAt: string
    readonly count: number
    readonly source: string
  }
  readonly people: readonly OppressorPerson[]
}

/**
 * Client-ready oppressor with a resolved image URL.
 */
export type OppressorRecord = OppressorPerson & {
  readonly image: string | null
}
