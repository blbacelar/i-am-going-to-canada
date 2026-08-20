# Wireframes and page hierarchy

These wireframes describe reading order and interaction hierarchy, not final decoration.

## Homepage — desktop

```text
┌──────────────────────────────────────────────────────────────────────┐
│ WORDMARK       Consultants  Services  About  FAQ    EN FR PT   CTA  │
├──────────────────────────────────────────────────────────────────────┤
│                                              ┌────────────────────┐  │
│ A clear company/team statement               │ Four equal portrait│  │
│ Large editorial promise                      │ placeholders joined│  │
│ Short safe explanation                       │ by route linework   │  │
│ [Find your consultant] [Meet the team]        └────────────────────┘  │
│ Team / multilingual / navigation-only trust boundary                │
├──────────────────────────────────────────────────────────────────────┤
│ “What kind of support are you looking for?”                         │
│ Calm concierge module: one question → progress → explained matches  │
├──────────────────────────────────────────────────────────────────────┤
│ Four-person editorial team sequence, equal visual weight            │
│ [Marina] [Aline] [Virginia] [Beatriz]                               │
├──────────────────────────────────────────────────────────────────────┤
│ Service families as an annotated list, not a repeated card grid     │
├──────────────────────────────────────────────────────────────────────┤
│ Explore → Meet → Plan, with explicit website boundary               │
├──────────────────────────────────────────────────────────────────────┤
│ Trust / testimonial placeholder only when verified                  │
├──────────────────────────────────────────────────────────────────────┤
│ FAQ disclosures                                                     │
├──────────────────────────────────────────────────────────────────────┤
│ Final conversation CTA                                              │
├──────────────────────────────────────────────────────────────────────┤
│ Footer: locales, navigation, contact TODOs, privacy, disclaimer      │
└──────────────────────────────────────────────────────────────────────┘
```

## Homepage — mobile

```text
┌──────────────────────────────┐
│ WORDMARK       EN ▾   Menu   │
├──────────────────────────────┤
│ Editorial promise            │
│ Short explanation            │
│ [Find your consultant]       │
│ Meet the team →              │
│ Four-part team mosaic        │
├──────────────────────────────┤
│ Trust boundary               │
├──────────────────────────────┤
│ Concierge: one question      │
│ Large tap targets            │
│ Back / restart / view all    │
├──────────────────────────────┤
│ Team profiles, alternating   │
│ portrait and copy rhythm     │
├──────────────────────────────┤
│ Services / process / FAQ     │
├──────────────────────────────┤
│ Final CTA + footer           │
└──────────────────────────────┘
```

## Concierge state flow

```text
Start
  → choose preferred consultation language
  → choose broad support category
  → show exact matches with plain-language reason
     ↘ no exact match: neutral message + full team

Every state exposes: Back · Start again · View all consultants
```

The flow never asks about age, nationality, status, points, family details, education, employment history or case narrative.

## Consultant directory

```text
Header → concise team thesis → optional public filters → four equal profiles
→ content-status note for missing facts → final concierge CTA → footer
```

## Consultant profile

```text
Breadcrumb / back
Portrait placeholder + name + verified role status
Languages · services · credentials (verified only)
Biography
What this professional can help with
[Book with consultant] or explicit TODO fallback
Website information boundary
Related team profiles
```

## Service directory and detail

The directory is a scannable editorial index. Detail pages define who the service is generally for, what a professional conversation may cover and which consultants publicly list it. They never claim the visitor qualifies.
