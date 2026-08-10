import javidnamanBundle from "@/data/javidnaman-iranintl.json"

import type { FallenPeopleBundle, FallenPerson } from "@/lib/fallen/types"

const bundle = javidnamanBundle as FallenPeopleBundle

/**
 * Full memorial list imported from https://javidnaman.iranintl.com/memorial.
 *
 * Heavy payload. Prefer `portrait-images` / `portrait-meta` / `fallen-names` on
 * the client. Keep this module for server-side or tooling use.
 */
export const FALLEN_PEOPLE: readonly FallenPerson[] = bundle.people

/**
 * Metadata for the imported memorial bundle.
 */
export const FALLEN_PEOPLE_META = {
  source: bundle.source,
  fetchedAt: bundle.fetchedAt,
  count: bundle.count,
  withImages: bundle.withImages,
} as const

/**
 * Returns every memorial person that has a local portrait image.
 */
export const getFallenPeopleWithImages = (): readonly FallenPerson[] =>
  FALLEN_PEOPLE.filter((person) => Boolean(person.image))

/**
 * Finds a memorial person by source id.
 */
export const getFallenPersonById = (id: string): FallenPerson | undefined =>
  FALLEN_PEOPLE.find((person) => person.id === id)

/**
 * Portrait paths for people in the Iran International import.
 */
export const getFallenPortraitPaths = (): readonly string[] =>
  FALLEN_PEOPLE.flatMap((person) => (person.image ? [person.image] : []))
