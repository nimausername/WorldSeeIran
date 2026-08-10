import fallenNames from "@/data/fallen-names.json"

/**
 * Persian names of every memorial person in the system, in source order.
 * Kept as a slim string list so the layout shell never loads the full people dump.
 */
export const FALLEN_NAMES: readonly string[] = fallenNames as readonly string[]
