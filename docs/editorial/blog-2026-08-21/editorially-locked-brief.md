# Editorially locked brief

## Assignment

- Brand: I Am Going To Canada
- Audience: people in or outside Canada reading in PT-BR, EN-CA or FR-CA
- Canonical language: PT-BR
- Output: three complete articles, each localized into EN-CA and FR-CA
- Editorial status: `ready_for_human_review`
- Accessed and verified: August 21, 2026, America/Vancouver
- Publication: local review only; do not deploy or mark as approved for publication
- Author: I Am Going To Canada Editorial Team
- Authorized reviewer of the complete articles: `REVIEWER_REQUIRED`

## Shared guardrails

- General educational information only. Do not assess eligibility or recommend a pathway for an individual.
- An invitation to apply is not an approval or an admission.
- Distinguish page update, announcement, consultation deadline and effective date.
- Put direct official links next to consequential claims.
- Use an ethical CTA to the site’s consultant finder, never a claim that booking improves an outcome.
- All three locale versions must preserve numbers, dates, scope, caveats and CTA meaning.
- Use `NewsArticle` for the Express Entry and PEI stories; use `Article` for the TFWP explainer.
- Do not add `reviewedBy` until Marina reviews the complete visible versions.
- Keep draft articles out of the sitemap and search index until final approval.

## Article 1: Express Entry rounds

- Classification: `draw_or_round`
- Angle: explain why CRS 760, 523 and 382 appeared in the same week without treating them as one general cut-off.
- Verified facts:
  - August 17, round #435, Provincial Nominee Program, 442 invitations, CRS 760.
  - August 18, round #436, Canadian Experience Class, 1,000 invitations, CRS 523.
  - August 19, round #437, French-language proficiency, 5,000 invitations, CRS 382.
  - Total: 6,442 invitations across separate populations.
  - IRCC does not state why it chose each round size. Do not speculate.
- Official sources:
  - https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json
  - https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_fr.json
  - https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html
  - https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/rondes-invitations.html
- Internal routes confirmed:
  - `/services/permanent-residence`
  - `/consultants`
  - `/find-a-consultant`
- Freshness trigger: another Express Entry round or a revision to the official data. Proposed review: August 28, 2026.

## Article 2: TFWP low-wage cap

- Classification: `operational_update`
- Angle: explain the current calculation for work locations with fewer than 10 employees whose applicable LMIA is subject to the low-wage cap.
- Verified facts:
  - ESDC marks the variation as updated August 18, 2026.
  - The formula uses a workforce size of 10.
  - Maximum: one low-wage temporary foreign worker when the 10% cap applies; two when the 20% cap applies.
  - The workforce count includes full-time and part-time employees, employees on leave expected to return, vacancies requested on the LMIA and workers on previously approved LMIAs who have not started.
  - A part-time employee working fewer than 30 hours per week counts as 0.5 for this calculation.
  - The page does not give the variation a separate effective date. Do not call August 18 its effective date and do not claim retroactivity.
  - The same variation appears in the general low-wage requirements and the dual-intent permanent-residence support requirements. Keep the safe scope: an LMIA subject to the applicable cap.
- Official sources:
  - https://www.canada.ca/en/employment-social-development/services/foreign-workers/median-wage/low/requirements.html
  - https://www.canada.ca/fr/emploi-developpement-social/services/travailleurs-etrangers/salaire-moyen/bas/exigences.html
  - https://www.canada.ca/en/employment-social-development/services/foreign-workers/permanent/requirements.html
  - https://www.canada.ca/fr/emploi-developpement-social/services/travailleurs-etrangers/permanent/exigences.html
- Internal routes confirmed:
  - `/services/employer-services`
  - `/services/temporary-residence`
  - `/consultants`
  - `/disclaimer`
  - `/find-a-consultant`
- Freshness trigger: ESDC adds an effective date, changes the formula, the LMIA form, caps or exemptions. Proposed review: August 28, 2026.

## Article 3: PEI consultation

- Classification: `announcement`
- Angle: explain the proposed employer registry and penalties while separating phase-one rules already in force from phase-two draft regulations.
- Verified facts:
  - PEI opened the consultation on August 20, 2026.
  - Feedback closes September 17, 2026.
  - The draft proposes employer registration, a publicly accessible registry, information requirements and administrative penalties from C$500 to C$3,000.
  - Repeat violations by the same person within three years may lead to double the applicable penalty.
  - The draft is not in force and its commencement field is blank.
  - Phase one took effect April 1, 2025 and introduced recruiter licensing. It does not make the phase-two proposals effective.
- Official sources:
  - https://www.princeedwardisland.ca/en/information/workforce-and-advanced-learning/consultation-on-new-foreign-worker-employer-registry
  - https://www.princeedwardisland.ca/sites/default/files/8344/Temporary%20Foreign%20Worker%20Act%20Regs%20-%20Phase%202%20-%20Consultation%20Draft.pdf
  - https://lite.princeedwardisland.ca/province-seeks-feedback-regulations-protect-temporary-foreign-workers
  - https://lite.princeedwardisland.ca/fr/node/81053
- Internal routes confirmed:
  - `/services/employer-services`
  - `/services/temporary-residence`
  - `/consultants`
  - `/find-a-consultant`
- Freshness trigger: PEI extends or closes the consultation, revises or adopts the draft, or announces an effective date. Proposed review: September 18, 2026.

## Required footer note meaning

Each locale must say that the article provides general information, is not legal or immigration advice, programs and policies can change, individual circumstances matter, official sources should be reviewed, and an authorized professional can advise on a reader’s own situation.

## Approval record (2026-08-21)

- Complete article versions approved by Marina Snyder (RCIC-IRB R519265).
- Scope: PT-BR, EN-CA and FR-CA versions of all three articles.
- Destination authorized: production.
- The initial review-only status above is retained as the historical pre-approval state.
