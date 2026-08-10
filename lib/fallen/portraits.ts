import {
  FALLEN_PORTRAIT_IDS,
  FALLEN_PORTRAIT_IMAGES,
} from "@/lib/fallen/portrait-images"
import {
  getFallenPortraitByImage,
  getFallenPortraitByIndex,
} from "@/lib/fallen/portrait-meta"
import type { FallenPortrait } from "@/lib/fallen/portrait-types"

export { FALLEN_PORTRAIT_IDS, FALLEN_PORTRAIT_IMAGES }
export { getFallenPortraitByImage, getFallenPortraitByIndex }

/**
 * Eager list of slim portraits. Prefer {@link getFallenPortraitByIndex} via
 * dynamic import so the javidnam field does not pay meta cost on first paint.
 */
export const FALLEN_PORTRAITS: readonly FallenPortrait[] =
  FALLEN_PORTRAIT_IDS.map((_, index) => getFallenPortraitByIndex(index)!)
