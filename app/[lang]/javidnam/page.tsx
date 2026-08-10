import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JavidnamFieldLoader } from "@/components/fallen/javidnam-field-loader"
import { JsonLd } from "@/components/seo/json-ld"
import {
  brandOpenGraphImage,
  brandRobots,
  brandTwitter,
} from "@/lib/branding"
import { FALLEN_PEOPLE_META } from "@/lib/fallen/people"
import { isLocale, locales } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatTemplate,
} from "@/lib/i18n/format"
import { buildJavidnamPageSchema } from "@/lib/seo/structured-data"
import { languageAlternates, localeUrl, siteName } from "@/lib/site"

type JavidnamPageProps = {
  readonly params: Promise<{
    readonly lang: string
  }>
}

/**
 * Builds static params for each supported locale.
 */
export const generateStaticParams = () =>
  locales.map((lang) => ({ lang }))

/**
 * Builds localized metadata for the javidnam memorial field.
 */
export const generateMetadata = async ({
  params,
}: JavidnamPageProps): Promise<Metadata> => {
  const { lang } = await params

  if (!isLocale(lang)) {
    return {}
  }

  const dict = getDictionary(lang)
  const pageUrl = localeUrl(lang, "javidnam")

  return {
    title: {
      absolute: dict.javidnam.meta.title,
    },
    description: dict.javidnam.meta.description,
    robots: brandRobots,
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates("javidnam"),
    },
    openGraph: {
      ...brandOpenGraphImage,
      title: dict.javidnam.meta.title,
      description: dict.javidnam.meta.description,
      url: pageUrl,
      siteName,
      locale: lang === "fa" ? "fa_IR" : lang === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      ...brandTwitter,
      title: dict.javidnam.meta.title,
      description: dict.javidnam.meta.description,
    },
  }
}

/**
 * Full-screen infinite memorial portrait field.
 * Heavy canvas work is deferred to a client-only dynamic import.
 */
export default async function JavidnamPage({ params }: JavidnamPageProps) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const dict = getDictionary(lang)
  const peopleCountLabel = formatTemplate(dict.javidnam.stats.peopleCount, {
    count: formatLocaleNumber(lang, FALLEN_PEOPLE_META.count),
  })
  const lastUpdatedLabel = formatTemplate(dict.javidnam.stats.lastUpdated, {
    date: formatLocaleDate(lang, FALLEN_PEOPLE_META.fetchedAt),
  })

  return (
    <>
      <JsonLd
        id="javidnam-structured-data"
        data={buildJavidnamPageSchema(
          lang,
          dict.javidnam.meta.title,
          dict.javidnam.meta.description
        )}
      />
      <JavidnamFieldLoader
        label={dict.javidnam.title}
        lead={dict.javidnam.lead}
        peopleCountLabel={peopleCountLabel}
        lastUpdatedLabel={lastUpdatedLabel}
        detailCopy={dict.javidnam.detail}
      />
    </>
  )
}
