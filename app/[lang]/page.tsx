import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { HomeIntro } from "@/components/home/home-intro"
import { JsonLd } from "@/components/seo/json-ld"
import {
  brandOpenGraphImage,
  brandRobots,
  brandTwitter,
} from "@/lib/branding"
import { isLocale, locales } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { buildHomePageSchema } from "@/lib/seo/structured-data"
import { languageAlternates, localeUrl, siteName } from "@/lib/site"

type HomePageProps = PageProps<"/[lang]">

/**
 * Builds static params for each supported locale.
 */
export const generateStaticParams = () =>
  locales.map((lang) => ({ lang }))

/**
 * Builds localized metadata for the memorial home page.
 */
export const generateMetadata = async ({
  params,
}: HomePageProps): Promise<Metadata> => {
  const { lang } = await params

  if (!isLocale(lang)) {
    return {}
  }

  const dict = getDictionary(lang)
  const pageUrl = localeUrl(lang)

  return {
    title: {
      absolute: dict.meta.title,
    },
    description: dict.meta.description,
    robots: brandRobots,
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates(),
    },
    openGraph: {
      ...brandOpenGraphImage,
      title: dict.meta.title,
      description: dict.meta.description,
      url: pageUrl,
      siteName,
      locale: lang === "fa" ? "fa_IR" : lang === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      ...brandTwitter,
      title: dict.meta.title,
      description: dict.meta.description,
    },
  }
}

/**
 * Memorial first page: why WorldSeeIran exists and what happened.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const dict = getDictionary(lang)

  return (
    <>
      <JsonLd
        id="home-structured-data"
        data={buildHomePageSchema(lang, dict.meta.description)}
      />
      <Suspense fallback={null}>
        <HomeIntro dict={dict} />
      </Suspense>
    </>
  )
}
