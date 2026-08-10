import type { ReactNode } from "react"
import { Suspense } from "react"

import { NamesBackground } from "@/components/fallen/names-background"
import { NavigationDock } from "@/components/shell/navigation-dock"
import type { Locale } from "@/lib/i18n/config"

type MainShellProps = {
  readonly locale: Locale
  readonly homeLabel: string
  readonly languageLabel: string
  readonly javidnamLabel: string
  readonly oppressorsLabel: string
  readonly themeToLightLabel: string
  readonly themeToDarkLabel: string
  readonly creditLabel: string
  readonly children: ReactNode
}

/**
 * Full-height page shell with memorial names background and bottom-right menu dock.
 */
export const MainShell = ({
  locale,
  homeLabel,
  languageLabel,
  javidnamLabel,
  oppressorsLabel,
  themeToLightLabel,
  themeToDarkLabel,
  creditLabel,
  children,
}: MainShellProps) => {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <NamesBackground />
      <div className="relative z-10 h-full min-h-0">{children}</div>
      <p className="pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] start-[max(1rem,env(safe-area-inset-left))] z-20 max-w-[min(12rem,40vw)] text-xs tracking-wide text-muted-foreground/70 rtl:start-[max(1rem,env(safe-area-inset-right))]">
        {creditLabel}
      </p>
      <Suspense fallback={null}>
        <NavigationDock
          locale={locale}
          homeLabel={homeLabel}
          languageLabel={languageLabel}
          javidnamLabel={javidnamLabel}
          oppressorsLabel={oppressorsLabel}
          themeToLightLabel={themeToLightLabel}
          themeToDarkLabel={themeToDarkLabel}
        />
      </Suspense>
    </div>
  )
}
