import { siteContent } from "@/lib/content/data";
import { localized, type Locale } from "@/lib/i18n/config";

export function FaqList({ locale }: { locale: Locale }) {
  return (
    <div className="faq-list">
      {siteContent.faq.map((item, index) => (
        <details key={index}>
          <summary>
            <span>{localized(item.question, locale)}</span>
            <svg className="faq-icon" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 9h14M9 2v14" />
            </svg>
          </summary>
          <div><p>{localized(item.answer, locale)}</p></div>
        </details>
      ))}
    </div>
  );
}
