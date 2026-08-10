"use client"

import { useEffect, useRef, useState } from "react"

import {
  JavidnamDetail,
  type JavidnamDetailCopy,
} from "@/components/fallen/javidnam-detail"
import { InfiniteImageField } from "@/components/ui/infinite-image-field"
import { FALLEN_PORTRAIT_IMAGES } from "@/lib/fallen/portrait-images"
import type { FallenPortrait } from "@/lib/fallen/portrait-types"

type JavidnamFieldProps = {
  /** Accessible page label announced to screen readers. */
  readonly label: string
  /** Short supporting line shown over the field. */
  readonly lead: string
  /** Localized memorial headcount line. */
  readonly peopleCountLabel: string
  /** Localized last-updated line. */
  readonly lastUpdatedLabel: string
  /** Localized labels for the detail panel. */
  readonly detailCopy: JavidnamDetailCopy
}

type FieldLayout = {
  readonly imageWidth: number
  readonly imageHeight: number
  readonly gap: number
  readonly maxSpeed: number
  readonly idleSpeed: number
  readonly maxConcurrentLoads: number
}

const DESKTOP_LAYOUT: FieldLayout = {
  imageWidth: 148,
  imageHeight: 186,
  gap: 16,
  maxSpeed: 4.2,
  idleSpeed: 0.24,
  maxConcurrentLoads: 6,
}

const MOBILE_LAYOUT: FieldLayout = {
  imageWidth: 110,
  imageHeight: 138,
  gap: 12,
  maxSpeed: 2.4,
  idleSpeed: 0.16,
  maxConcurrentLoads: 4,
}

type PortraitMetaModule = typeof import("@/lib/fallen/portrait-meta")

let portraitMetaPromise: Promise<PortraitMetaModule> | null = null

const loadPortraitMeta = (): Promise<PortraitMetaModule> => {
  if (!portraitMetaPromise) {
    portraitMetaPromise = import("@/lib/fallen/portrait-meta")
  }
  return portraitMetaPromise
}

/**
 * Picks denser, slower field metrics on narrow or coarse-pointer viewports.
 */
const useFieldLayout = (): FieldLayout => {
  const [layout, setLayout] = useState<FieldLayout>(DESKTOP_LAYOUT)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px), (pointer: coarse)")
    const update = () => {
      setLayout(query.matches ? MOBILE_LAYOUT : DESKTOP_LAYOUT)
    }
    update()
    query.addEventListener("change", update)
    return () => {
      query.removeEventListener("change", update)
    }
  }, [])

  return layout
}

/**
 * Full-screen memorial portrait field backed by the pooled infinite canvas.
 * Ships compact image ids first; person meta is deferred until idle / click.
 */
export const JavidnamField = ({
  label,
  lead,
  peopleCountLabel,
  lastUpdatedLabel,
  detailCopy,
}: JavidnamFieldProps) => {
  const [selected, setSelected] = useState<FallenPortrait | null>(null)
  const clickInFlightRef = useRef(false)
  const layout = useFieldLayout()

  useEffect(() => {
    const prefetch = () => {
      void loadPortraitMeta()
    }

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(prefetch, { timeout: 2500 })
      return () => {
        window.cancelIdleCallback(idleId)
      }
    }

    const timeoutId = window.setTimeout(prefetch, 1200)
    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  const handleImageClick = ({ index }: { index: number; src: string }) => {
    if (clickInFlightRef.current) {
      return
    }

    clickInFlightRef.current = true

    void loadPortraitMeta()
      .then((module) => {
        const person = module.getFallenPortraitByIndex(index)
        if (!person) {
          return
        }
        setSelected(person)
      })
      .finally(() => {
        clickInFlightRef.current = false
      })
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelected(null)
    }
  }

  return (
    <section className="relative h-full w-full bg-background" aria-label={label}>
      <InfiniteImageField
        images={FALLEN_PORTRAIT_IMAGES}
        className="absolute inset-0"
        imageWidth={layout.imageWidth}
        imageHeight={layout.imageHeight}
        gap={layout.gap}
        maxSpeed={layout.maxSpeed}
        idleSpeed={layout.idleSpeed}
        cacheSize={96}
        maxConcurrentLoads={layout.maxConcurrentLoads}
        borderRadius={0}
        paused={selected !== null}
        onImageClick={handleImageClick}
      />

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-background/90 via-background/45 to-transparent px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-24 sm:px-8 sm:pb-28 sm:pt-[max(1.75rem,env(safe-area-inset-top))]">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {label}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {lead}
          </p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium tabular-nums text-foreground/90">
              {peopleCountLabel}
            </span>
            <span className="hidden text-border sm:inline" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{lastUpdatedLabel}</span>
          </p>
        </div>
      </header>

      <JavidnamDetail
        person={selected}
        open={selected !== null}
        copy={detailCopy}
        onOpenChange={handleOpenChange}
      />
    </section>
  )
}
