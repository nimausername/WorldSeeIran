/**
 * A memorial person entry imported from Iran International's Javidnaman project.
 */
export type FallenPerson = {
  /** Stable source identifier from javidnaman.iranintl.com */
  readonly id: string
  /** Full name in Persian */
  readonly name: string
  /** Age at death, when known */
  readonly age: number | null
  /** Place of death or last known place, when known */
  readonly place: string | null
  /** Whether the source lists a portrait */
  readonly hasProfileImage: boolean
  /** Jalali death date as `YYYY-MM-DD`, when known */
  readonly dateJalali: string | null
  /** Persian formatted death date from the source */
  readonly dateFormatted: string | null
  /** Gregorian death date as `YYYY-MM-DD`, when known */
  readonly dateGregorian: string | null
  /** Provenance label */
  readonly source: string
  /** Canonical source page */
  readonly sourceUrl: string
  /** Remote CDN portrait URL, when available */
  readonly imageRemoteUrl: string | null
  /** Local portrait path under `/public`, when downloaded */
  readonly image: string | null
}

/**
 * On-disk bundle shape for the Iran International memorial import.
 */
export type FallenPeopleBundle = {
  readonly source: string
  readonly fetchedAt: string
  readonly count: number
  readonly withImages: number
  readonly localImageDir?: string
  readonly people: readonly FallenPerson[]
}
