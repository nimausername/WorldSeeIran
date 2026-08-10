"use client"

import { useEffect } from "react"

import { getLocaleDirection, type Locale } from "@/lib/i18n/config"

type LocaleDocumentAttrsProps = {
  readonly locale: Locale
}

/**
 * Keeps the document language and direction in sync with the active locale.
 */
export const LocaleDocumentAttrs = ({ locale }: LocaleDocumentAttrsProps) => {
  useEffect(() => {
    const direction = getLocaleDirection(locale)
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [locale])

  return null
}
