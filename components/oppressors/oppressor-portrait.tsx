"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type OppressorPortraitProps = {
  readonly src: string | null
  readonly name: string
  readonly className?: string
  readonly imgClassName?: string
}

/**
 * Portrait with muted initials fallback when the image is missing or fails.
 */
export const OppressorPortrait = ({
  src,
  name,
  className,
  imgClassName,
}: OppressorPortraitProps) => {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-muted text-muted-foreground",
        className
      )}
      aria-hidden={showImage ? undefined : true}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- Garage / local portrait asset
        <img
          key={src ?? "missing"}
          src={src!}
          alt={name}
          className={cn("size-full object-cover", imgClassName)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="px-2 text-center text-[0.65rem] font-medium leading-tight sm:text-xs">
          {initials || name}
        </span>
      )}
    </div>
  )
}
