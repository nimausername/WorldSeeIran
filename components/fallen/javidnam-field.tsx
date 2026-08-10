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
  /** Localized labels for the detail panel. */
  readonly detailCopy: JavidnamDetailCopy
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
 * Full-screen memorial portrait field backed by the pooled infinite canvas.
 * Ships compact image ids first; person meta is deferred until idle / click.
 */
export const JavidnamField = ({
  label,
  lead,
  detailCopy,
}: JavidnamFieldProps) => {
  const [selected, setSelected] = useState<FallenPortrait | null>(null)
  const clickInFlightRef = useRef(false)

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
    <section className="relative h-full w-full bg-black" aria-label={label}>
      <h1 className="sr-only">{label}</h1>
      <p className="sr-only">{lead}</p>

      <InfiniteImageField
        images={FALLEN_PORTRAIT_IMAGES}
        className="absolute inset-0"
        imageWidth={148}
        imageHeight={186}
        gap={16}
        maxSpeed={4.2}
        idleSpeed={0.24}
        cacheSize={96}
        maxConcurrentLoads={6}
        borderRadius={0}
        paused={selected !== null}
        onImageClick={handleImageClick}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/55 via-black/15 to-transparent px-4 pt-6 pb-16 sm:px-6">
        <p className="text-sm font-medium tracking-wide text-white/80">
          {label}
        </p>
        <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/55 sm:text-sm">
          {lead}
        </p>
      </div>

      <JavidnamDetail
        person={selected}
        open={selected !== null}
        copy={detailCopy}
        onOpenChange={handleOpenChange}
      />
    </section>
  )
}
