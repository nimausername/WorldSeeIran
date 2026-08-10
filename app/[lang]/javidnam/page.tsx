import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JavidnamFieldLoader } from "@/components/fallen/javidnam-field-loader"
import { brandOpenGraphImage, brandTwitter } from "@/lib/branding"
import { FALLEN_PEOPLE_META } from "@/lib/fallen/people"
import { isLocale, locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatTemplate,
} from "@/lib/i18n/format"

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

  return {
    title: dict.javidnam.meta.title,
    description: dict.javidnam.meta.description,
    alternates: {
      canonical: `https://worldseeiran.org/${lang}/javidnam`,
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `https://worldseeiran.org/${locale}/javidnam`,
        ])
      ) as Record<Locale, string>,
    },
    openGraph: {
      ...brandOpenGraphImage,
      title: dict.javidnam.meta.title,
      description: dict.javidnam.meta.description,
      url: `https://worldseeiran.org/${lang}/javidnam`,
      siteName: "WorldSeeIran",
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
    <JavidnamFieldLoader
      label={dict.javidnam.title}
      lead={dict.javidnam.lead}
      peopleCountLabel={peopleCountLabel}
      lastUpdatedLabel={lastUpdatedLabel}
      detailCopy={dict.javidnam.detail}
    />
  )
}
