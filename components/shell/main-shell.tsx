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
  children,
}: MainShellProps) => {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background">
      <NamesBackground />
      <div className="relative z-10 h-full min-h-0">{children}</div>
      <Suspense fallback={null}>
        <NavigationDock
          locale={locale}
          homeLabel={homeLabel}
          languageLabel={languageLabel}
          javidnamLabel={javidnamLabel}
        />
      </Suspense>
    </div>
  )
}
