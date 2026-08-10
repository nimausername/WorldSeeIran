import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { OppressorsDirectory } from "@/components/oppressors/oppressors-directory"
import { JsonLd } from "@/components/seo/json-ld"
import {
  brandOpenGraphImage,
  brandRobots,
  brandTwitter,
} from "@/lib/branding"
import { isLocale, locales } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import {
  formatLocaleDate,
  formatLocaleNumber,
  formatTemplate,
} from "@/lib/i18n/format"
import { OPPRESSORS_META, getOppressorRecords } from "@/lib/oppressors"
import { buildOppressorsPageSchema } from "@/lib/seo/structured-data"
import { languageAlternates, localeUrl, siteName } from "@/lib/site"

type OppressorsPageProps = {
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
 * Builds localized metadata for the oppressors directory.
 */
export const generateMetadata = async ({
  params,
}: OppressorsPageProps): Promise<Metadata> => {
  const { lang } = await params

  if (!isLocale(lang)) {
    return {}
  }

  const dict = getDictionary(lang)
  const pageUrl = localeUrl(lang, "oppressors")

  return {
    title: {
      absolute: dict.oppressors.meta.title,
    },
    description: dict.oppressors.meta.description,
    robots: brandRobots,
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates("oppressors"),
    },
    openGraph: {
      ...brandOpenGraphImage,
      title: dict.oppressors.meta.title,
      description: dict.oppressors.meta.description,
      url: pageUrl,
      siteName,
      locale: lang === "fa" ? "fa_IR" : lang === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      ...brandTwitter,
      title: dict.oppressors.meta.title,
      description: dict.oppressors.meta.description,
    },
  }
}

/**
 * Accountability directory of documented oppressors.
 */
export default async function OppressorsPage({ params }: OppressorsPageProps) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const dict = getDictionary(lang)
  const peopleCountLabel = formatTemplate(dict.oppressors.stats.peopleCount, {
    count: formatLocaleNumber(lang, OPPRESSORS_META.count),
  })
  const lastUpdatedLabel = formatTemplate(dict.oppressors.stats.lastUpdated, {
    date: formatLocaleDate(lang, OPPRESSORS_META.updatedAt),
  })

  return (
    <>
      <JsonLd
        id="oppressors-structured-data"
        data={buildOppressorsPageSchema(
          lang,
          dict.oppressors.meta.title,
          dict.oppressors.meta.description
        )}
      />
      <OppressorsDirectory
        locale={lang}
        people={getOppressorRecords()}
        copy={{
          title: dict.oppressors.title,
          lead: dict.oppressors.lead,
          peopleCountLabel,
          lastUpdatedLabel,
          searchPlaceholder: dict.oppressors.searchPlaceholder,
          empty: dict.oppressors.empty,
          openProfile: dict.oppressors.openProfile,
          filters: dict.oppressors.filters,
          tags: dict.oppressors.tags,
          detail: {
            ...dict.oppressors.detail,
            tags: dict.oppressors.tags,
            filters: {
              command: dict.oppressors.filters.command,
              security: dict.oppressors.filters.security,
              judiciary: dict.oppressors.filters.judiciary,
            },
          },
        }}
      />
    </>
  )
}
