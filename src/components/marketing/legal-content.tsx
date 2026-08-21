import type { SiteContent } from "@/lib/schemas/content";
import { localized, type Locale } from "@/lib/i18n/config";

type LegalPageCopy = SiteContent["pages"]["privacy"];

export function LegalContent({ copy, locale }: { copy: LegalPageCopy; locale: Locale }) {
  return (
    <section className="legal-page">
      <div className="shell narrow-shell legal-layout">
        <aside className="legal-meta" aria-label={localized(copy.updatedAt, locale)}>
          <p className="legal-updated">{localized(copy.updatedAt, locale)}</p>
          <p className="legal-review-note">{localized(copy.reviewNotice, locale)}</p>
        </aside>

        <div>
          <div className="legal-sections">
            {copy.sections.map((section) => (
              <article className="legal-section" key={section.title.en}>
                <h2>{localized(section.title, locale)}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.en}>{localized(paragraph, locale)}</p>
                ))}
              </article>
            ))}
          </div>

          <aside className="legal-resources" aria-labelledby="legal-resources-title">
            <h2 id="legal-resources-title">{localized(copy.resourcesTitle, locale)}</h2>
            <ul>
              {copy.resources.map((resource) => (
                <li key={resource.url}>
                  <a href={resource.url}>{localized(resource.label, locale)}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
