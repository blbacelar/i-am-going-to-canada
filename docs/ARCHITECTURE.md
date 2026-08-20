# Technical architecture

## Decision

Use Next.js App Router with TypeScript and static, validated JSON for consultant and site content.

This is the right level of architecture for version one because consultant information changes infrequently, is public, does not require concurrent editing and does not justify a database. A database or CMS becomes useful only when non-technical staff need frequent publishing, approvals, scheduling, large article collections or private operational data.

## Recommended stack

- Next.js App Router
- TypeScript strict mode
- Current stable React version supported by the chosen Next.js release
- `next-intl` or an equivalent mature App Router-compatible i18n library
- Zod or equivalent runtime validation for JSON
- CSS variables plus Tailwind CSS if it accelerates implementation without dictating the visual style
- Motion library only if necessary; prefer CSS for simple transitions
- Vitest/Jest for unit logic and Playwright for critical user journeys, if compatible with the repo

Check current official documentation before choosing versions or APIs. Do not assume package versions from this document.

## Suggested structure

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    consultants/
      page.tsx
      [slug]/page.tsx
    services/
      page.tsx
      [slug]/page.tsx
    about/page.tsx
    faq/page.tsx
    privacy/page.tsx
    disclaimer/page.tsx
components/
  concierge/
  consultants/
  layout/
  marketing/
  ui/
data/
  consultants.json
  site-content.json
lib/
  content/
  i18n/
  matching/
  analytics/
  schemas/
messages/
  en.json
  fr.json
  pt.json
public/
  consultants/
  brand/
  images/
```

The exact arrangement may be adjusted to match an existing repository, but concerns must remain separated.

## Locales

- Canonical locale codes: `en`, `fr`, `pt`.
- Public routes must be locale-prefixed.
- Generate correct `lang`, canonical URLs and `hreflang` alternates.
- Preserve the corresponding localized route when switching language where possible.
- If a translation is missing during development, fail loudly or show `TODO_CONTENT`; do not silently publish mixed-language pages.
- Avoid automatic geo-based language assumptions. A browser-language suggestion is acceptable if visitors can override it.

## Data model

Consultants are stored in `data/consultants.json`. The production schema should include:

- stable `id`;
- localized or URL-safe `slug` strategy;
- `order` and `active`;
- localized name display only if needed;
- verified professional title;
- localized biography and short introduction;
- languages;
- service-category IDs;
- location/timezone if approved;
- verified credentials;
- portrait path and alt text;
- Calendly URL;
- optional public contact or social links;
- SEO fields.

Validate data at build time. A malformed, duplicated or incomplete active consultant should fail the build with an actionable message.

## Adding a consultant

Adding a consultant should require only:

1. Add one object to `data/consultants.json`.
2. Add the portrait to `public/consultants/`.
3. Add any new translated service labels if the service category is new.
4. Run validation and build.

Directory pages, profile routes, concierge matching, sitemap and structured data should update automatically.

## Matching logic

Keep the matching engine deterministic, explainable and based only on public service metadata.

Example:

1. Filter active consultants.
2. Match requested language.
3. Match selected service category.
4. Sort by explicit `order` or approved availability rules.
5. Return matches with a plain-language explanation.
6. If no exact match exists, show all consultants and a neutral contact option.

Do not use AI inference, point calculations or legal eligibility logic.

## Calendly

- Store a verified URL per consultant in JSON.
- Prefer external booking links for simplicity and reliability unless embedding is explicitly approved.
- If embedded, use lazy loading, accessible fallback links and privacy/performance review.
- Add locale and event tracking only using supported, documented parameters.
- Never expose private calendar information.

## SEO

- Unique localized metadata for every indexable route.
- Localized sitemap entries and `hreflang`.
- Semantic heading hierarchy.
- Organization/ProfessionalService schema where accurate.
- Person schema for consultants using verified facts only.
- FAQ schema only when the FAQ is visible and compliant with current search-engine policies.
- Preserve or redirect valuable current URLs after auditing them.
- Produce a redirect map before replacing the existing site.

## Analytics and privacy

Track interaction names and coarse categories only. Do not send free-text answers, immigration history, citizenship, age, family details, identifiers or case information.

Recommended events:

- `language_selected`
- `concierge_started`
- `service_selected`
- `consultant_matches_viewed`
- `consultant_profile_viewed`
- `booking_clicked`
- `contact_clicked`

Respect Canadian privacy requirements and the site's approved consent policy. Do not add tracking tools without approval.

## Performance

- Use responsive optimized images.
- Define image dimensions to avoid layout shift.
- Limit font weights and preload only what is required.
- Avoid autoplay video and heavy canvas/shader backgrounds.
- Lazy-load non-critical widgets and Calendly embeds.
- Keep client JavaScript minimal.
- Set a Lighthouse target, but judge performance using repeatable runs and real devices where possible.

## Security

- No secrets in JSON or client-exposed environment variables.
- Validate external URLs.
- Add appropriate security headers at deployment.
- Keep dependencies minimal and audit them.
- Do not create forms that collect case-sensitive data without an approved secure backend.
