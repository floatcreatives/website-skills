# Known gaps

Honest list of where this repo and the rules do not yet agree. Fix, don't ignore.

## 1. `starter/` sliders are not Swiper

`BROCHURE-SITE-RULES.md` §2 / §4.1 name **Swiper** as the slider library, but the
starter's two sliders (`TestimonialsSlider.astro`, `DeliveryAreasSlider.astro`)
are hand-rolled vanilla CSS carousels (`.carousel` / `.carousel-track`). The
`swiper` dependency was **unused** and was removed on 2026-10-22 to keep the
install honest.

Decision needed: either rewrite both sliders on Swiper, or amend §4.1 to say
"vanilla carousels for simple cases, Swiper when the brief needs drag/free-mode/
looped sliders". Today the starter works; it just is not what the rules say.

## 2. `npm run check` reports 98 type errors

`astro check` (strict tsconfig) fails with ~98 errors in the inline client
scripts — DOM nullability (`'carousel' is possibly 'null'`), implicit `any`
params, `.style` on `Element`, plus a few in data files. Concentrated in
`DeliveryAreasSlider.astro` (26), `TestimonialsSlider.astro` (26),
`Header.astro` (18), `Layout.astro` (13).

`npm run build` is clean — 7 pages, sitemap generated. Astro does not typecheck
at build, so this never blocked a deploy, but every project copied from the
starter inherits the debt.

## 3. Rules copies inside projects drift

11 project directories hold a **snapshot** of `BROCHURE-SITE-RULES.md` taken
2026-10-03 (md5 `968d056e`). Once the rules change here, those copies are stale
with no warning. Projects should point at this repo's URL instead of carrying a
copy.

## 4. Stale local rule copies — fixed 2026-11

**Resolved 2026-11-16.** The copy previously named here
(`~/.hermes/skills/software-development/brochure-website-astro-tailwind/`) no longer exists, and no stale
`BROCHURE-SITE-RULES.md` copy remains under `~/.hermes/skills`. The live skill is
`~/.hermes/skills/web/float-website-skills` — deliberately named after this repo, bumped to 1.2.1 with
this change (§0.5 default kit + `references/i18n-bilingual.md`) — and it reads this repo for anything it
does not carry. Its frontmatter `version:` must equal the root `VERSION` file: when the rules change here,
bump `VERSION` and the skill's `version:` in the same change, otherwise a machine silently builds against
an older contract, which is exactly the drift gap 3 describes.

## 5. Superseded repos

- `CubeSeven/astro-website-base-template` (`square-series`) — an unused redesign
  experiment: no Tailwind, no Swiper, own `src/ui/sections` block library.
  **Zero client projects ever used it.** Archived 2026-10-22.
- `CubeSeven/float-skills`, `CubeSeven/astro-business-template` — superseded by
  this repo.

## 6. The starter does not yet pass its own §7.14 detector gate

`npx impeccable detect dist/` on the freshly built starter reports **55 findings**, which means
every new project inherits them. Fixed in the same change that added the gate: two low-contrast
pairs (`white` on `green-600` → `green-700`, `brand-400` on a `brand-500/15` pill → `brand-700`),
two skipped heading levels (contact methods and FAQ questions were `h3` under an `h1`), and the
decorative footer wave is now explicitly waived (`data-impeccable-ignore="marquee"`).

What is left, and why it is a gap rather than a bug list:

- **54 × `cramped-padding`.** Almost all land on card wrappers (`p-8`, `p-6`, `bg-neutral-50`) and
  section shells whose children carry their own inset, so the rule is measuring the wrapper's own
  edge. Needs a human pass with the overlay: either the wrapper genuinely clips a child's text, or
  the finding is noise on a placeholder template. Do not mass-add padding to clear the count.
- **1 × `low-contrast` on a `:hover` state** — the service-card title transitions (`500ms`) to
  `white`/`brand-100` while the background is still `white`, so the computed hover state passes
  through ~1.1:1. Fix is to delay the color transition behind the background, not to change the
  end colours.

Until this passes, state the count when handing a project over rather than reporting the gate as
clean.

## 7. `starter/` carries most of the §0.5 kit, not all of it

**Closed in 1.3.0/1.3.1:** `public/_headers` with the §18 set, `max-image-preview:large`, a two-value
`theme-color` + `color-scheme`, `fetchpriority="high"` and dimensions on the hero, dimensions on every other
`<img>` including the gallery data type, font metric overrides, `text-wrap` defaults, the `overflow-x: hidden`
hack removed, a working native-`<dialog>` lightbox (it previously had **no JavaScript** — markup, styling and
openers, and nothing that opened it), `scripts/check-platform.mjs`, `scripts/fetch-unsplash.mjs`.

**Still open:**

- **No `src/i18n/` scaffold.** §0.5.4 wants a typed dictionary with the default language stubbed against
  `Dict`, so a second language is one file. `SITE.alternateLocales` exists and `hreflang` follows it, but the
  copy is still embedded in `site.config.ts` and `src/data/content/*`.
- **No `scripts/check-third-party.mjs`.** §0.5.5 claims "no cookies, no banner" and that claim is only gated
  if the checker runs in `npm run build`. The script exists in the Hermes skill (`float-website-skills`) and
  needs to move here as the canonical copy.
- **No interaction-loaded map facade.** The contact map is a live Google iframe with `loading="lazy"`;
  §0.5.5 wants a click-to-load facade so nothing third-party loads before consent.
- **Unsplash is a script, not a workflow.** `npm run fetch-images` works, but the `credit` field is only
  rendered by components that opt in, and nothing enforces attribution at build time.

Decision needed: fold the i18n scaffold and the map facade into the starter (one commit, then re-verify the
build), or leave the rules ahead of the starter and say so here until someone does.

## 8. Sites built before 1.3.x carry the conformance debt

No vintage site serves the §18 header set, and most miss `max-image-preview`, `color-scheme`, a skip link,
`autocomplete` tokens and image dimensions. The rules fix this for new builds; older ones need the retrofit
pass described in `RETROFITTING.md`. Progress is tracked privately, not in this repo.
