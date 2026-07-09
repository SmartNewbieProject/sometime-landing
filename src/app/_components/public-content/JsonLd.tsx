type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** SSR JSON-LD — XSS 방지로 < 이스케이프 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
