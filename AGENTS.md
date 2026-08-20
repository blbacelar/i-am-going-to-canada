# I Am Going To Canada — repository instructions

## Source of truth

Read these files before planning or implementing substantial work:

- `docs/PROJECT-BRIEF.md`
- `docs/design.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT-I18N.md`
- `docs/QA-CHECKLIST.md`

When instructions conflict, preserve user data and production safety first, then follow this file, then the more task-specific document.

## Product rules

- The brand is I Am Going To Canada and the owner is Marina Snyder.
- Present the company and its consultant team; do not center the experience exclusively on Marina.
- Initial consultants: Marina Snyder, Aline, Virginia Melo and Beatriz Dias.
- All public-facing content must be available in English, French and Portuguese.
- The primary conversion is matching visitors with appropriate consultants and sending them to the correct Calendly booking page.
- The matching flow is navigation, not an immigration eligibility assessment.
- Never promise approval, eligibility, results, processing time or success.
- Never invent credentials, licence numbers, testimonials, statistics, addresses, services, prices or appointment links.
- Mark missing content as `TODO_CONTENT` and use safe placeholders.

## Engineering rules

- Use Next.js App Router with TypeScript strict mode.
- Keep consultant content in a validated JSON data source.
- Do not add a database, CMS, authentication or admin panel unless explicitly requested.
- Keep presentation components independent from the JSON source so a future CMS migration is straightforward.
- Prefer server components. Add client components only for genuine interaction.
- Minimize production dependencies. Explain any new dependency before adding it.
- Use semantic HTML, accessible controls, keyboard support and visible focus.
- Respect `prefers-reduced-motion`.
- Do not collect sensitive immigration profile information in analytics or frontend storage.
- Never expose secrets in source, public environment variables or JSON files.

## Visual rules

- Follow `docs/design.md`.
- Aim for editorial, premium, calm, human and contemporary.
- Apple is a quality principle, not a visual template.
- Avoid generic AI aesthetics, excessive cards, decorative gradients, glassmorphism and animation overload.
- Use restrained motion to explain hierarchy and guide action.
- Do not generate realistic substitute faces for the actual consultants.

## Workflow

- Inspect before changing.
- Plan before implementing multi-file work.
- Preserve unrelated user changes.
- Keep the app runnable after each milestone.
- Use Git checkpoints when Git is available, but never rewrite history or discard user work.
- Start the app and inspect the rendered result in a browser.
- Iterate from visual evidence, not only from source code.
- Run lint, typecheck, tests and production build before handoff.
- Never deploy to the production domain without explicit authorization.

## Completion report

Report:

- what changed;
- why major design and architecture decisions were made;
- validation performed and outcomes;
- known limitations and remaining `TODO_CONTENT` items;
- exact steps for replacing photos and adding a consultant.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
