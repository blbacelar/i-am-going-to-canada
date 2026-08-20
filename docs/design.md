# Design direction — I Am Going To Canada

This document describes the intended visual system. Treat it as a starting direction that must be reconciled with verified brand assets from the current website.

## Design thesis

Create an editorial digital concierge for a professional Canadian immigration firm: confident enough to feel premium, warm enough to feel human and clear enough to reduce anxiety.

The experience should be distinctive through composition, typography, photography and interaction—not through visual noise.

## Apple-inspired principles

Use:

- ruthless clarity;
- generous negative space;
- precise type hierarchy;
- high-quality imagery;
- calm narrative pacing;
- progressive disclosure;
- subtle, purposeful motion;
- strong responsive execution.

Do not use:

- Apple logos, product language or copied sections;
- literal imitation of Apple.com;
- liquid-glass effects as a default;
- technology-product metaphors unrelated to immigration;
- dramatic effects that reduce trust or performance.

## Visual character

- Editorial rather than corporate-template.
- Human rather than bureaucratic.
- Canadian without flag overload or tourism clichés.
- Modern without startup/SaaS aesthetics.
- Premium without feeling exclusive or inaccessible.

## Provisional palette

Confirm against the current logo before implementation.

| Token | Suggested value | Use |
| --- | --- | --- |
| `canvas` | `#F7F5F0` | warm page background |
| `surface` | `#FFFFFF` | cards and content surfaces |
| `ink` | `#17211D` | primary text |
| `muted-ink` | `#5C6862` | secondary text |
| `forest` | `#183F37` | primary brand anchor |
| `maple` | `#C73932` | controlled CTA/accent |
| `mist` | `#DCE6E1` | separators and quiet surfaces |
| `line` | `#D8D9D4` | borders |

Accessibility overrides aesthetic preference. Adjust values until text and controls meet WCAG AA contrast.

## Typography

- Choose one expressive editorial display family for major headings and one highly readable sans-serif for UI and body copy.
- Prefer self-hosted or privacy-conscious web fonts with appropriate licences.
- Avoid ubiquitous AI defaults unless they genuinely fit the brand.
- Use fluid typography with `clamp()` and test longer French strings.
- Headings should be concise, not oversized merely for spectacle.

## Layout

- Use asymmetric editorial composition selectively.
- Alternate open narrative sections with compact decision-oriented modules.
- Maintain a clear reading path and one dominant action per section.
- Avoid turning every piece of information into a card.
- Consultant cards may use varied editorial cropping while retaining consistent information and accessibility.
- Use a maximum readable content width; do not stretch paragraphs across wide screens.

## Hero direction

The hero should establish the company and the action within seconds:

- short benefit-led headline;
- supporting sentence that avoids legal promises;
- primary CTA: find a consultant;
- secondary CTA: meet the team;
- visual treatment representing the team or the idea of guidance, not Marina alone;
- immediate language clarity.

Possible composition: editorial type on one side, layered four-person portrait system or abstract route/map motif on the other. Until official photos arrive, use neutral silhouette/shape placeholders explicitly labelled for replacement.

## Concierge interaction

- Feel like a calm guided conversation, not a form or eligibility quiz.
- Ask one short question at a time.
- Show progress only if it helps.
- Allow back navigation and restart.
- Explain why a consultant is shown using public attributes such as service, language and availability.
- Always offer “View all consultants”.
- Never communicate a legal recommendation.

## Consultant presentation

Every consultant should have:

- consistent portrait ratio;
- name and verified title;
- short approved introduction;
- languages;
- service categories;
- CTA to profile;
- CTA to book;
- optional verified licence/credential information.

Do not rank consultants by perceived quality. Ordering should be intentional and configurable in JSON.

## Photography

Final photography should share:

- similar lighting and colour temperature;
- complementary backgrounds;
- consistent crop and eye line;
- natural expressions;
- professional but approachable wardrobe;
- enough negative space for responsive compositions.

Placeholders must never depict invented people as if they were the real consultants. Use tasteful blocks, silhouettes or clearly synthetic editorial abstractions.

## Illustration and Canadian cues

Use Canada cues sparingly:

- subtle cartographic linework;
- route or waypoint motifs;
- abstract northern landscape colour fields;
- small maple geometry if compatible with the logo.

Avoid passport stamps, airplanes, suitcases, skylines and repeated maple leaves as generic decoration.

## Motion

- Use motion to reveal relationships or guide the next action.
- Prefer opacity and transform animations.
- Keep durations restrained and easing consistent.
- Avoid scroll hijacking, continuous parallax and heavy shaders.
- Provide reduced-motion alternatives.
- Performance budget takes precedence over spectacle.

## Components

Create a small coherent system:

- header/navigation;
- language switcher;
- primary and secondary buttons;
- editorial link;
- section header;
- consultant card;
- service selector;
- concierge step;
- trust item;
- testimonial;
- FAQ disclosure;
- booking CTA;
- footer.

Components sourced from external libraries must be restyled, license-checked, accessible and performance-tested. Do not paste a component merely because it looks impressive in isolation.

## Anti-pattern checklist

Reject designs containing:

- default purple/blue gradients;
- excessive rounded floating cards;
- random glow effects;
- glassmorphism everywhere;
- meaningless dashboards or charts;
- generic AI copy;
- stock-photo clichés;
- excessive animation;
- low-contrast grey text;
- a hero focused only on Marina;
- a layout that breaks when translated into French.
