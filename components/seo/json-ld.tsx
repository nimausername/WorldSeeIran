/**
 * Serializes JSON-LD safely for injection into a script tag.
 */
const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c")

type JsonLdProps = {
  readonly id: string
  readonly data: Record<string, unknown> | readonly Record<string, unknown>[]
}

/**
 * Renders a Schema.org JSON-LD block for search engines.
 */
export const JsonLd = ({ id, data }: JsonLdProps) => (
  <script
    id={id}
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
  />
)
