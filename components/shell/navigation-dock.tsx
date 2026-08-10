"use client"

import { HomeIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Dock, DockItem, DockSeparator } from "@/components/motion/dock"
import { LanguageSwitcher } from "@/components/shell/language-switcher"
import type { Locale } from "@/lib/i18n/config"

type NavigationDockProps = {
  readonly locale: Locale
  readonly homeLabel: string
  readonly languageLabel: string
  readonly javidnamLabel: string
}

/**
 * Site menu dock: home, javidnam, and language menu.
 */
export const NavigationDock = ({
  locale,
  homeLabel,
  languageLabel,
  javidnamLabel,
}: NavigationDockProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")
  const isHomeRoute =
    pathname === `/${locale}` || pathname === `/${locale}/`
  const isJavidnamRoute = pathname === `/${locale}/javidnam`

  return (
    <nav className="absolute right-4 bottom-4 z-20" aria-label={homeLabel}>
      <Dock size={36} className="gap-1 rounded-xl px-1.5 py-0.5 shadow-lg">
        <DockItem active={isHomeRoute && view !== "content"}>
          <Link
            href={`/${locale}`}
            aria-label={homeLabel}
            tabIndex={0}
            className="flex size-full items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <HomeIcon className="size-4" aria-hidden="true" />
          </Link>
        </DockItem>

        <DockItem active={isJavidnamRoute}>
          <Link
            href={`/${locale}/javidnam`}
            aria-label={javidnamLabel}
            tabIndex={0}
            className="flex size-full items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <UsersIcon className="size-4" aria-hidden="true" />
          </Link>
        </DockItem>

        <DockSeparator className="h-4" />

        <LanguageSwitcher locale={locale} label={languageLabel} />
      </Dock>
    </nav>
  )
}
