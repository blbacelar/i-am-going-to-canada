# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the supplied project package: Next.js App Router, strict TypeScript and validated static JSON. Version one intentionally has no database, CMS, authentication, payments or admin panel.

## Users

People inside or outside Canada who are researching lawful immigration support in English, Canadian French or Brazilian Portuguese. They may be exploring, planning, preparing documents or looking for a case-specific professional conversation. They often arrive with conflicting information and uncertainty about the right service or consultant.

## Product Purpose

I Am Going To Canada is a multilingual presentation and booking funnel for a Canadian immigration consulting company. It should help a visitor understand the company, find professionals whose publicly listed services and languages match the visitor's stated preference, compare profiles and continue to the correct Calendly page.

Success means visitors reach an appropriate professional conversation with less confusion, without the site claiming to assess eligibility or provide individualized immigration advice.

## Positioning

A calm multilingual digital concierge makes the consultant team visible and turns broad service information into a transparent route to the right conversation. Matching is deterministic navigation based on public metadata, not an immigration assessment.

## Operating Context

Visitors use the public website on mobile and desktop, choose EN, FR or PT, browse the team and services, use a short concierge, and leave the site to book through Calendly. The initial team in scope is Marina Snyder, Aline, Virginia Melo and Beatriz Dias.

## Capabilities and Constraints

- Localized routes under `/en`, `/fr` and `/pt`.
- Consultant directory, profiles, service pages, concierge, localized SEO and structured data.
- Consultant and site content loaded from schema-validated JSON.
- Deterministic matching by public language and service identifiers only.
- Privacy-safe analytics event interfaces; no sensitive case details or free text.
- Missing facts remain visibly marked `TODO_CONTENT`; legal wording remains `TODO_LEGAL_REVIEW`.
- No promise of approval, eligibility, outcome, processing time or success.
- No production-domain publication without explicit authorization.

## Brand Commitments

- Brand: I Am Going To Canada. Owner: Marina Snyder.
- The company and four-professional team come before any single personality.
- Voice: clear, direct, reassuring, professional, human and non-sensational.
- Preserve verified brand assets from the current site, but do not retain its inconsistent website-builder visual system as authority.
- Apple is a quality reference for clarity, hierarchy, spacing and restraint, never a visual template.

## Evidence on Hand

- Product, content, architecture and QA briefs in `docs/`.
- Current public site at `https://iamgoingtocanada.ca/`.
- Current published profile and booking information for Marina Snyder, Virginia Melo and Beatriz Dias.
- Current Calendly links for Marina, Virginia and Beatriz.
- Owner-supplied information confirms Aline Costa, RCIC R710053, lawyer in Brazil, serving clients in English, French, Spanish and Portuguese. Her full biography, service areas and Calendly link remain pending.
- No approved testimonials or final legal copy supplied for this build.

All current-site professional facts remain subject to owner verification before production publication.

## Product Principles

1. Guide before asking for commitment.
2. Make the team legible without ranking professional quality.
3. Explain every match using only public attributes.
4. Treat factual restraint as a trust feature.
5. Make all three languages equally complete and usable.

## Accessibility & Inclusion

Target WCAG 2.2 AA, full keyboard operation, visible focus, semantic landmarks, 44px touch targets, reduced-motion support and layouts resilient to longer Canadian French copy.
