"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { TextMorph } from "@/components/ui/text-morph"
import type { HomeDictionary } from "@/lib/i18n/dictionaries"

type HomeIntroProps = {
  readonly dict: HomeDictionary
}

/**
 * Home flow: bold intro, then page content with a bold title and middle scroll section.
 */
export const HomeIntro = ({ dict }: HomeIntroProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const showContent = searchParams.get("view") === "content"
  const locale = pathname.split("/").filter(Boolean)[0] ?? "en"

  const handleOpenContent = () => {
    router.push(`${pathname}?view=content`)
  }

  if (!showContent) {
    return (
      <section
        className="flex h-full flex-col justify-center px-4 py-16 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] sm:px-6 sm:pb-24"
        aria-labelledby="home-brand"
      >
        <div className="mx-auto flex w-full max-w-2xl flex-col items-start gap-6">
          <p
            className="text-sm font-medium text-muted-foreground"
            id="home-brand"
          >
            {dict.brand}
          </p>
          <h1 className="max-w-full text-foreground">
            <TextMorph
              words={[...dict.hero.headlineWords]}
              interval={2400}
              morphDuration={680}
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            />
            <span className="sr-only">{dict.hero.headline}</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dict.hero.lead}
          </p>
          <Button
            type="button"
            size="lg"
            className="min-h-11 touch-manipulation px-4 text-sm"
            onClick={handleOpenContent}
            aria-label={dict.hero.scrollHint}
          >
            {dict.hero.scrollHint}
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full max-w-2xl flex-col px-4 py-8 pb-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 sm:py-10 sm:pb-24"
      aria-labelledby="content-title"
    >
      <div className="shrink-0 space-y-4">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          id="content-title"
        >
          {dict.brand}
        </h1>
        <div className="space-y-3" aria-labelledby="home-lead">
          <h2
            className="text-xl font-semibold tracking-tight sm:text-2xl"
            id="home-lead"
          >
            {dict.hero.headline}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {dict.hero.lead}
          </p>
        </div>
      </div>

      <ScrollArea
        className="mt-6 min-h-0 flex-1"
        viewportClassName="scroll-fade no-scrollbar"
        hideScrollbar
        id="content"
      >
        <article className="space-y-8 pb-8">
          <Separator />

          <section
            className="space-y-3"
            id="what-happened"
            aria-labelledby="what-happened-title"
          >
            <h2 className="text-lg font-semibold" id="what-happened-title">
              {dict.whatHappened.title}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed sm:text-base">
              {dict.whatHappened.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <Separator />

          <section
            className="space-y-3"
            id="why-here"
            aria-labelledby="why-here-title"
          >
            <h2 className="text-lg font-semibold" id="why-here-title">
              {dict.whyHere.title}
            </h2>
            <div className="space-y-3 text-sm leading-relaxed sm:text-base">
              {dict.whyHere.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <Separator />

          <section
            className="space-y-4"
            id="what-you-will-find"
            aria-labelledby="what-you-will-find-title"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold" id="what-you-will-find-title">
                {dict.whatYouWillFind.title}
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                {dict.whatYouWillFind.lead}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  <Link
                    href={`/${locale}/javidnam`}
                    className="underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    tabIndex={0}
                    aria-label={dict.whatYouWillFind.fallen.title}
                  >
                    {dict.whatYouWillFind.fallen.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {dict.whatYouWillFind.fallen.body}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  <Link
                    href={`/${locale}/oppressors`}
                    className="underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    tabIndex={0}
                    aria-label={dict.whatYouWillFind.oppressors.title}
                  >
                    {dict.whatYouWillFind.oppressors.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {dict.whatYouWillFind.oppressors.body}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section
            className="space-y-3"
            id="closing"
            aria-labelledby="closing-title"
          >
            <h2 className="text-lg font-semibold" id="closing-title">
              {dict.closing.title}
            </h2>
            <p className="text-sm leading-relaxed sm:text-base">
              {dict.closing.body}
            </p>
            <p className="text-sm font-medium">{dict.closing.vow}</p>
          </section>
        </article>
      </ScrollArea>
    </section>
  )
}
