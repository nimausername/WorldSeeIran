"use client"

import { motion } from "motion/react"
import { useDeferredValue, useMemo, useState } from "react"

import {
  OppressorDetail,
  type OppressorsDetailCopy,
} from "@/components/oppressors/oppressor-detail"
import { OppressorPortrait } from "@/components/oppressors/oppressor-portrait"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Locale } from "@/lib/i18n/config"
import type {
  OppressorCategory,
  OppressorRecord,
  OppressorTag,
} from "@/lib/oppressors/types"

export type OppressorsDirectoryCopy = {
  readonly title: string
  readonly lead: string
  readonly peopleCountLabel: string
  readonly lastUpdatedLabel: string
  readonly searchPlaceholder: string
  readonly empty: string
  readonly openProfile: string
  readonly filters: {
    readonly all: string
    readonly command: string
    readonly security: string
    readonly judiciary: string
  }
  readonly tags: Readonly<Record<OppressorTag, string>>
  readonly detail: OppressorsDetailCopy
}

type OppressorsDirectoryProps = {
  readonly locale: Locale
  readonly people: readonly OppressorRecord[]
  readonly copy: OppressorsDirectoryCopy
}

type CategoryFilter = "all" | OppressorCategory

/**
 * Scrollable oppressors directory with search, category filters, and detail dialog.
 */
export const OppressorsDirectory = ({
  locale,
  people,
  copy,
}: OppressorsDirectoryProps) => {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  const selected = useMemo(
    () => people.find((person) => person.id === selectedId) ?? null,
    [people, selectedId]
  )

  const filtered = useMemo(() => {
    return people.filter((person) => {
      if (category !== "all" && person.category !== category) {
        return false
      }

      if (!deferredQuery) {
        return true
      }

      const haystack = [
        person.name.en,
        person.name.de,
        person.name.fa,
        person.role.en,
        person.role.de,
        person.role.fa,
        person.summary.en,
        person.summary.de,
        person.summary.fa,
      ]
        .join(" ")
        .toLowerCase()

      return haystack.includes(deferredQuery)
    })
  }, [people, category, deferredQuery])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedId(null)
    }
  }

  const handleCategoryChange = (values: string[]) => {
    const next = values[0] as CategoryFilter | undefined
    setCategory(next ?? "all")
  }

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col px-4 py-8 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 sm:py-10 sm:pb-24"
      aria-labelledby="oppressors-title"
    >
      <header className="shrink-0 space-y-4">
        <div className="space-y-2">
          <h1
            id="oppressors-title"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {copy.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {copy.lead}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{copy.peopleCountLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{copy.lastUpdatedLabel}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="oppressors-search">
            {copy.searchPlaceholder}
          </label>
          <Input
            id="oppressors-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-9 min-h-11 touch-manipulation sm:min-h-9 sm:max-w-xs"
            aria-label={copy.searchPlaceholder}
          />

          <ToggleGroup
            value={[category]}
            onValueChange={handleCategoryChange}
            variant="outline"
            size="sm"
            className="flex flex-wrap"
            aria-label={copy.filters.all}
          >
            {(
              [
                ["all", copy.filters.all],
                ["command", copy.filters.command],
                ["security", copy.filters.security],
                ["judiciary", copy.filters.judiciary],
              ] as const
            ).map(([value, label]) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={label}
                className="min-h-9 touch-manipulation px-3"
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </header>

      <ScrollArea
        className="mt-6 min-h-0 flex-1"
        viewportClassName="scroll-fade no-scrollbar"
        hideScrollbar
      >
        {filtered.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">{copy.empty}</p>
        ) : (
          <ul className="grid gap-3 pb-8 sm:gap-4">
            {filtered.map((person, index) => {
              const name = person.name[locale]
              const role = person.role[locale]
              const summary = person.summary[locale]

              return (
                <motion.li
                  key={person.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.2),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(person.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedId(person.id)
                      }
                    }}
                    className="flex w-full gap-4 rounded-lg p-3 text-start transition-colors outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-5 sm:p-4"
                    aria-label={`${copy.openProfile}: ${name}`}
                    tabIndex={0}
                  >
                    <OppressorPortrait
                      src={person.image}
                      name={name}
                      className="size-20 shrink-0 rounded-md sm:size-24"
                    />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="space-y-1">
                        <h2
                          className={`text-base font-semibold tracking-tight sm:text-lg ${
                            locale === "fa"
                              ? "[font-family:var(--font-fa)]"
                              : ""
                          }`}
                        >
                          {name}
                        </h2>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {role}
                        </p>
                      </div>
                      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {person.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-md text-[0.65rem]"
                          >
                            {copy.tags[tag]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        )}
      </ScrollArea>

      <OppressorDetail
        person={selected}
        locale={locale}
        open={selected !== null}
        copy={copy.detail}
        onOpenChange={handleOpenChange}
      />
    </section>
  )
}
