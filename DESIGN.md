---
name: I Am Going To Canada
description: Calm comparison turns public professional facts into a clear route to conversation.
colors:
  accent: "#2f4b7c"
  accent-hover: "#26406b"
  accent-tint: "#e9eef6"
  accent-border: "#cdd8ec"
  ink: "#171b24"
  ink-2: "#3a4150"
  muted: "#5b6472"
  muted-2: "#6b7280"
  background: "#f6f7f9"
  surface: "#ffffff"
  surface-alt: "#f3f5f9"
  fill: "#eef1f6"
  border: "#e2e6ee"
  verified: "#dcecdf"
  verified-ink: "#2f6b3d"
  pending: "#a2aab8"
  placeholder: "#e7ebf2"
typography:
  display:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(44px, 4vw, 54px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  page-heading:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(38px, 3.5vw, 44px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  section-heading:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(30px, 3vw, 34px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "clamp(22px, 2vw, 24px)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  body-large:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Schibsted Grotesk, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  eyebrow:
    fontFamily: "Space Mono, monospace"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "10px"
  control: "12px"
  field: "14px"
  pill: "999px"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "18": "18px"
  "20": "20px"
  "24": "24px"
  "28": "28px"
  "32": "32px"
  "44": "44px"
  "52": "52px"
  "70": "70px"
  "84": "84px"
  "96": "96px"
  "132": "132px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "13px 22px"
    height: "52px"
  language-selector:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "44px"
  language-selector-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
    height: "44px"
  content-status:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "5px 9px"
  match-reason:
    backgroundColor: "{colors.verified}"
    textColor: "{colors.verified-ink}"
    rounded: "{rounded.pill}"
    padding: "3px 7px"
  concierge-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.field}"
    padding: "clamp(28px, 4vw, 52px)"
---

# Design System: I Am Going To Canada

## Overview

**Creative North Star: "The Calm Comparison Desk"**

The system makes professional choice clearer through calm comparison. Cool slate grounds, white surfaces and one disciplined navy accent create an orderly, contemporary setting in which four consultants can be understood at equal scale. The owner-pinned style reference (seed `f33503b8`) establishes the world; the implemented CSS is normative wherever details diverge.

Clarity comes from compact sans-serif hierarchy, visible public attributes and Space Mono evidence labels—not decorative travel imagery or a personality-first composition. The visitor should understand the team, compare broad services and languages, then continue to a direct professional conversation without mistaking navigation for an eligibility assessment.

**Key Characteristics:**

- Cool slate page grounds with crisp white working surfaces.
- One navy accent for brand, action, links and focus.
- Schibsted Grotesk hierarchy paired with Space Mono evidence labels.
- Four consultants presented with equal visual authority.
- Open comparison layouts, restrained borders and selective depth.
- No decorative travel imagery or invented proof.

## Colors

The palette is deliberately narrow: one institutional navy, cool near-neutrals and two factual status roles.

### Primary

- **Conversation Navy** (`accent`): Buttons, links, brand marks, focus outlines and other high-confidence interaction.
- **Pressed Navy** (`accent-hover`): Hover and pressed response for the primary accent.

### Tertiary

- **Navy Tint** (`accent-tint`): Avatars, compact chips and low-pressure fills.
- **Navy Border** (`accent-border`): Tinted borders, supporting text on dark surfaces and the outer focus halo.
- **Verified Field** (`verified`): Background for a positive public-attribute match reason.
- **Verified Ink** (`verified-ink`): Text paired only with Verified Field.

### Neutral

- **Carbon Ink** (`ink`): Headings, primary reading text and dark section/footer fields.
- **Strong Slate** (`ink-2`): Strong secondary text and TODO status text.
- **Measured Slate** (`muted`): Paragraphs and explanatory copy.
- **Secondary Slate** (`muted-2`): Roles, pending labels and low-emphasis metadata.
- **Cool Ground** (`background`): Default page base.
- **White Surface** (`surface`): Header, cards, labels and high-contrast text on dark fields.
- **Quiet Panel** (`surface-alt`): Alternate section ground and subtle panels.
- **Track Fill** (`fill`): Dividers, tracks and low-emphasis fills.
- **Fine Border** (`border`): Card edges, separators and structural rules.
- **Pending Slate** (`pending`): Pending labels and muted footer copy.
- **Portrait Placeholder** (`placeholder`): Reserved portrait and unavailable-content fields.

### Named Rules

**The One-Navy Rule.** Navy carries brand and action throughout the system; do not introduce a second decorative accent.

**The Factual-Green Rule.** Green is reserved for verified match evidence and never becomes a general brand colour.

## Typography

**Display Font:** Schibsted Grotesk (with sans-serif fallback)
**Body Font:** Schibsted Grotesk (with sans-serif fallback)
**Label/Mono Font:** Space Mono (with monospace fallback)

**Character:** Schibsted Grotesk is clean, compact and calm enough to carry every heading, control and paragraph without shifting into a personality-led editorial voice. Space Mono separates evidence, metadata and system state from persuasive copy.

Schibsted Grotesk loads weights 400, 500, 600, 700 and 800. Space Mono loads 400 and 700.

### Hierarchy

- **Display** (`typography.display`): Compact hero and closing statements; maximum 54px at weight 600.
- **Page Heading** (`typography.page-heading`): Page-level H1; maximum 44px at weight 600.
- **Section Heading** (`typography.section-heading`): Major H2 and concierge questions; maximum 34px at weight 600.
- **Title** (`typography.title`): Consultant names, service titles and FAQ prompts; maximum 24px at weight 600.
- **Body Large** (`typography.body-large`): Introductory and high-priority explanatory copy at 18px.
- **Body** (`typography.body`): Default reading and control copy at 15px; keep long prose near 62–70 characters where composition permits.
- **Eyebrow** (`typography.eyebrow`): Uppercase, letter-spaced evidence, credential, status and progress language in Space Mono at 12px.

### Named Rules

**The Evidence-Voice Rule.** Use Space Mono only when text names evidence, metadata, credential, locale or interface state; all narrative and action copy stays in Schibsted Grotesk.

**The French-Fit Rule.** Heading wraps and controls must accommodate Canadian French without shrinking below the established hierarchy.

## Layout

The wide shell is capped at 1320px with 24px gutters. At 1180px it becomes a 1080px shell with 20px gutters and desktop navigation moves into the mobile disclosure. At 900px, major two-column compositions stack inside a 780px shell with 18px gutters. At 700px, gutters become 14px, content grids collapse and the four-portrait hero remains a 2×2 comparison.

Section spacing is fluid, generally 72–136px vertically. Comparison modules use open grids, horizontal rules and controlled asymmetry rather than enclosing every item in a card. Paragraphs remain readable while wide screens add compositional space. Portraits hold a consistent 4:5 ratio.

**The Equal-Scale Rule.** Marina Snyder, Aline, Virginia Melo and Beatriz Dias receive equal portrait scale and comparable information hierarchy; offset rhythm must not imply rank.

**The Direct-Route Rule.** Every major sequence should move from team understanding to public-attribute comparison to a direct professional conversation.

## Elevation & Depth

The system is flat by default. Depth comes first from Cool Ground, White Surface and Quiet Panel layering, then from fine borders. Only a genuinely floating or interactive layer receives shadow.

### Shadow Vocabulary

- **Floating Panel** (`0 18px 48px rgba(23, 27, 36, 0.12)`): Mobile navigation and the dark concierge panel.
- **Action Lift** (`0 12px 28px color-mix(in srgb, #171b24 16%, transparent)`): Filled actions on hover.
- **Focus Halo** (`0 0 0 2px #cdd8ec`): Secondary halo paired with the 3px navy keyboard-focus outline.

### Named Rules

**The Flat-by-Default Rule.** Use border and tonal contrast for structure; reserve shadow for floating panels and action response.

## Shapes

The main field radius is a restrained 14px, used for portraits, the concierge and large content panels. Buttons and compact image fields use 12px; small labels and contained results use 8–10px. Pills are reserved for language, credential and status metadata. Circles appear only as small wayfinding dots or brand geometry.

Portraits are clipped to 4:5. Fine solid borders indicate normal structure; a dashed 10px-radius border marks unavailable booking or review-dependent content. The overall silhouette stays rectilinear and calm rather than bubbly.

**The Reserved-Pill Rule.** A pill means locale, credential or status—not a generic action.

## Components

### Buttons

- **Shape:** A 12px soft rectangle with a 52px minimum height and 13px × 22px padding; the compact header variant is 42px high.
- **Primary:** Conversation Navy with White Surface text and 700 weight.
- **Hover / Focus:** Move up 2px over 180ms with the expressive ease-out curve, deepen to Pressed Navy and add Action Lift. Keyboard focus uses a 3px navy outline, 4px offset and Focus Halo.
- **Secondary:** An underlined text link with a 6px underline offset; its inline arrow moves 4px on hover.

### Chips

- **Style:** Fully rounded and compact. Content status uses Navy Tint with Conversation Navy text; match reason uses the verified pair; TODO status uses Portrait Placeholder with Strong Slate text.
- **Typography:** Evidence and credential chips use Space Mono, 12px and 700 weight.

### Cards / Containers

- **Corner Style:** Portrait fields and the concierge use 14px corners; result cards use 12px.
- **Background:** Consultant information remains open on Cool Ground. White Surface belongs to portrait labels and discrete surfaces, not a generic wrapper around every profile.
- **Shadow Strategy:** Consultant portraits are flat with a Fine Border. The concierge and mobile menu use Floating Panel.
- **Internal Padding:** The concierge uses fluid 28–52px padding; result cards use 14px.

### Navigation

The sticky header is a solid White Surface with a Fine Border along its bottom edge. Desktop links are 15px and weight 600. At 1180px they move into a 14px-radius surfaced disclosure with Floating Panel. The three-locale selector remains a bordered pill with 44px targets and Space Mono labels; the active locale fills with Conversation Navy.

### Concierge

The concierge is a Carbon Ink decision field with one short question at a time. Choice rows are transparent, at least 68px tall and separated by translucent white rules; hover moves them 8px in the direction of progress. A three-segment progress line uses Conversation Navy for current and completed segments. Results use compact two-column cards and collapse below 700px. The advice boundary remains visible and state changes are announced through `aria-live`.

### Consultant Profile Unit

A profile unit combines a 4:5 bordered portrait, optional credential pill, content-status label, concise description, ruled metadata and direct actions. Portraits scale only to 1.02–1.025 over 450ms. The open layout makes attributes comparable without implying that the profile is a promotional card.

### Service Index and FAQ

Service rows and FAQ disclosures are open lists anchored by horizontal rules. Service rows use a small navy dot and route arrow; FAQ summaries use a navy plus that rotates 45 degrees when open. Both keep generous touch height and Schibsted Grotesk titles.

## Do's and Don'ts

### Do:

- **Do** use cool neutral fields and white surfaces to make public attributes easy to compare.
- **Do** present Marina Snyder, Aline, Virginia Melo and Beatriz Dias with equal visual authority.
- **Do** reserve navy for brand, action, focus and directional cues.
- **Do** use Space Mono for uppercase evidence, credentials, metadata and status.
- **Do** keep `TODO_CONTENT` states and the non-assessment boundary visible.
- **Do** preserve 44px targets, visible keyboard focus and reduced-motion behavior.
- **Do** verify raster provenance before an image ships.

### Don't:

- **Don't** use decorative travel imagery, flag clichés or destination photography as atmosphere.
- **Don't** introduce a personality-first hero or scale one consultant above the team.
- **Don't** introduce a second decorative accent, gradients, glassmorphism or glow effects.
- **Don't** turn every comparison item into a floating rounded card.
- **Don't** invent credentials, testimonials, statistics, services, prices, links or outcomes.
- **Don't** use matching language or route graphics to imply eligibility, approval or predicted success.
