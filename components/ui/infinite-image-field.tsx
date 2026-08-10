"use client"

import { useEffect, useRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const INFINITE_IMAGE_FIELD_IMAGES: string[] = [
  "https://plus.unsplash.com/premium_photo-1665311515452-a9f54c4266c9?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=560&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=560&fit=crop&q=80",
]

export type InfiniteImageFieldProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  className?: string
  images?: readonly string[]
  imageWidth?: number
  imageHeight?: number
  gap?: number
  maxSpeed?: number
  smoothing?: number
  borderRadius?: number
  /** Soft idle drift when the pointer is outside the field. */
  idleSpeed?: number
  /** Max decoded portraits kept in memory. */
  cacheSize?: number
  /** Max simultaneous image downloads. */
  maxConcurrentLoads?: number
  /** Freeze camera motion while a detail view is open. */
  paused?: boolean
  /** Fires when a portrait cell is clicked (not dragged). */
  onImageClick?: (payload: {
    readonly index: number
    readonly src: string
  }) => void
}

type PoolOptions = {
  readonly maxEntries: number
  readonly maxConcurrent: number
  readonly decodeWidth: number
}

type PoolEntry = HTMLImageElement | ImageBitmap

/**
 * Bounded image pool: only visible (and recently visible) portraits stay decoded.
 * Visible sources are pinned so they are never evicted mid-frame.
 * Decoded bitmaps are resized to display size to keep GPU/memory light.
 */
class ImagePool {
  private readonly cache = new Map<string, PoolEntry>()
  private readonly inflight = new Map<string, AbortController>()
  private readonly queue: string[] = []
  private readonly recentlyUsed: string[] = []
  private pinned = new Set<string>()
  private activeLoads = 0
  private disposed = false
  private onIdle: (() => void) | null = null

  constructor(private readonly options: PoolOptions) {}

  /**
   * Registers a callback fired when the pool has no pending work.
   */
  setIdleListener(listener: (() => void) | null): void {
    this.onIdle = listener
  }

  /**
   * Whether the pool still has queued or in-flight work.
   */
  isBusy(): boolean {
    return this.activeLoads > 0 || this.queue.length > 0
  }

  /**
   * Returns a ready image when present without mutating LRU order.
   */
  peek(src: string): PoolEntry | null {
    return this.cache.get(src) ?? null
  }

  /**
   * Pins the current visible set, prefers them in LRU, and queues missing loads.
   */
  syncVisible(sources: readonly string[]): void {
    this.pinned = new Set(sources)
    for (const src of this.pinned) {
      this.touch(src)
      this.request(src, true)
    }
    this.evictIfNeeded()
  }

  /**
   * Requests a source for loading without blocking the render loop.
   */
  request(src: string, prioritized = false): void {
    if (this.disposed || this.cache.has(src) || this.inflight.has(src)) {
      return
    }
    const existing = this.queue.indexOf(src)
    if (existing >= 0) {
      if (prioritized && existing > 0) {
        this.queue.splice(existing, 1)
        this.queue.unshift(src)
      }
      this.pump()
      return
    }
    if (prioritized) {
      this.queue.unshift(src)
    } else {
      this.queue.push(src)
    }
    this.pump()
  }

  /**
   * Releases all images and cancels pending work.
   */
  dispose(): void {
    this.disposed = true
    this.queue.length = 0
    for (const controller of this.inflight.values()) {
      controller.abort()
    }
    this.inflight.clear()
    for (const entry of this.cache.values()) {
      if (typeof ImageBitmap !== "undefined" && entry instanceof ImageBitmap) {
        entry.close()
      }
    }
    this.cache.clear()
    this.recentlyUsed.length = 0
    this.pinned.clear()
    this.onIdle = null
  }

  private touch(src: string): void {
    const index = this.recentlyUsed.indexOf(src)
    if (index >= 0) {
      this.recentlyUsed.splice(index, 1)
    }
    this.recentlyUsed.push(src)
  }

  private capacity(): number {
    return Math.max(this.options.maxEntries, this.pinned.size + 24)
  }

  private pump(): void {
    while (
      this.activeLoads < this.options.maxConcurrent &&
      this.queue.length > 0 &&
      !this.disposed
    ) {
      const src = this.queue.shift()
      if (!src || this.cache.has(src) || this.inflight.has(src)) {
        continue
      }
      this.load(src)
    }
    if (!this.isBusy()) {
      this.onIdle?.()
    }
  }

  private load(src: string): void {
    const controller = new AbortController()
    this.inflight.set(src, controller)
    this.activeLoads += 1

    const finish = () => {
      this.inflight.delete(src)
      this.activeLoads = Math.max(0, this.activeLoads - 1)
      this.pump()
    }

    const image = new Image()
    image.decoding = "async"
    image.onload = () => {
      if (this.disposed || controller.signal.aborted) {
        finish()
        return
      }

      this.evictIfNeeded()
      this.cache.set(src, image)
      this.touch(src)
      finish()

      if (typeof createImageBitmap !== "function") {
        return
      }

      createImageBitmap(image, {
        resizeWidth: this.options.decodeWidth,
        resizeQuality: "low",
      })
        .then((bitmap) => {
          if (this.disposed || !this.cache.has(src)) {
            bitmap.close()
            return
          }
          const previous = this.cache.get(src)
          this.cache.set(src, bitmap)
          if (
            previous &&
            typeof ImageBitmap !== "undefined" &&
            previous instanceof ImageBitmap &&
            previous !== bitmap
          ) {
            previous.close()
          }
        })
        .catch(() => {
          // Keep the HTMLImageElement fallback already in cache.
        })
    }
    image.onerror = () => {
      finish()
    }

    if (/^https?:\/\//i.test(src)) {
      image.crossOrigin = "anonymous"
    }
    image.src = src
  }

  private evictIfNeeded(): void {
    const capacity = this.capacity()
    if (this.cache.size < capacity) {
      return
    }

    const evictable = this.recentlyUsed.filter(
      (src) => !this.pinned.has(src) && this.cache.has(src)
    )

    while (this.cache.size >= capacity && evictable.length > 0) {
      const oldest = evictable.shift()
      if (!oldest) {
        break
      }
      const index = this.recentlyUsed.indexOf(oldest)
      if (index >= 0) {
        this.recentlyUsed.splice(index, 1)
      }
      const entry = this.cache.get(oldest)
      this.cache.delete(oldest)
      if (
        entry &&
        typeof ImageBitmap !== "undefined" &&
        entry instanceof ImageBitmap
      ) {
        entry.close()
      }
    }
  }
}

/**
 * Draws a rounded rectangle path.
 */
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const clampedR = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + clampedR, y)
  ctx.lineTo(x + w - clampedR, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + clampedR)
  ctx.lineTo(x + w, y + h - clampedR)
  ctx.quadraticCurveTo(x + w, y + h, x + w - clampedR, y + h)
  ctx.lineTo(x + clampedR, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - clampedR)
  ctx.lineTo(x, y + clampedR)
  ctx.quadraticCurveTo(x, y, x + clampedR, y)
  ctx.closePath()
}

/**
 * Deterministic image index for a grid cell.
 */
const cellImageIndex = (col: number, row: number, count: number): number => {
  if (count <= 0) {
    return 0
  }
  const value = Math.abs(col * 73856093 + row * 19349663 + col * row * 83492791)
  return value % count
}

/**
 * Resolves which portrait cell contains a canvas-local point.
 */
const hitTestImage = (args: {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly camX: number
  readonly camY: number
  readonly imageWidth: number
  readonly imageHeight: number
  readonly gap: number
  readonly count: number
}): { readonly col: number; readonly row: number; readonly index: number } | null => {
  const {
    x,
    y,
    width,
    height,
    camX,
    camY,
    imageWidth,
    imageHeight,
    gap,
    count,
  } = args

  if (count <= 0) {
    return null
  }

  const cellW = imageWidth + gap
  const cellH = imageHeight + gap
  const originX = -camX + width / 2 - imageWidth / 2
  const originY = -camY + height / 2 - imageHeight / 2
  const col = Math.floor((x - originX) / cellW)
  const row = Math.floor((y - originY) / cellH)
  const sx = col * cellW + originX
  const sy = row * cellH + originY

  if (x < sx || x >= sx + imageWidth || y < sy || y >= sy + imageHeight) {
    return null
  }

  return {
    col,
    row,
    index: cellImageIndex(col, row, count),
  }
}

/**
 * Infinite canvas portrait field with an LRU decode pool so thousands of
 * sources stay scrollable without loading everything into memory.
 */
export const InfiniteImageField = ({
  className,
  images = INFINITE_IMAGE_FIELD_IMAGES,
  imageWidth = 160,
  imageHeight = 200,
  gap = 18,
  maxSpeed = 4.5,
  smoothing = 0.08,
  borderRadius = 0,
  idleSpeed = 0.28,
  cacheSize = 160,
  maxConcurrentLoads = 10,
  paused = false,
  onImageClick,
  ...rest
}: InfiniteImageFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dimsRef = useRef({ w: 0, h: 0 })
  const camRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false })
  const pointerDownRef = useRef<{
    x: number
    y: number
    canvasX: number
    canvasY: number
  } | null>(null)
  const rafRef = useRef(0)
  const resumeLoopRef = useRef<() => void>(() => {})
  const imagesRef = useRef(images)
  const pausedRef = useRef(paused)
  const onImageClickRef = useRef(onImageClick)
  const settingsRef = useRef({
    imageWidth,
    imageHeight,
    gap,
    maxSpeed,
    smoothing,
    borderRadius,
    idleSpeed,
  })

  useEffect(() => {
    imagesRef.current = images
    pausedRef.current = paused
    onImageClickRef.current = onImageClick
    settingsRef.current = {
      imageWidth,
      imageHeight,
      gap,
      maxSpeed,
      smoothing,
      borderRadius,
      idleSpeed,
    }
  }, [
    images,
    imageWidth,
    imageHeight,
    gap,
    maxSpeed,
    smoothing,
    borderRadius,
    idleSpeed,
    paused,
    onImageClick,
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const hardwareBudget =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4
    const concurrent = Math.max(
      3,
      Math.min(maxConcurrentLoads, hardwareBudget <= 4 ? 4 : maxConcurrentLoads)
    )

    const pool = new ImagePool({
      maxEntries: cacheSize,
      maxConcurrent: concurrent,
      decodeWidth: Math.max(96, Math.round(imageWidth * Math.min(window.devicePixelRatio || 1, 1.5))),
    })

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const start = performance.now()
    let running = false
    let hidden = document.visibilityState === "hidden"

    const isDrawable = (image: PoolEntry | null): image is PoolEntry => {
      if (!image) {
        return false
      }
      if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
        return image.width > 0 && image.height > 0
      }
      const htmlImage = image as HTMLImageElement
      return htmlImage.complete && htmlImage.naturalWidth > 0
    }

    const schedule = () => {
      if (running || hidden) {
        return
      }
      running = true
      rafRef.current = requestAnimationFrame(draw)
    }
    resumeLoopRef.current = schedule

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const nextW = Math.max(1, Math.floor(rect.width * dpr))
      const nextH = Math.max(1, Math.floor(rect.height * dpr))
      dimsRef.current = { w: rect.width, h: rect.height }
      if (canvas.width === nextW && canvas.height === nextH) {
        return
      }
      canvas.width = nextW
      canvas.height = nextH
      schedule()
    }

    const toCanvasPoint = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        return null
      }
      return {
        normX: (event.clientX - rect.left) / rect.width,
        normY: (event.clientY - rect.top) / rect.height,
        canvasX: event.clientX - rect.left,
        canvasY: event.clientY - rect.top,
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (pausedRef.current) {
        return
      }
      const point = toCanvasPoint(event)
      if (!point) {
        return
      }
      pointerRef.current = {
        x: point.normX,
        y: point.normY,
        active: true,
      }
      schedule()
    }

    const onPointerEnter = (event: PointerEvent) => {
      onPointerMove(event)
    }

    const onPointerLeave = () => {
      pointerRef.current = { ...pointerRef.current, active: false }
      pointerDownRef.current = null
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return
      }
      const point = toCanvasPoint(event)
      if (!point) {
        return
      }
      pointerDownRef.current = {
        x: event.clientX,
        y: event.clientY,
        canvasX: point.canvasX,
        canvasY: point.canvasY,
      }
      if (!pausedRef.current) {
        pointerRef.current = {
          x: point.normX,
          y: point.normY,
          active: true,
        }
        schedule()
      }
    }

    const onPointerUp = (event: PointerEvent) => {
      const down = pointerDownRef.current
      pointerDownRef.current = null
      if (!down || event.button !== 0) {
        return
      }

      const dx = event.clientX - down.x
      const dy = event.clientY - down.y
      if (dx * dx + dy * dy > 36) {
        return
      }

      const settings = settingsRef.current
      const sources = imagesRef.current
      const { w: width, h: height } = dimsRef.current
      const hit = hitTestImage({
        x: down.canvasX,
        y: down.canvasY,
        width,
        height,
        camX: camRef.current.x,
        camY: camRef.current.y,
        imageWidth: settings.imageWidth,
        imageHeight: settings.imageHeight,
        gap: settings.gap,
        count: sources.length,
      })

      if (!hit) {
        return
      }

      const src = sources[hit.index]
      if (!src) {
        return
      }

      onImageClickRef.current?.({ index: hit.index, src })
    }

    const onVisibility = () => {
      hidden = document.visibilityState === "hidden"
      if (!hidden) {
        schedule()
      }
    }

    const draw = (now: number) => {
      running = false
      if (hidden) {
        return
      }

      const ctx = canvas.getContext("2d", { alpha: false })
      if (!ctx) {
        schedule()
        return
      }

      const { w: width, h: height } = dimsRef.current
      if (width === 0 || height === 0) {
        schedule()
        return
      }

      const settings = settingsRef.current
      const sources = imagesRef.current
      const count = sources.length
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cellW = settings.imageWidth + settings.gap
      const cellH = settings.imageHeight + settings.gap
      const elapsed = now - start
      const isPaused = pausedRef.current

      if (!isPaused) {
        let targetX = 0
        let targetY = 0
        if (pointerRef.current.active) {
          targetX = (pointerRef.current.x - 0.5) * 2 * settings.maxSpeed
          targetY = (pointerRef.current.y - 0.5) * 2 * settings.maxSpeed
        } else if (!reduceMotion.matches && settings.idleSpeed > 0) {
          targetX = Math.cos(elapsed * 0.00021) * settings.idleSpeed
          targetY = Math.sin(elapsed * 0.00017) * settings.idleSpeed * 0.85
        }

        velRef.current.x += (targetX - velRef.current.x) * settings.smoothing
        velRef.current.y += (targetY - velRef.current.y) * settings.smoothing
        camRef.current.x += velRef.current.x
        camRef.current.y += velRef.current.y
      } else {
        velRef.current.x = 0
        velRef.current.y = 0
      }

      const camX = camRef.current.x
      const camY = camRef.current.y

      ctx.fillStyle = "oklch(0.145 0 0)"
      ctx.fillRect(0, 0, width, height)

      if (count === 0) {
        if (!isPaused) {
          schedule()
        }
        return
      }

      const colMin = Math.floor((camX - width / 2) / cellW) - 1
      const colMax = Math.ceil((camX + width / 2) / cellW) + 1
      const rowMin = Math.floor((camY - height / 2) / cellH) - 1
      const rowMax = Math.ceil((camY + height / 2) / cellH) + 1

      const needed: string[] = []
      const seen = new Set<string>()
      for (let row = rowMin; row <= rowMax; row += 1) {
        for (let col = colMin; col <= colMax; col += 1) {
          const src = sources[cellImageIndex(col, row, count)]
          if (!src || seen.has(src)) {
            continue
          }
          seen.add(src)
          needed.push(src)
        }
      }
      pool.syncVisible(needed)

      for (let row = rowMin; row <= rowMax; row += 1) {
        for (let col = colMin; col <= colMax; col += 1) {
          const sx = col * cellW - camX + width / 2 - settings.imageWidth / 2
          const sy = row * cellH - camY + height / 2 - settings.imageHeight / 2
          const src = sources[cellImageIndex(col, row, count)]
          const image = src ? pool.peek(src) : null

          ctx.save()
          drawRoundedRect(
            ctx,
            sx,
            sy,
            settings.imageWidth,
            settings.imageHeight,
            settings.borderRadius
          )
          ctx.clip()

          if (isDrawable(image)) {
            ctx.drawImage(
              image,
              sx,
              sy,
              settings.imageWidth,
              settings.imageHeight
            )
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.06)"
            ctx.fillRect(sx, sy, settings.imageWidth, settings.imageHeight)
          }
          ctx.restore()

          ctx.save()
          drawRoundedRect(
            ctx,
            sx,
            sy,
            settings.imageWidth,
            settings.imageHeight,
            settings.borderRadius
          )
          ctx.strokeStyle = "rgba(255,255,255,0.08)"
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.restore()
        }
      }

      // Keep animating while moving; when paused only continue if images are still loading.
      if (!isPaused || pool.isBusy()) {
        schedule()
      }
    }

    pool.setIdleListener(() => {
      if (pausedRef.current) {
        schedule()
      }
    })

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerenter", onPointerEnter)
    canvas.addEventListener("pointerleave", onPointerLeave)
    canvas.addEventListener("pointerdown", onPointerDown)
    canvas.addEventListener("pointerup", onPointerUp)
    document.addEventListener("visibilitychange", onVisibility)

    schedule()

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerenter", onPointerEnter)
      canvas.removeEventListener("pointerleave", onPointerLeave)
      canvas.removeEventListener("pointerdown", onPointerDown)
      canvas.removeEventListener("pointerup", onPointerUp)
      document.removeEventListener("visibilitychange", onVisibility)
      pool.dispose()
    }
  }, [cacheSize, imageWidth, maxConcurrentLoads])

  useEffect(() => {
    if (!paused) {
      resumeLoopRef.current()
    }
  }, [paused])

  return (
    <div
      {...rest}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          "block h-full w-full touch-none bg-transparent",
          paused ? "cursor-default" : "cursor-pointer"
        )}
        role="presentation"
      />
    </div>
  )
}
