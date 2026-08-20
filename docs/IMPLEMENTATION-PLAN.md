# Implementation plan

## Outcome

Build a production-ready, review-only Next.js site that presents I Am Going To Canada as a four-consultant multilingual practice and guides visitors from language choice to a transparent consultant match and verified Calendly handoff.

## Delivery phases

### 1. Foundation

- Scaffold Next.js App Router with strict TypeScript.
- Add minimal dependencies: Zod for JSON validation and Vitest for deterministic matching/schema tests.
- Configure localized static routes, global metadata, sitemap, robots and redirects.
- Establish CSS tokens and core primitives before page styling.

### 2. Data and content

- Promote the example files to `data/consultants.json` and `data/site-content.json`.
- Add build-time schemas, duplicate detection and deterministic ordering.
- Use current-site facts only where the audit ledger supports them.
- Keep Aline and unconfirmed facts visibly marked `TODO_CONTENT`.
- Keep all public UI strings complete in EN/FR/PT.

### 3. Core experience

- Implement localized header, persistent language switcher and mobile menu.
- Build the homepage narrative: thesis hero, trust boundary, concierge entry, equal team presentation, service overview, process, trust placeholder, FAQ and final CTA.
- Build a one-question-at-a-time concierge with back, restart and view-all actions.
- Build directory, profile, service, about, FAQ, privacy and disclaimer routes.
- Use external Calendly links with safe TODO fallbacks where links are not verified.

### 4. Quality and observability

- Add privacy-safe analytics event dispatch without an external tracking provider.
- Add semantic structured data using verified facts only.
- Cover schemas and matching logic with unit tests.
- Cover locale, concierge and booking handoff with browser tests when the local environment supports them.

### 5. Visual QA and delivery

- Inspect 375, 768, 1024 and 1440px across EN/FR/PT.
- Complete two bounded screenshot-driven refinement passes.
- Run lint, typecheck, tests and production build.
- Audit keyboard, focus, reduced motion, contrast, metadata and horizontal overflow.
- Keep the preview local unless separate preview authorization/tooling is available.

## Architecture

```text
app/
  [locale]/
    consultants/[slug]/
    consultants/
    services/[slug]/
    services/
    about/
    faq/
    privacy/
    disclaimer/
  sitemap.ts
  robots.ts
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
  analytics/
  content/
  i18n/
  matching/
  schemas/
public/
  consultants/
  brand/
tests/
```

Server Components render all static content. Client Components are limited to the mobile navigation, locale-aware interaction tracking and concierge state. Data access is isolated behind typed loaders so a future CMS can replace JSON without changing presentation components.

## Data validation

The build fails for invalid JSON structure, duplicate consultant IDs/slugs, unsupported locales, malformed external URLs and missing required localized objects. `TODO_CONTENT` remains a valid explicit development value because the supplied package requires placeholders instead of fabricated facts.

Consultant matching:

1. Start from active consultants sorted by explicit `order`.
2. Filter by selected public service ID.
3. Filter by selected language only when the visitor chooses one.
4. Explain matches with those same public attributes.
5. If no exact match exists, show the full team and a neutral message.

## Content boundaries

- No eligibility scoring, immigration pathway recommendation or legal diagnosis.
- No collection or persistence of age, citizenship, family composition, education, employment history or free-text case details.
- No prices, statistics, testimonials or claims unless owner-confirmed.
- All unapproved regulated facts are labelled for review in the data source.
- `TODO_LEGAL_REVIEW` is visible on legal routes in the review build.

## SEO and migration

- Localized `title`, `description`, canonical and language alternates for every route.
- `Organization`/`ProfessionalService` and `Person` schema only from safe public fields.
- Sitemap generated from locales, active consultants and active services.
- Root redirect to `/en`; no geolocation redirect.
- Redirect candidates from the audit kept in documentation until production migration is authorized.

## Testing contract

- Unit: JSON schemas, duplicate detection, sorting, exact/no-match behavior, locale helpers.
- Component/interaction: concierge back/restart/view-all and TODO booking fallback.
- Browser: each locale home renders, locale switch preserves route, profile pages render, external Calendly hrefs match data.
- Build: lint, strict typecheck, test and `next build` all pass.
- Visual: no overflow at required widths; French is the stress-test language.

## Known delivery constraints

- Official portraits and Aline's complete record are absent.
- Final legal wording and testimonials are absent.
- The public logo/wordmark is not sufficiently established in the current rendered header.
- A preview deployment will not be created on the production domain.
