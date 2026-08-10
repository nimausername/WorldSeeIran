"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import {
  THEME_TOGGLE_CIRCLE,
  useThemeToggle,
} from "@/components/motion/theme-toggle"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

/**
 * D toggles light/dark with the same circle view-transition as the dock control.
 */
function ThemeHotkey() {
  const { toggle, mounted } = useThemeToggle(THEME_TOGGLE_CIRCLE)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || !mounted) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      event.preventDefault()
      toggle()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mounted, toggle])

  return null
}

export { ThemeProvider }
