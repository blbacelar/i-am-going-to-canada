# Definition of done and QA checklist

## Content

- [ ] Company name and Marina's name are correct.
- [ ] Marina, Aline, Virginia Melo and Beatriz Dias are represented.
- [ ] No credentials, services, licence numbers, statistics or testimonials were invented.
- [ ] Missing facts are marked `TODO_CONTENT`.
- [ ] Final disclaimer is marked `TODO_LEGAL_REVIEW` until approved.
- [ ] The homepage focuses on the company and team, not only Marina.
- [ ] Every public string is available in EN, FR and PT.
- [ ] Canadian English, Canadian French and Brazilian Portuguese were reviewed.

## Journey

- [ ] Language selection is visible and persistent.
- [ ] The primary CTA starts the consultant-finding journey.
- [ ] Concierge questions are short and non-sensitive.
- [ ] The flow does not assess eligibility or give legal recommendations.
- [ ] Visitors can go back, restart and view all consultants.
- [ ] Match explanations refer only to public services/languages.
- [ ] Each profile leads to the correct verified Calendly.
- [ ] Calendly failure has a usable fallback link.

## Data architecture

- [ ] Consultants render from JSON rather than hard-coded repeated components.
- [ ] Runtime/build validation catches missing fields and duplicate IDs/slugs.
- [ ] `active` and `order` behave correctly.
- [ ] Adding one consultant updates directory, profile, matching, sitemap and schema.
- [ ] No secret or private information is stored in public JSON.

## Responsive visual QA

- [ ] 375 px viewport checked.
- [ ] 768 px viewport checked.
- [ ] 1024 px viewport checked.
- [ ] 1440 px viewport checked.
- [ ] French copy does not overflow.
- [ ] Navigation and language selector work at every width.
- [ ] Portrait placeholders preserve layout and are clearly temporary.
- [ ] No horizontal scroll, clipped controls or overlapping text.
- [ ] At least two visual refinement passes were completed from screenshots/browser inspection.

## Accessibility

- [ ] Semantic landmarks and heading order are correct.
- [ ] Full keyboard navigation works.
- [ ] Focus indicators are visible.
- [ ] Forms and interactive controls have accessible names.
- [ ] Contrast meets WCAG AA.
- [ ] Images have useful localized alt text or are correctly decorative.
- [ ] Concierge changes are announced appropriately.
- [ ] Reduced-motion preference is respected.
- [ ] Touch targets are large enough.

## SEO

- [ ] Localized titles and descriptions are unique.
- [ ] Canonical and `hreflang` URLs are correct.
- [ ] Sitemap contains localized routes.
- [ ] Robots behavior is correct for production and preview.
- [ ] Structured data contains verified facts only.
- [ ] Existing valuable URLs have a redirect plan.
- [ ] Preview environment is not accidentally indexed.

## Performance

- [ ] Production build succeeds.
- [ ] Images are sized and optimized.
- [ ] Fonts are limited and loaded efficiently.
- [ ] Client JavaScript is justified.
- [ ] Calendly or third-party widgets are lazy-loaded.
- [ ] Animations remain smooth on a mid-range mobile device.
- [ ] No continuous heavy shader/canvas effect is required for the hero.
- [ ] Core Web Vitals risks are documented.

## Engineering

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Automated tests pass.
- [ ] Production build passes.
- [ ] Critical journey tests cover locale, matching and booking handoff.
- [ ] External URLs are validated.
- [ ] No unrelated user work was overwritten.
- [ ] Dependencies and licences were reviewed.

## Privacy and legal boundaries

- [ ] Analytics contains no sensitive immigration information.
- [ ] No case details are collected without an approved secure backend.
- [ ] Cookie/consent behavior matches approved policy.
- [ ] The concierge clearly states it is not an eligibility assessment.
- [ ] Website information disclaimer is visible and localized.

## Delivery

- [ ] A preview exists or exact local preview instructions are provided.
- [ ] Production domain was not changed without explicit authorization.
- [ ] All `TODO_CONTENT` and `TODO_LEGAL_REVIEW` items are listed.
- [ ] Photo replacement instructions are included.
- [ ] “Add a consultant” instructions are included.
- [ ] Final report summarizes files, tests, limitations and next steps.
