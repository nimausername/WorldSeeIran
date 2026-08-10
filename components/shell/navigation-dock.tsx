"use client"

import { HomeIcon, ScaleIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Dock, DockItem, DockSeparator } from "@/components/motion/dock"
import {
  THEME_TOGGLE_CIRCLE,
  ThemeToggle,
} from "@/components/motion/theme-toggle"
import { LanguageSwitcher } from "@/components/shell/language-switcher"
import type { Locale } from "@/lib/i18n/config"

type NavigationDockProps = {
  readonly locale: Locale
  readonly homeLabel: string
  readonly languageLabel: string
  readonly javidnamLabel: string
  readonly oppressorsLabel: string
  readonly themeToLightLabel: string
  readonly themeToDarkLabel: string
}

const MOBILE_DOCK_SIZE = 34
const DESKTOP_DOCK_SIZE = 36

/**
 * Uses a compact dock on narrow viewports, full size on larger screens.
 */
const useDockSize = () => {
  const [size, setSize] = useState(MOBILE_DOCK_SIZE)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)")
    const update = () => {
      setSize(query.matches ? MOBILE_DOCK_SIZE : DESKTOP_DOCK_SIZE)
    }
    update()
    query.addEventListener("change", update)
    return () => {
      query.removeEventListener("change", update)
    }
  }, [])

  return size
}

/**
 * Site menu dock: home, javidnam, oppressors, theme, and language menu.
 */
export const NavigationDock = ({
  locale,
  homeLabel,
  languageLabel,
  javidnamLabel,
  oppressorsLabel,
  themeToLightLabel,
  themeToDarkLabel,
}: NavigationDockProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dockSize = useDockSize()
  const isCompact = dockSize <= MOBILE_DOCK_SIZE
  const view = searchParams.get("view")
  const isHomeRoute =
    pathname === `/${locale}` || pathname === `/${locale}/`
  const isJavidnamRoute = pathname === `/${locale}/javidnam`
  const isOppressorsRoute = pathname === `/${locale}/oppressors`
  const iconClassName = isCompact ? "size-3.5" : "size-4"

  return (
    <nav
      className="absolute end-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 rtl:end-[max(1rem,env(safe-area-inset-left))]"
      aria-label={homeLabel}
    >
      <Dock
        size={dockSize}
        className="gap-0.5 rounded-lg px-1 py-0.5 shadow-lg"
      >
        <DockItem active={isHomeRoute && view !== "content"}>
          <Link
            href={`/${locale}`}
            aria-label={homeLabel}
            tabIndex={0}
            className="flex size-full items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <HomeIcon className={iconClassName} aria-hidden="true" />
          </Link>
        </DockItem>

        <DockItem active={isJavidnamRoute}>
          <Link
            href={`/${locale}/javidnam`}
            aria-label={javidnamLabel}
            tabIndex={0}
            className="flex size-full items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <UsersIcon className={iconClassName} aria-hidden="true" />
          </Link>
        </DockItem>

        <DockItem active={isOppressorsRoute}>
          <Link
            href={`/${locale}/oppressors`}
            aria-label={oppressorsLabel}
            tabIndex={0}
            className="flex size-full items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ScaleIcon className={iconClassName} aria-hidden="true" />
          </Link>
        </DockItem>

        <DockSeparator className={isCompact ? "h-4" : "h-5"} />

        <DockItem>
          <ThemeToggle
            {...THEME_TOGGLE_CIRCLE}
            lightLabel={themeToLightLabel}
            darkLabel={themeToDarkLabel}
            iconClassName={iconClassName}
            className="size-full rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
        </DockItem>

        <LanguageSwitcher
          locale={locale}
          label={languageLabel}
          compact={isCompact}
        />
      </Dock>
    </nav>
  )
}
