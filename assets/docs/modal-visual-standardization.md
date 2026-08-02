# Modal Visual Standardization — Plan for a Later Pass

Prep material for refactoring `.modal-media-col` into a single reusable
"visual box" component. Written after fixing two bugs (Animask's blank
images, Sillyville/Treehouse's cropped embeds) that both traced back to
the same root problem: every media type in the modal system has its own
bespoke, hand-duplicated CSS override instead of sharing one pattern, so
fixes and resets get applied to some types and forgotten on others.

**Do not start this as a drive-by.** It touches the HTML of every modal
on the page. Treat it as its own reviewed pass, with visual regression
screenshots of every modal at desktop width (≥1024px) before and after.
A prior attempt at fixing just two of these modals in one sitting made
things worse and had to be reverted — this refactor is a bigger version
of that same risk surface.

## Why: the current architecture

Desktop (`≥768px`, the "no-scroll two-column" mode, styles.css ~1603-1745):

```
.modal                         flex column (header + body)
 └─ .modal-body--two-col       flex row: 5fr info / 7fr media
     ├─ .modal-info            scrollable text column
     └─ .modal-media-col       flex column, gap:0.75rem, overflow:hidden
          └─ one bespoke "visual slot" type, individually patched
             to flex:1; min-height:0 so it fills the column
```

There is no shared visual-box component. Six different content types
live in `.modal-media-col`, each retrofitted for flex sizing separately:

| Type | Class(es) | Desktop reset present? |
|---|---|---|
| Bare image | `<img>` direct child | Yes — `object-fit: contain` |
| Single video | `.modal-video` | Partial — flexed, but had no `object-fit` until this pass |
| Figma embed | `.figma-embed-container` (+ `--portrait` variant) | Yes — `height:auto; padding-bottom:0` |
| Vimeo/Sketchfab embed | `.game-embed-container` (used bare, or nested inside `.sketchfab-embed-wrapper`) | **Was missing** the same reset `.figma-embed-container` got — this was the Sillyville/Treehouse bug, fixed 2026-08-02 |
| Image carousel | `.carousel` / `.carousel__track` / `.carousel__slide` | Yes — track/slide/img re-flexed |
| Two-image grid | `.game-image-grid` > `.game-image-container` > `.gameplay-image` | **Was missing** `align-items: stretch` on the grid — this was the Animask bug, fixed 2026-08-02 |

Two bugs so far have been the exact same mistake — a reset applied to
one embed type and forgotten on its sibling type — because there's no
single source of truth for "how a visual fills its share of the column."

## Full inventory of modals and what they currently use

So the migration has a concrete checklist. (Modal ids as in `index.html`.)

| Modal id | Media content today | Notes |
|---|---|---|
| `Tidalflow` | 1 bare `<img>`, inline `style=` duplicating `.modal-media-col > img` rules | Inline styles instead of relying on the shared class |
| `RoyalRacers` | `.figma-embed-container` + `<a class="figma-fallback-btn">` sibling | Fallback link lives as an unflexed sibling, not inside the embed box |
| `KaijuBattle` | `.figma-embed-container--portrait` + inline-styled `<p>` note + fallback link | Note paragraph uses raw inline styles for what is effectively a caption |
| `ASPCA` | `.figma-embed-container--portrait` + fallback link | — |
| `HandsOffMyHoard` | `.figma-embed-container` (+ likely fallback link, verify) | — |
| `BugabooPlanet` | `.figma-embed-container` + fallback link + `.carousel` (6 slides) | Two visuals stacked (embed, then carousel) — currently NOT split evenly; the carousel just flows below with its own `margin-bottom`, not sharing the column via flex:1/flex:1 |
| `RoomsTooSmall` | `.carousel` only | — |
| `Animask` | `.game-image-grid` (2 images) | Fixed 2026-08-02 (`align-items: stretch`) |
| `VedalonPrimer` | `.figma-embed-container` (+ likely fallback/PDF link, verify) | — |
| `MascotAnimation` | `.modal-video` + `.game-image-container` (with `.image-caption` footer) as two direct flex children | Already an ad hoc precedent for a "visual + caption footer" pattern — worth reusing its idea (a real footer slot) rather than its implementation |
| `IncidentInSillyville` | `.modal-video-comparison` > two `.modal-video-col`, each with a `.modal-video-label` title + either `.modal-video` or `.game-embed-container` | Fixed 2026-08-02 (`game-embed-container` reset + `object-fit` on video). Closest existing thing to the proposed title/media pattern — has a title, no footer |
| `CreepyLilTreehouse` | `.sketchfab-embed-wrapper` > `.game-embed-container` + inline-styled attribution `<p>` with link | Attribution paragraph is a footer CTA in spirit, done with inline styles |
| `ShonenFighterTTRPG` | 1 bare `<img>`, inline `style=` | Same pattern as Tidalflow |

Recurring smells across the inventory, independent of the flex bug:
- Inline `style="..."` attributes duplicating rules that already exist as classes (`Tidalflow`, `ShonenFighterTTRPG`, the KaijuBattle note, the Treehouse attribution).
- CTA links (`figma-fallback-btn`, "View on Sketchfab") are unflexed siblings dropped into `.modal-media-col`, not part of any visual's box — so they can't reliably become a "footer under this specific visual" once a modal has 2+ visuals (see BugabooPlanet, which has an embed *and* a carousel but no shared-space logic between them).

## The proposed component

```
.modal-visual                  flex: 1; min-height: 0;
 ├─ .modal-visual__title       optional. Fixed-height label above the media
 │                             (generalizes .modal-video-label)
 ├─ .modal-visual__media       flex: 1; min-height: 0; position: relative;
 │                             — the actual img/video/iframe goes here
 └─ .modal-visual__footer      optional. Fixed-height CTA row below the media
                                (generalizes figma-fallback-btn / image-caption /
                                the Sketchfab attribution paragraph)
```

`.modal-media-col` becomes just:

```css
.modal-media-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* unchanged */
}
```

with N `.modal-visual` children — 1 visual fills 100% of the column, 2
split 50/50, 3 split into thirds, automatically, via plain `flex: 1` on
each `.modal-visual`. No per-count wrapper class (no more
`.game-image-grid` vs `.modal-video-comparison` as separate concepts —
they become "a `.modal-media-col` with 2 `.modal-visual` children").

### Sizing rule inside `.modal-visual__media` (one rule for every media kind)

- **Raster media** (`img`, `video`, animated `gif`): `width: 100%; height: 100%; object-fit: contain;` directly on the element.
- **Iframe embeds** (Figma, Vimeo, Sketchfab): `.modal-visual__media { position: relative; }` + `iframe { position: absolute; inset: 0; width: 100%; height: 100%; }`. No padding-bottom aspect-ratio hack anywhere — flexbox owns the sizing, which is exactly the class of bug this eliminates.
- **Carousel**: the whole carousel (track + controls) sits inside one `.modal-visual` as a self-contained flex column already (see existing `.carousel` desktop rules) — `.carousel__track` maps to `__media`, `.carousel__controls` maps to `__footer`. Minimal change needed here since the carousel already has the right internal shape.

### Migration directives (for the future pass)

1. Add the new `.modal-visual` / `__title` / `__media` / `__footer` rules to styles.css; do not delete the old classes yet.
2. Convert one modal type at a time, screenshot before/after at desktop width, and only then delete that modal's old bespoke CSS block:
   - Start with `IncidentInSillyville` (already closest to the target shape — has a title today).
   - Then `Animask`'s `.game-image-grid` (2 visuals, no title/footer needed).
   - Then `CreepyLilTreehouse` and single-embed modals (`RoyalRacers`, `KaijuBattle`, `ASPCA`, `HandsOffMyHoard`, `VedalonPrimer`, `BugabooPlanet`'s Figma half) — this is also the point to move each modal's fallback link (`figma-fallback-btn`) into `.modal-visual__footer` instead of leaving it as a loose sibling.
   - Then `MascotAnimation` (video + image, 2 visuals — migrate `.image-caption` into `.modal-visual__footer`).
   - Then `BugabooPlanet`'s embed+carousel combination and `RoomsTooSmall`'s carousel-only case.
   - Finally the two bare-image modals (`Tidalflow`, `ShonenFighterTTRPG`) — also an opportunity to drop their inline `style=` attributes in favor of `.modal-visual__media img` defaults.
3. Once every modal is migrated, delete the now-dead CSS: `.game-image-grid`, `.game-image-container`, `.gameplay-image`, `.modal-video-comparison`, `.modal-video-col`, `.modal-video-label`, `.figma-embed-container` (+ `--portrait`), `.game-embed-container`, `.sketchfab-embed-wrapper`, and all of their desktop-mode overrides in the `@media (min-width: 768px)` block.
4. Re-screenshot every one of the 13 modals at desktop width as a final regression pass (see inventory table above for the full list) before calling it done.

## Reference

This plan follows the color-audit doc's precedent of living in
`assets/docs/` as prep material rather than in the codebase itself. See
`assets/docs/color-audit.md` for the sibling document from the palette
revamp pass.
