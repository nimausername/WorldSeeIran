import oppressorsBundle from "@/data/oppressors.json"

import { getOppressorImageUrl } from "@/lib/oppressors/images"
import type {
  OppressorPerson,
  OppressorRecord,
  OppressorsBundle,
} from "@/lib/oppressors/types"

const bundle = oppressorsBundle as OppressorsBundle

/**
 * Dataset metadata for SEO and page stats.
 */
export const OPPRESSORS_META = bundle.meta

/**
 * Published oppressors from the migrated backup records.
 */
export const OPPRESSORS: readonly OppressorPerson[] = bundle.people

/**
 * Builds oppressor records with resolved portrait URLs.
 */
export const getOppressorRecords = (): readonly OppressorRecord[] =>
  OPPRESSORS.map((person) => ({
    ...person,
    image: getOppressorImageUrl(person.imageFile, OPPRESSORS_META.updatedAt),
  }))
