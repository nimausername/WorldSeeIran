import imagesCompact from "@/data/fallen-portrait-images.json"

import type { FallenPortraitImagesCompact } from "@/lib/fallen/portrait-types"

const compact = imagesCompact as FallenPortraitImagesCompact

const pngIndex = new Set(compact.pngs)

/**
 * Public CDN / Garage website origin for portrait files.
 * Empty = serve from this app (`/fallen/iranintl/...`).
 */
const fallenAssetBase = (
  process.env.NEXT_PUBLIC_FALLEN_ASSET_BASE ?? ""
).replace(/\/$/, "")

/**
 * Builds the public URL for a portrait object under `iranintl/`.
 */
const getFallenPortraitUrl = (id: string, extension: "jpg" | "png") => {
  const path = `/iranintl/${id}.${extension}`

  if (!fallenAssetBase) {
    return `/fallen${path}`
  }

  return `${fallenAssetBase}${path}`
}

/**
 * Portrait ids in stable field order.
 */
export const FALLEN_PORTRAIT_IDS: readonly string[] = compact.ids

/**
 * Portrait image URLs expanded from the compact id + extension index.
 * ~81 KB on disk (vs ~140 KB of full path strings).
 */
export const FALLEN_PORTRAIT_IMAGES: readonly string[] = compact.ids.map(
  (id, index) =>
    getFallenPortraitUrl(id, pngIndex.has(index) ? "png" : "jpg")
)
