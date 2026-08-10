import fallenManifest from "@/public/fallen/manifest.json"

/**
 * All fallen portraits used by the memorial infinite background field.
 * Includes legacy portraits and Iran International (javidnaman) imports.
 */
export const FALLEN_BACKGROUND_IMAGES = fallenManifest.images as readonly string[]

export type FallenBackgroundImage = (typeof FALLEN_BACKGROUND_IMAGES)[number]
