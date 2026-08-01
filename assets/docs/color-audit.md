# Color Audit — oboum.github.io

Every color value declared in `assets/css/styles.css`, grouped by where it renders on the page. Built to give a palette revamp a clean starting point: what's a real design token today, what's a stray hardcoded value, and where existing text already fails contrast.

## Root palette (`:root`)

All 8 custom properties are shades of the same green.

| Token | Hex |
|---|---|
| `--first-color` | `#388659` |
| `--first-color-dark` | `#2f6e4a` |
| `--first-color-darken` | `#26543a` |
| `--text-color` | `#3e4756` |
| `--first-color-light` | `#d6e6dc` |
| `--first-color-lighten` | `#ecebe4` |
| `--first-color-lighter` | `#c8ddd2` |
| `--section-alt-bg` | `#f0efea` |

## ⚠ Contrast flags — text on the green sidebar

The sidebar (`.nav__menu`) fills with `--first-color` (`#388659`). Three text/icon colors sit on top of it — none clear WCAG AA (4.5:1 normal text).

| Element | Foreground on `#388659` | Selector | Ratio | Verdict |
|---|---|---|---|---|
| Default nav links | `--first-color-lighten` `#ecebe4` | `.nav__link` | 3.7:1 | Fails AA (16px bold doesn't qualify as "large text") |
| Hover / active nav link | `--text-color` `#3e4756` | `.nav__link:hover`, `.nav-active` | 2.1:1 | Fails AA — the "you are here" state is the least legible |
| Mobile menu close icon | `--first-color-dark` `#2f6e4a` | `.nav__close` | 1.4:1 | Fails AA — near-invisible |

**Bonus bug (not the sidebar, same root cause of "green on green"):** `.skill-tag:hover { color: var(--white-color); }` — `--white-color` is never defined in `:root`. The invalid `var()` is dropped, so hover text silently stays `--first-color-dark` against the tag's own green hover-fill. Same 1.4:1 failure as the close icon, but caused by a missing token, not a deliberate choice.

## Sidebar / nav

| Token / value | Hex | Selector | Property | Note |
|---|---|---|---|---|
| `--first-color` | `#388659` | `.nav__menu` | background | desktop rail + mobile flyout |
| `--first-color-lighten` | `#ecebe4` | `.nav__link` | color | ⚠ flagged, 3.7:1 |
| `--text-color` | `#3e4756` | `.nav__link:hover`, `.nav-active` | color | ⚠ flagged, 2.1:1 |
| `--first-color-dark` | `#2f6e4a` | `.nav__close` | color | ⚠ flagged, 1.4:1 |
| `--first-color-dark` | `#2f6e4a` | `.nav__toggle` | color | fine — sits on `--first-color-lighten` (mobile header), not the sidebar |
| `--first-color-lighten` | `#ecebe4` | `.l-header` | background | mobile top bar, not the sidebar itself |

## Headings

| Token | Hex | Selector |
|---|---|---|
| `--first-color` | `#388659` | `.section-title`, `.home__title`, `.modal-header .title` |
| `--first-color-darken` | `#26543a` | `.section-subtitle` (eyebrow above every section title) |
| `--first-color-dark` | `#2f6e4a` | `.about__information-title`, `.skills__subtitle`, `.contact__subtitle`, `.about__current-title`, `.about__current-content h4`, `.modal-body h3`, `.modal-video-label` |

## Body text

| Token | Hex | Selector |
|---|---|---|
| `--text-color` | `#3e4756` | `body`, `a`, `.about__current-content p`, `.carousel__caption`, `.image-caption`, `.footer__copy` |

## Accent / CTA

| Token / value | Hex | Selector | Note |
|---|---|---|---|
| `--first-color` | `#388659` | `.button`, `.works__filter-btn.filter-active`, `.modal-link-btn:hover`, `.carousel__btn`, `.home__social-link`, `.footer__link`, `.about__current-icon` | background |
| `--first-color-dark` | `#2f6e4a` | `.button:hover`, `.carousel__btn:hover` | background hover |
| `--first-color-darken` | `#26543a` | `.home__social-link:hover` | background hover |
| `--first-color-lighten` | `#ecebe4` | `.button`, `.button__light`, `.works__filter-btn.filter-active` | text |
| `--first-color-light` | `#d6e6dc` | `.home__social-link`, `.footer__link` | text |
| literal `#388659` | `#388659` | `.home__button::before` (gradient) | ⚠ hardcoded, not `var(--first-color)` |
| literal `#2f6e4a` | `#2f6e4a` | `.home__button::before` (gradient) | ⚠ hardcoded, not `var(--first-color-dark)` |

## Badges & tags

| Token / value | Hex | Selector | Note |
|---|---|---|---|
| `--first-color-lighter` | `#c8ddd2` | `.skill-tag` | background |
| `--first-color-dark` | `#2f6e4a` | `.skill-tag` | text |
| `--first-color-light` | `#d6e6dc` | `.about__current-tag` | background |
| `--first-color-darken` | `#26543a` | `.about__current-tag` | text |
| literal `rgba(38,84,58,.88)` | — | `.works__category-badge` | ⚠ a fourth dark-green, one-off, not tied to any token |
| literal `#fff` | `#ffffff` | `.works__category-badge` | text |

## Modal chrome

| Token / value | Hex | Selector | Note |
|---|---|---|---|
| `--first-color-dark` | `#2f6e4a` | `.modal` | border |
| `--first-color` | `#388659` | `.modal-header` | border-bottom |
| `--first-color-light` | `#d6e6dc` | `.modal-info`, `.modal-link-btn`, `.figma-embed-container` | border / background |
| `--section-alt-bg` | `#f0efea` | `.modal-media-col` | background |
| literal `#388659` | `#388659` | `.modal-body a:link` | ⚠ hardcoded, not `var(--first-color)` |
| literal `#2f6e4a` | `#2f6e4a` | `.modal-body a:hover` | ⚠ hardcoded, not `var(--first-color-dark)` |
| literal `white` | `#ffffff` | `.modal`, `.modal-header` | background |

## Footer

| Token | Hex | Selector | Property |
|---|---|---|---|
| `--first-color-darken` | `#26543a` | `.footer`, `.footer__container` | background |
| `--first-color-lighten` | `#ecebe4` | `.footer` | text |

## Surfaces & neutrals

| Token / value | Hex | Selector | Note |
|---|---|---|---|
| `--first-color-lighten` | `#ecebe4` | `body` | page background |
| `--section-alt-bg` | `#f0efea` | `.skills.section`, `.works.section` | ⚠ only 4 units off `--first-color-lighten` — nearly indistinguishable |
| literal `#f5f5f5` | `#f5f5f5` | `.game-image-container`, `.gameplay-image`, `.carousel` | ⚠ a third near-white, unrelated to either token above |
| literal `white` | `#ffffff` | `.about__current-card`, `.carousel__controls` | background |

## Overlays & shadows

| Value | Selector | Note |
|---|---|---|
| `rgba(0,0,0,.5)` | `#overlay` | modal backdrop |
| `rgba(62,71,86,.85)` | `.works__data` | ⚠ this is `--text-color` at 85% opacity, hardcoded rather than referencing the token |
| `rgba(0,0,0, .05–.2)` | box-shadow, ~9 rules | cards, buttons, modal, skill-tags, carousel |
| `rgba(255,255,255,.6)` | `.home__button::after` (gradient) | CV-button shine sweep |

## Notes for the revamp

1. **Fix or drop `--white-color`.** Referenced once (`.skill-tag:hover`), defined nowhere. Pick the actual token for that hover state when the new palette lands, or it stays broken under any color scheme.
2. **Three text/icon colors need new values, not just a new hue.** All three sidebar failures held under the *old* green too, so the failure is structural (values too close in lightness), not incidental — re-check contrast for the link default, hover/active state, and close icon specifically against whatever replaces the sidebar color.
3. **Six hardcoded colors won't move with the palette.** `#388659` / `#2f6e4a` appear as literals in the CV-button glow and the modal body-link colors; `#fff`/`white` and one `rgba()` stand in for text/surface tokens in five more spots. A revamp that only edits `:root` will miss all of these.
4. **Three near-white neutrals are doing overlapping jobs:** `--first-color-lighten` (`#ecebe4`), `--section-alt-bg` (`#f0efea`, only 4 units off), and a bare `#f5f5f5` used in card/carousel surfaces. Worth collapsing to one or two intentional neutrals.
5. **Every accent value in the file is a shade of the same green.** Headings, CTAs, badges, and links all draw from the same 4-step ramp (`--first-color` → `--first-color-darken`) — there's no secondary hue anywhere. A new scheme has a genuinely blank canvas for a second accent.

---
*Source: `assets/css/styles.css`. Companion interactive version published as a Claude artifact on 2026-08-01.*
