# Implementable visual system

## Direction

An editorial digital concierge: calm Canadian institutional clarity softened by the warmth and pacing of an independent international magazine. The memorable device is a route line connecting four equal consultant fields—guidance as orientation, not prediction.

## Tokens

| Token | Value | Role |
| --- | --- | --- |
| `canvas` | `#F4F1E9` | Warm paper-like page ground |
| `surface` | `#FCFBF7` | Raised and interactive surfaces |
| `ink` | `#17211D` | Primary text |
| `muted-ink` | `#53615B` | Secondary text, AA against light grounds |
| `forest` | `#183F37` | Anchor field and primary controls |
| `forest-deep` | `#0E2C27` | Footer and high-contrast surfaces |
| `maple` | `#B93530` | Controlled action/accent |
| `maple-dark` | `#8E2623` | Hover/focus-safe dark accent |
| `mist` | `#DCE6E1` | Quiet section ground |
| `sky` | `#C9DDE2` | Cool route/map field |
| `line` | `#CBD2CD` | Dividers |

## Typography

- Display: Fraunces, variable optical serif loaded through `next/font`.
- Body/UI: Manrope, limited to required variable weights through `next/font`.
- H1: fluid `clamp(3rem, 7vw, 6rem)`, maximum 0.98 line-height and restrained tracking.
- H2: fluid `clamp(2.25rem, 4.2vw, 4.5rem)`.
- Body measure: 65–72 characters; base 1rem with 1.65 line-height.
- French copy determines minimum control width and navigation breakpoint.

## Shape and depth

- Editorial fields use square or softly rounded 14px corners; pills are reserved for language/status controls.
- Use a border or a shadow, not both. Shadows have vertical offset and soft neutral blur.
- Portrait placeholders use a consistent 4:5 ratio, quiet tonal blocks and an explicit replacement label. They never depict invented people.
- Route linework is crisp SVG geometry, not decorative maps, passports or travel icons.

## Spacing

Use a 4px base with principal steps 8, 12, 16, 24, 32, 48, 72, 96 and 144px. Sections alternate expansive narrative spacing and tighter decision modules. Heading top space always exceeds heading-to-body space.

## Motion

One authored entrance animates the route line and team fields in sequence while content remains visible by default. Controls use short 160–220ms state transitions. No continuous parallax or scroll hijacking. Reduced motion removes translation, route drawing and smooth scrolling.

## Interaction

- Primary button: solid forest or maple depending on surface contrast; 48px minimum height.
- Secondary button: editorial underlined link or quiet outline, never a competing filled pill.
- Focus: 3px maple/cream dual ring with visible offset.
- Selection, scrollbar, underline offset and disclosure markers use the same palette.
- Concierge changes announce through an `aria-live` region.

## Responsive composition

- 375px: single-column reading order; four portrait fields remain a 2×2 team mosaic in the hero.
- 768px: compressed two-column passages where copy length allows.
- 1024px+: asymmetric hero split and alternating editorial sections.
- 1440px: max content width about 1320px; paragraph measure remains fixed.

## Content states

- `TODO_CONTENT` is styled as an explicit review badge and plain-language explanation, never hidden as polished factual copy.
- Missing Calendly links render a disabled booking action plus a safe team/contact fallback.
- Empty matches render all consultants and explain that the site did not find an exact public-metadata match.
- `TODO_LEGAL_REVIEW` stays visible on review builds.
