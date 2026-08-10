import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n/config"

/**
 * Picks the best supported locale from an Accept-Language header.
 */
const getPreferredLocale = (request: NextRequest): Locale => {
  const header = request.headers.get("accept-language")

  if (!header) {
    return defaultLocale
  }

  const candidates = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const qualityParam = params.find((param) => param.trim().startsWith("q="))
      const quality = qualityParam
        ? Number.parseFloat(qualityParam.trim().slice(2))
        : 1

      return {
        tag: tag.toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const candidate of candidates) {
    const base = candidate.tag.split("-")[0]

    if (isLocale(base)) {
      return base
    }
  }

  return defaultLocale
}

/**
 * Redirects bare paths into a locale-prefixed route.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  const locale = getPreferredLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|icon|apple-icon|opengraph-image|twitter-image|.*\\..*).*)",
  ],
}
