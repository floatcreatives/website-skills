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

## 2. `npm run check` reports 99 type errors

`astro check` (strict tsconfig) fails with ~99 errors in the inline client
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

## 4. The Hermes skill copy is older still

`~/.hermes/skills/software-development/brochure-website-astro-tailwind/references/BROCHURE-SITE-RULES.md`
still holds the **2026-07-05** revision (md5 `ea73936e`) — two revisions behind the
canonical file. Reload it from this repo before using the skill.

## 5. Superseded repos

- `CubeSeven/astro-website-base-template` (`square-series`) — an unused redesign
  experiment: no Tailwind, no Swiper, own `src/ui/sections` block library.
  **Zero client projects ever used it.** Archived 2026-10-22.
- `CubeSeven/float-skills`, `CubeSeven/astro-business-template` — superseded by
  this repo.
