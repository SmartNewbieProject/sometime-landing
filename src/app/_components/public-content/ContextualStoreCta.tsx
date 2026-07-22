import { resolveContentStoreCta } from "@/app/_lib/content-store-cta";
import { StoreInstallCta } from "./StoreInstallCta";

export function ContextualStoreCta({
  title,
  category,
  keywords,
  description,
}: {
  title: string;
  category?: string | null;
  keywords?: string[] | null;
  description?: string | null;
}) {
  const copy = resolveContentStoreCta({ title, category, keywords, description });

  return (
    <div className="not-prose my-10" data-cta-intent={copy.kind}>
      <StoreInstallCta
        surface="landing_content_detail"
        heading={copy.heading}
        description={copy.description}
        compact
      />
    </div>
  );
}
