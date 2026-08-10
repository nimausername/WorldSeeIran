"use client"

import { OppressorPortrait } from "@/components/oppressors/oppressor-portrait"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Locale } from "@/lib/i18n/config"
import type { OppressorRecord, OppressorTag } from "@/lib/oppressors/types"

export type OppressorsDetailCopy = {
  readonly close: string
  readonly role: string
  readonly category: string
  readonly responsibility: string
  readonly sources: string
  readonly unknown: string
  readonly tags: Readonly<Record<OppressorTag, string>>
  readonly filters: {
    readonly command: string
    readonly security: string
    readonly judiciary: string
  }
}

type OppressorDetailProps = {
  readonly person: OppressorRecord | null
  readonly locale: Locale
  readonly open: boolean
  readonly copy: OppressorsDetailCopy
  readonly onOpenChange: (open: boolean) => void
}

/**
 * Oppressor profile dialog: portrait, role, responsibility, and sources.
 */
export const OppressorDetail = ({
  person,
  locale,
  open,
  copy,
  onOpenChange,
}: OppressorDetailProps) => {
  const name = person?.name[locale] ?? ""
  const role = person?.role[locale] ?? copy.unknown
  const summary = person?.summary[locale] ?? copy.unknown
  const categoryLabel = person
    ? copy.filters[person.category]
    : copy.unknown

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {person ? (
        <DialogContent
          showCloseButton
          className="max-h-[min(92dvh,880px)] overflow-y-auto overscroll-contain p-0 sm:max-w-3xl"
          aria-label={name}
        >
          <DialogTitle className="sr-only">{name}</DialogTitle>
          <DialogDescription className="sr-only">{role}</DialogDescription>

          <Card className="border-0 bg-transparent ring-0 [--card-spacing:--spacing(0)]">
            <div className="flex flex-col sm:flex-row">
              <div className="relative aspect-[4/5] max-h-[42dvh] w-full shrink-0 overflow-hidden bg-muted sm:aspect-auto sm:max-h-none sm:min-h-[28rem] sm:w-[42%]">
                <OppressorPortrait
                  src={person.image}
                  name={name}
                  className="h-full w-full rounded-none text-base sm:rounded-s-xl sm:text-lg"
                  imgClassName="rounded-none sm:rounded-s-xl"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <CardHeader className="gap-3 p-5 pe-14 sm:p-6 sm:pe-14">
                  <CardTitle
                    className={`text-2xl font-semibold tracking-tight sm:text-3xl ${
                      locale === "fa" ? "[font-family:var(--font-fa)]" : ""
                    }`}
                  >
                    {name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {role}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="rounded-md">
                      {categoryLabel}
                    </Badge>
                    {person.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-md">
                        {copy.tags[tag]}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="grid gap-5 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
                  <section className="space-y-2" aria-labelledby="oppressor-role">
                    <h3
                      id="oppressor-role"
                      className="text-xs text-muted-foreground"
                    >
                      {copy.role}
                    </h3>
                    <p className="text-sm leading-relaxed sm:text-base">{role}</p>
                  </section>

                  <section
                    className="space-y-2"
                    aria-labelledby="oppressor-responsibility"
                  >
                    <h3
                      id="oppressor-responsibility"
                      className="text-xs text-muted-foreground"
                    >
                      {copy.responsibility}
                    </h3>
                    <p className="text-sm leading-relaxed sm:text-base">
                      {summary}
                    </p>
                  </section>

                  {person.sources.length > 0 ? (
                    <section
                      className="space-y-2"
                      aria-labelledby="oppressor-sources"
                    >
                      <h3
                        id="oppressor-sources"
                        className="text-xs text-muted-foreground"
                      >
                        {copy.sources}
                      </h3>
                      <ul className="space-y-1.5">
                        {person.sources.map((source) => (
                          <li key={source.url}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                              tabIndex={0}
                              aria-label={source.label}
                            >
                              {source.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                </CardContent>
              </div>
            </div>
          </Card>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
