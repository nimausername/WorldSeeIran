"use client"

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
import type { FallenPortrait } from "@/lib/fallen/portrait-types"

export type JavidnamDetailCopy = {
  readonly close: string
  readonly age: string
  readonly place: string
  readonly date: string
  readonly unknown: string
}

type JavidnamDetailProps = {
  readonly person: FallenPortrait | null
  readonly open: boolean
  readonly copy: JavidnamDetailCopy
  readonly onOpenChange: (open: boolean) => void
}

/**
 * Memorial person detail dialog built with shadcn Dialog primitives.
 */
export const JavidnamDetail = ({
  person,
  open,
  copy,
  onOpenChange,
}: JavidnamDetailProps) => {
  const ageLabel =
    person?.age === null || person?.age === undefined
      ? copy.unknown
      : String(person.age)
  const placeLabel = person?.place?.trim() ? person.place : copy.unknown
  const dateLabel = person?.dateFormatted?.trim()
    ? person.dateFormatted
    : copy.unknown

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {person ? (
        <DialogContent
          showCloseButton
          className="max-h-[min(92dvh,880px)] overflow-hidden p-0 sm:max-w-3xl"
          dir="rtl"
          lang="fa"
        >
          <DialogTitle className="sr-only">{person.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {placeLabel}
            {" · "}
            {dateLabel}
          </DialogDescription>

          <Card className="border-0 bg-transparent ring-0 [--card-spacing:--spacing(0)]">
            <div className="flex flex-col sm:flex-row">
              <div className="relative aspect-[4/5] w-full shrink-0 bg-muted sm:aspect-auto sm:min-h-[28rem] sm:w-[46%]">
                {/* eslint-disable-next-line @next/next/no-img-element -- memorial portrait asset */}
                <img
                  src={person.image}
                  alt={person.name}
                  className="h-full w-full rounded-none object-cover sm:rounded-s-xl"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col">
                <CardHeader className="gap-3 p-5 pe-12 sm:p-6 sm:pe-14">
                  <CardTitle className="text-2xl font-semibold tracking-tight [font-family:var(--font-fa)] sm:text-3xl">
                    {person.name}
                  </CardTitle>
                </CardHeader>

                <Separator />

                <CardContent className="grid gap-4 p-5 sm:p-6">
                  <DetailRow label={copy.age} value={ageLabel} />
                  <DetailRow label={copy.place} value={placeLabel} />
                  <DetailRow label={copy.date} value={dateLabel} />
                </CardContent>
              </div>
            </div>
          </Card>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

type DetailRowProps = {
  readonly label: string
  readonly value: string
}

/**
 * Labeled detail row using shadcn Badge for the value.
 */
const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="pt-0.5 text-xs text-muted-foreground">{label}</span>
      <Badge
        variant="secondary"
        className="h-auto max-w-[70%] justify-end rounded-md px-2.5 py-1 text-xs font-normal whitespace-normal [font-family:var(--font-fa)]"
      >
        {value}
      </Badge>
    </div>
  )
}
