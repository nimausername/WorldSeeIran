"use client"

import dynamic from "next/dynamic"

import type { JavidnamDetailCopy } from "@/components/fallen/javidnam-detail"

type JavidnamFieldLoaderProps = {
  readonly label: string
  readonly lead: string
  readonly peopleCountLabel: string
  readonly lastUpdatedLabel: string
  readonly detailCopy: JavidnamDetailCopy
}

const JavidnamField = dynamic(
  () =>
    import("@/components/fallen/javidnam-field").then(
      (module) => module.JavidnamField
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full bg-background"
        aria-busy="true"
        aria-live="polite"
      />
    ),
  }
)

/**
 * Client-only loader that code-splits the canvas field (images first, meta deferred).
 */
export const JavidnamFieldLoader = (props: JavidnamFieldLoaderProps) => {
  return <JavidnamField {...props} />
}
