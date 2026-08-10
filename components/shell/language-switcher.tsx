"use client"

import { LanguagesIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DockItem } from "@/components/motion/dock"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  isLocale,
  localeLabels,
  localeNames,
  locales,
  type Locale,
} from "@/lib/i18n/config"

type LanguageSwitcherProps = {
  readonly locale: Locale
  readonly label: string
}

/**
 * Dock language menu using shadcn DropdownMenu radio items.
 */
export const LanguageSwitcher = ({ locale, label }: LanguageSwitcherProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const view = searchParams.get("view")

  const getLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/")
    segments[1] = nextLocale
    const nextPath = segments.join("/") || `/${nextLocale}`

    if (view === "content") {
      return `${nextPath}?view=content`
    }

    return nextPath
  }

  const handleLocaleChange = (value: string) => {
    if (!isLocale(value) || value === locale) {
      return
    }

    router.push(getLocaleHref(value))
  }

  return (
    <DropdownMenu>
      <DockItem>
        <DropdownMenuTrigger
          aria-label={label}
          className="flex size-full items-center justify-center rounded-full text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <LanguagesIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">
            {label}: {localeNames[locale]}
          </span>
        </DropdownMenuTrigger>
      </DockItem>

      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={10}
        className="min-w-44"
      >
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={handleLocaleChange}
        >
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {locales.map((item) => (
            <DropdownMenuRadioItem
              key={item}
              value={item}
              lang={item}
              className="gap-3"
            >
              <span className="font-medium tabular-nums text-muted-foreground">
                {localeLabels[item]}
              </span>
              <span>{localeNames[item]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
