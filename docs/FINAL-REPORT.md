# Delivery report

## Outcome

The redesign is implemented as a statically generated Next.js 16 website in English, Canadian French and Brazilian Portuguese. It presents Marina Snyder, Aline, Virginia Melo and Beatriz Dias as one team, provides an explainable two-question consultant finder, and hands booking off to each consultant's published Calendly destination.

The implementation is intentionally a review preview. It has not been deployed to production and robots remain blocked outside a production Vercel environment.

## What was delivered

- Localized home, consultant directory, four profile routes, service directory, six service routes, about, FAQ, privacy, disclaimer and consultant-finder pages.
- A JSON-driven consultant/content model with Zod validation and deterministic matching.
- A visible, non-sensitive concierge that asks only consultation language and broad service category.
- Localized metadata, canonical/hreflang alternates, sitemap, robots policy, structured data and redirects for audited legacy paths.
- Responsive design at 375, 768, 1024 and 1440 px with reduced-motion and keyboard-focus support.
- Abstract portrait placeholders that are explicitly labelled for replacement rather than presented as real people.
- Product, audit, research, wireframe, design-system, implementation and owner-content documentation.

## Verification evidence

| Check | Result |
|---|---|
| ESLint | Pass |
| TypeScript | Pass |
| Vitest | 2 files, 4 tests passed |
| Playwright | 17 tests passed |
| Automated accessibility | No Axe violations detected on the EN, FR or PT home pages |
| Responsive overflow | Pass at 375, 768, 1024 and 1440 px |
| Production build | Pass; 60 static pages generated |
| Dependency audit | 0 npm vulnerabilities reported |

The critical browser journey verifies French locale rendering, consultant-finder progression, relevant match results and language preservation on a consultant profile.

## Required owner approvals before production

1. Supply Aline Costa's full biography, service areas and booking URL; her name, RCIC R710053, lawyer status in Brazil and four languages are confirmed.
2. Confirm Marina, Virginia and Beatriz's titles, licence details, biographies, languages, service mappings and booking URLs.
3. Replace all four abstract portrait placeholders with approved photographs.
4. Supply the official legal/business name and approved privacy/disclaimer wording.
5. Approve Canadian English, Canadian French and Brazilian Portuguese copy.
6. Provide consented testimonials if the trust-story placeholder is to be published.
7. Decide on analytics and cookie-consent policy before connecting any vendor.

All unresolved content remains visible as `TODO_CONTENT`, a review badge or a review-preview notice. The source of truth is `docs/OWNER-CONTENT-CHECKLIST.md`.

## Replacing photographs

1. Prepare a high-resolution vertical image with a consistent crop for each consultant.
2. Save the files under `public/consultants/` using stable descriptive filenames.
3. Update `portrait.src` and the three localized `portrait.alt` values in `data/consultants.json`.
4. Run `npm run test:e2e` and `npm run build` to verify layout and output.

## Adding a consultant

1. Add one schema-complete record to `data/consultants.json`, with a unique `id`, `slug` and `order`.
2. Add the approved portrait under `public/consultants/`.
3. Reuse existing service IDs or add localized service content in `data/site-content.json`.
4. Run `npm run test`, `npm run test:e2e` and `npm run build`.

The directory, profile route, finder, sitemap and structured data derive from the JSON record automatically.

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en`, `/fr` or `/pt`. For a production-mode check, run `npm run build && npm run start`.

## Deployment status

No production deployment or domain change was performed. A preview deployment should be created only after the content approvals above or with the explicit understanding that it is a non-indexed review artifact.

The installed Vercel CLI is outdated (`59.1.4` versus `59.3.0`). Before a future preview/deployment, update it with `npm i -g vercel@latest` (or `pnpm add -g vercel@latest`).

## Known limitations

- Consultant data is static JSON; there is no CMS or editorial approval workflow.
- Analytics events are emitted locally as browser custom events, but no analytics provider is connected.
- Calendly is an external handoff, not an embedded widget.
- Final performance and Core Web Vitals must be measured again with approved production photographs and the production host.
