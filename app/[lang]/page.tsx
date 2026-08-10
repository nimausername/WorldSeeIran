import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { HomeIntro } from "@/components/home/home-intro"
import { brandOpenGraphImage, brandTwitter } from "@/lib/branding"
import { isLocale, locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"

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

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://worldseeiran.org/${lang}`,
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `https://worldseeiran.org/${locale}`])
      ) as Record<Locale, string>,
    },
    openGraph: {
      ...brandOpenGraphImage,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `https://worldseeiran.org/${lang}`,
      siteName: "WorldSeeIran",
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
    <Suspense fallback={null}>
      <HomeIntro dict={dict} />
    </Suspense>
  )
}
