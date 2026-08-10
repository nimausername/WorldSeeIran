"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"

import { FALLEN_NAMES } from "@/lib/fallen/names"
import { cn } from "@/lib/utils"

const CELL_WIDTH_PX = 118
const CELL_HEIGHT_PX = 22
const REFRESH_MS = 7000
const FADE_MS = 700

type NamesBackgroundProps = {
  /** Extra classes for the root layer. */
  readonly className?: string
}

type GridSize = {
  readonly cols: number
  readonly rows: number
}

/**
 * Returns whether the user prefers reduced motion.
 */
const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setReduced(query.matches)
    }
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reduced
}

/**
 * Measures how many name cells fit in the current viewport.
 */
const measureGrid = (width: number, height: number): GridSize => {
  const cols = Math.max(1, Math.floor(width / CELL_WIDTH_PX))
  const rows = Math.max(1, Math.floor(height / CELL_HEIGHT_PX))
  return { cols, rows }
}

/**
 * Returns the name slice for a page index, wrapping through the full list.
 */
const getPageNames = (
  names: readonly string[],
  page: number,
  pageSize: number
): readonly string[] => {
  if (names.length === 0 || pageSize <= 0) {
    return []
  }

  const start = (page * pageSize) % names.length
  const slice: string[] = []

  for (let index = 0; index < pageSize; index += 1) {
    slice.push(names[(start + index) % names.length]!)
  }

  return slice
}

/**
 * Full-bleed memorial name field. Shows a dense grid of small names and
 * periodically refreshes so every name in the system appears over time.
 */
export const NamesBackground = ({ className }: NamesBackgroundProps) => {
  const pathname = usePathname()
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [grid, setGrid] = useState<GridSize>({ cols: 1, rows: 1 })
  const [page, setPage] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const hideOnJavidnam = pathname.includes("/javidnam")
  const names = FALLEN_NAMES

  useEffect(() => {
    const node = rootRef.current
    if (!node || hideOnJavidnam) {
      return
    }

    const update = () => {
      const rect = node.getBoundingClientRect()
      setGrid(measureGrid(rect.width, rect.height))
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [hideOnJavidnam])

  const pageSize = grid.cols * grid.rows
  const pageCount = Math.max(1, Math.ceil(names.length / Math.max(pageSize, 1)))

  useEffect(() => {
    if (
      hideOnJavidnam ||
      reducedMotion ||
      names.length === 0 ||
      pageCount <= 1
    ) {
      return
    }

    let fadeTimer: number | undefined

    const refreshTimer = window.setInterval(() => {
      setOpacity(0)
      fadeTimer = window.setTimeout(() => {
        setPage((currentPage) => (currentPage + 1) % pageCount)
        setOpacity(1)
      }, FADE_MS)
    }, REFRESH_MS)

    return () => {
      window.clearInterval(refreshTimer)
      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer)
      }
    }
  }, [hideOnJavidnam, names.length, pageCount, reducedMotion])

  if (hideOnJavidnam || names.length === 0) {
    return null
  }

  const visibleNames = getPageNames(names, page, pageSize)

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 overflow-hidden select-none",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.26]"
        style={{
          maskImage:
            "radial-gradient(ellipse 68% 62% at 50% 42%, transparent 8%, black 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 68% 62% at 50% 42%, transparent 8%, black 78%)",
        }}
      >
        <NameGrid
          names={visibleNames}
          cols={grid.cols}
          style={{
            opacity,
            transitionProperty: "opacity",
            transitionDuration: `${FADE_MS}ms`,
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  )
}

type NameGridProps = {
  readonly names: readonly string[]
  readonly cols: number
  readonly style?: CSSProperties
}

/**
 * Dense RTL name grid for one background page.
 */
const NameGrid = ({ names, cols, style }: NameGridProps) => {
  return (
    <div
      dir="rtl"
      lang="fa"
      className="absolute inset-0 grid [font-family:var(--font-fa)]"
      style={{
        ...style,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `${CELL_HEIGHT_PX}px`,
      }}
    >
      {names.map((name, index) => (
        <span
          key={`${index}-${name}`}
          className="truncate px-1.5 text-[10px] leading-[22px] text-foreground/85 sm:text-[11px]"
        >
          {name}
        </span>
      ))}
    </div>
  )
}
