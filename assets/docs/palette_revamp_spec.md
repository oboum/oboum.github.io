# Palette Revamp — "Bold and Calm"

Migration spec from the all-green palette (see `color-audit.md`) to a deep teal + warm sand + burnt-orange scheme. Structured to mirror the audit 1:1: every selector that had an old value gets a named new value below. Built so a straight token swap in `:root` plus six specific literal fixes closes every flagged issue.

## Why this fixes the contrast failures structurally

The old sidebar green (`#388659`) sits at medium lightness, so no near-white text color could clear 4.5:1 on it. The new sidebar teal (`#133A3A`) is dark enough that plain white text clears **12.4:1** — the failure mode can't recur even if a future edit reuses the wrong variable, because there's no medium-lightness trap to fall into.

## New root palette

```css
:root {
  /* Primary — teal (was: all-green ramp) */
  --first-color: #133A3A;          /* sidebar, headings, primary CTA */
  --first-color-dark: #0D2B2B;     /* hover states, sub-headings */
  --first-color-darken: #081C1C;   /* footer bg, eyebrow/subtitle text */
  --first-color-light: #BFDAD8;    /* tag/border backgrounds on light surfaces */
  --first-color-lighter: #9FC7C2;  /* skill-tag background (8.2:1 with dark-teal text) */

  /* Neutrals — collapsed from 3 near-whites down to 3 intentional roles */
  --bg-page: #F2EBDD;              /* page background (was --first-color-lighten's bg role) */
  --bg-alt-section: #EAE2D1;       /* alternating section bg (was --section-alt-bg) */
  --surface-card: #FFFFFF;         /* elevated cards/carousel/modal (was stray #f5f5f5 + literal white) */

  /* Text */
  --text-color: #22201B;           /* body text, warm near-black */
  --white-color: #FFFFFF;          /* NOW DEFINED — nav text, footer text, close icon, skill-tag:hover text */

  /* Accent — new hue, didn't exist in the old palette at all */
  --accent-color: #D97D3D;         /* CTA backgrounds, active filter state, badges */
  --accent-color-dark: #9C4A1B;    /* body links — 4.78:1 worst case (on --bg-page), 6.16:1 on white cards; accent-color alone only hits 3:1 */
  --accent-color-darker: #7A4015;  /* link hover state */
  --accent-color-light: #F2A65E;   /* nav hover/active text on teal sidebar — 6.1:1 */
}
```

## Sidebar / nav — the flagged section

| Element | Selector | Old (failing) | New | Ratio |
|---|---|---|---|---|
| Sidebar background | `.nav__menu` | `--first-color` `#388659` | `--first-color` `#133A3A` | — |
| Default nav link | `.nav__link` | `--first-color-lighten` (3.7:1) | `--white-color` `#FFFFFF` | **12.4:1** |
| Hover / active nav link | `.nav__link:hover`, `.nav-active` | `--text-color` (2.1:1) | `--accent-color-light` `#F2A65E` | **6.1:1** — also now visually distinct from the default state instead of relying on the same near-white |
| Mobile close icon | `.nav__close` | `--first-color-dark` (1.4:1) | `--white-color` `#FFFFFF` | **12.4:1** |
| Mobile toggle icon | `.nav__toggle` | `--first-color-dark` on `--first-color-lighten` | `--first-color-dark` on `--bg-page` | fine, unchanged relationship |
| Mobile top bar bg | `.l-header` | `--first-color-lighten` | `--bg-page` | — |

## The `--white-color` bug

`--white-color` is now defined (`#FFFFFF`). `.skill-tag:hover { color: var(--white-color); }` will resolve correctly. **Confirm at implementation time** that `.skill-tag:hover`'s background is dark enough for white text — pair it with `--first-color-dark` if the hover-fill rule needs setting explicitly, since the audit didn't specify what the hover background itself is.

## Headings

| Selector | Old | New |
|---|---|---|
| `.section-title`, `.home__title`, `.modal-header .title` | `--first-color` | `--first-color` `#133A3A` |
| `.section-subtitle` (eyebrow) | `--first-color-darken` | `--first-color-darken` `#081C1C` |
| `.about__information-title`, `.skills__subtitle`, `.contact__subtitle`, `.about__current-title`, `.about__current-content h4`, `.modal-body h3`, `.modal-video-label` | `--first-color-dark` | `--first-color-dark` `#0D2B2B` |

## Body text

| Selector | Old | New |
|---|---|---|
| `body`, `.about__current-content p`, `.carousel__caption`, `.image-caption` | `--text-color` `#3e4756` | `--text-color` `#22201B` |
| `a` (general links) | `--text-color` | `--accent-color-dark` `#9C4A1B` — this is the "genuinely blank canvas for a second accent" the audit flagged; links get their own hue instead of inheriting body text color. **Verified against `--bg-page`, not just white cards** — the sand background is slightly darker than white, and an earlier draft of this value (`#A8551F`) only cleared 4.44:1 there, just under AA. This value clears 4.78:1 in that worst case. |

## Accent / CTA

**Contrast note:** white text on `--accent-color` (`#D97D3D`) only reaches ~3:1 — fails standard AA text contrast, only passes for large/bold text. White text on `--accent-color-dark` (`#9C4A1B`) reaches 6.16:1, safe at any size. So the *darker* orange is the default filled state, and the *brighter* orange is reserved for the hover state, where a transient interaction affordance carries lower accessibility stakes.

**Verify before shipping:** `.button__light` is grouped in the table below with `.button`'s white-on-accent text treatment, but the name suggests it may be a lighter or outline variant (possibly used on the dark hero section as a secondary CTA). If its actual background is light or transparent rather than accent-colored, white text would be wrong there — confirm its real background before applying this row to it.

| Selector | Old | New | Note |
|---|---|---|---|
| `.button`, `.works__filter-btn.filter-active`, `.modal-link-btn:hover`, `.carousel__btn`, `.home__social-link`, `.footer__link`, `.about__current-icon` (bg) | `--first-color` | `--accent-color-dark` `#9C4A1B` | default filled state — safe contrast for white text at any size |
| `.button:hover`, `.carousel__btn:hover` (bg) | `--first-color-dark` | `--accent-color` `#D97D3D` | hover state — brighter, more energetic pop on interaction |
| `.home__social-link:hover` (bg) | `--first-color-darken` | `--accent-color-darker` `#7A4015` | |
| `.button`, `.button__light`, `.works__filter-btn.filter-active` (text) | `--first-color-lighten` | `--white-color` `#FFFFFF` | |
| `.home__social-link`, `.footer__link` (text) | `--first-color-light` | `--white-color` `#FFFFFF` | |

## Badges & tags

| Selector | Old | New |
|---|---|---|
| `.skill-tag` (bg) | `--first-color-lighter` | `--first-color-lighter` `#9FC7C2` |
| `.skill-tag` (text) | `--first-color-dark` | `--first-color-dark` `#0D2B2B` |
| `.about__current-tag` (bg) | `--first-color-light` | `--first-color-light` `#BFDAD8` |
| `.about__current-tag` (text) | `--first-color-darken` | `--first-color-darken` `#081C1C` |

## Modal chrome

| Selector | Old | New |
|---|---|---|
| `.modal` (border) | `--first-color-dark` | `--first-color-dark` `#0D2B2B` |
| `.modal-header` (border-bottom) | `--first-color` | `--first-color` `#133A3A` |
| `.modal-info`, `.modal-link-btn`, `.figma-embed-container` | `--first-color-light` | `--first-color-light` `#BFDAD8` |
| `.modal-media-col` (bg) | `--section-alt-bg` | `--bg-alt-section` `#EAE2D1` |
| `.modal`, `.modal-header` (bg) | literal `white` | `--surface-card` `#FFFFFF` |

## Footer

| Selector | Old | New |
|---|---|---|
| `.footer`, `.footer__container` (bg) | `--first-color-darken` | `--first-color-darken` `#081C1C` |
| `.footer` (text) | `--first-color-lighten` | `--white-color` `#FFFFFF` |
| `.footer__copy` (text) | `--text-color` (see note) | `--white-color` `#FFFFFF` |

**Possible carry-over bug:** the audit grouped `.footer__copy` under "Body text" with `--text-color`, the same dark color used for regular page paragraphs. But `.footer__copy` is very likely a child of `.footer`, which has a dark background — if so, that's dark text on a dark background (roughly 1:1 contrast, effectively invisible), a fourth failure the original audit didn't catch because it wasn't scoped to check text against the footer background specifically. Routing it to `--white-color` here is the safe assumption; **confirm `.footer__copy`'s actual parent/background before implementing** in case it turns out to sit on a lighter nested element instead.

## Surfaces & neutrals — the 3-near-whites consolidation

| Old | Role | New |
|---|---|---|
| `--first-color-lighten` `#ecebe4` (`body` bg) | page background | `--bg-page` `#F2EBDD` |
| `--section-alt-bg` `#f0efea` (only 4 units off the one above) | alternating section bg | `--bg-alt-section` `#EAE2D1` |
| literal `#f5f5f5` (`.game-image-container`, `.gameplay-image`, `.carousel`) | elevated surface | `--surface-card` `#FFFFFF` |
| literal `white` (`.about__current-card`, `.carousel__controls`) | elevated surface | `--surface-card` `#FFFFFF` |

Now three genuinely distinct roles instead of three near-duplicate off-whites: page < alt-section < card, in that lightness order.

## Hardcoded literals — won't move with a `:root` edit alone

| Location | Old literal | New value |
|---|---|---|
| `.home__button::before` gradient, stop 1 | `#388659` | `#133A3A` (or reference `var(--first-color)` directly if the gradient syntax allows it) |
| `.home__button::before` gradient, stop 2 | `#2f6e4a` | `#0D2B2B` (`var(--first-color-dark)`) |
| `.modal-body a:link` | `#388659` | `#9C4A1B` (`var(--accent-color-dark)`) — plain `--accent-color` fails AA for normal-size link text (3:1) on the white modal body, this darker step clears 6.16:1 |
| `.modal-body a:hover` | `#2f6e4a` | `#7A4015` (`var(--accent-color-darker)`) |
| `.works__category-badge` | `rgba(38,84,58,.88)` | `rgba(8,28,28,.88)` (matches `--first-color-darken` at the same opacity) |
| `.works__data` | `rgba(62,71,86,.85)` | `rgba(34,32,27,.85)` (matches new `--text-color` at the same opacity) — worth switching to `color-mix(in srgb, var(--text-color) 85%, transparent)` while touching this rule, so it stops drifting from the token going forward |

## Implementation notes for Claude Code

1. Replace all 8 `:root` custom properties with the new palette block above, plus add the three new tokens (`--bg-page`, `--bg-alt-section`, `--surface-card`, `--accent-color*`).
2. Apply the six hardcoded-literal fixes individually — a `:root` edit alone won't touch these.
3. Re-run a contrast check specifically on `.nav__link`, `.nav__link:hover`/`.nav-active`, and `.nav__close` against the new `--first-color` teal before calling this done — those are the three that were structurally broken, not just re-themed.
4. Confirm `.skill-tag:hover`'s background rule explicitly (set it to `--first-color-dark` if unset) now that `--white-color` resolves.
5. Confirm `.footer__copy`'s actual parent/background before applying `--white-color` to it — see the note under Footer.
6. Confirm `.button__light`'s actual background before applying the white-text row to it — see the note under Accent / CTA.
