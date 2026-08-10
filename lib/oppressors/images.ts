/**
 * Public CDN / Garage website origin for asset files.
 * Empty = serve from this app (`/oppressors/...`).
 */
const assetBase = (process.env.NEXT_PUBLIC_FALLEN_ASSET_BASE ?? "").replace(
  /\/$/,
  ""
)

/**
 * Builds the public URL for an oppressor portrait under `oppressors/`.
 * Returns null when no image file is recorded yet.
 *
 * Appends a dataset version query so Cloudflare does not keep serving a
 * cached 404 from before a newly uploaded object existed.
 */
export const getOppressorImageUrl = (
  imageFile: string | null | undefined,
  version = ""
): string | null => {
  if (!imageFile) {
    return null
  }

  const path = `/oppressors/${imageFile}`
  const basePath = assetBase ? `${assetBase}${path}` : path

  if (!version) {
    return basePath
  }

  return `${basePath}?v=${encodeURIComponent(version)}`
}
