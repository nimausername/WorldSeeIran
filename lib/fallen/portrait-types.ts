/**
 * Slim portrait record used by the javidnam field (client-safe payload).
 */
export type FallenPortrait = {
  readonly id: string
  readonly name: string
  readonly age: number | null
  readonly place: string | null
  readonly dateFormatted: string | null
  readonly image: string
}

/**
 * Compact on-disk image index: ids + png slot indices (jpg otherwise).
 * Paths expand to `{NEXT_PUBLIC_FALLEN_ASSET_BASE}/iranintl/{id}.{jpg|png}`
 * (or `/fallen/iranintl/...` when the env var is unset).
 */
export type FallenPortraitImagesCompact = {
  readonly ids: readonly string[]
  readonly pngs: readonly number[]
}

/**
 * Compact on-disk person meta aligned 1:1 with portrait image ids.
 * Keys stay short to minimize transfer size.
 */
export type FallenPortraitMetaCompact = {
  /** Names */
  readonly n: readonly string[]
  /** Ages */
  readonly a: readonly (number | null)[]
  /** Places */
  readonly p: readonly (string | null)[]
  /** Formatted dates */
  readonly d: readonly (string | null)[]
}

/**
 * @deprecated Prefer {@link FallenPortraitImagesCompact} + {@link FallenPortraitMetaCompact}.
 */
export type FallenPortraitsBundle = {
  readonly images: readonly string[]
  readonly people: readonly Omit<FallenPortrait, "image">[]
}
