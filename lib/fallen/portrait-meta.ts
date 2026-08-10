import metaCompact from "@/data/fallen-portrait-meta.json"

import {
  FALLEN_PORTRAIT_IDS,
  FALLEN_PORTRAIT_IMAGES,
} from "@/lib/fallen/portrait-images"
import type {
  FallenPortrait,
  FallenPortraitMetaCompact,
} from "@/lib/fallen/portrait-types"

const meta = metaCompact as FallenPortraitMetaCompact

/**
 * Builds a slim portrait record for a field index.
 * Kept in a separate module so the field can load images first and defer meta.
 */
export const getFallenPortraitByIndex = (
  index: number
): FallenPortrait | undefined => {
  const id = FALLEN_PORTRAIT_IDS[index]
  const image = FALLEN_PORTRAIT_IMAGES[index]
  const name = meta.n[index]

  if (!id || !image || name === undefined) {
    return undefined
  }

  return {
    id,
    name,
    age: meta.a[index] ?? null,
    place: meta.p[index] ?? null,
    dateFormatted: meta.d[index] ?? null,
    image,
  }
}

/**
 * Finds a slim portrait by image path (linear scan; prefer index lookup).
 */
export const getFallenPortraitByImage = (
  image: string
): FallenPortrait | undefined => {
  const index = FALLEN_PORTRAIT_IMAGES.indexOf(image)
  if (index < 0) {
    return undefined
  }
  return getFallenPortraitByIndex(index)
}
