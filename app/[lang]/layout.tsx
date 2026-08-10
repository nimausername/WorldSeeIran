import { notFound } from "next/navigation"

import { LocaleDocumentAttrs } from "@/components/shell/locale-document-attrs"
import { MainShell } from "@/components/shell/main-shell"
import {
  getLocaleDirection,
  isLocale,
  locales,
} from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { cn } from "@/lib/utils"

type LangLayoutProps = LayoutProps<"/[lang]">

/**
 * Builds static params for each supported locale.
 */
export const generateStaticParams = () =>
  locales.map((lang) => ({ lang }))

/**
 * Locale shell: text direction and the main scroll wireframe.
 */
export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  const dict = getDictionary(lang)
  const direction = getLocaleDirection(lang)

  return (
    <div
      lang={lang}
      dir={direction}
      data-locale={lang}
      className={cn("h-full", lang === "fa" && "[font-family:var(--font-fa)]")}
    >
      <LocaleDocumentAttrs locale={lang} />
      <MainShell
        locale={lang}
        homeLabel={dict.nav.home}
        languageLabel={dict.nav.language}
        javidnamLabel={dict.nav.javidnam}
      >
        {children}
      </MainShell>
    </div>
  )
}
