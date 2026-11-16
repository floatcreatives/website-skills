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

**Resolved 2026-11-16.** The old path
`~/.hermes/skills/software-development/brochure-website-astro-tailwind/` no longer exists, and no stale
`BROCHURE-SITE-RULES.md` copy remains under `~/.hermes/skills`. The live skill is
`~/.hermes/skills/web/float-website-skills` (permanent name, bumped to 1.2.1 with this change, §0 default
kit + `references/i18n-bilingual.md`), which reads this repo for anything it does not carry.

## 5. Superseded repos

- `CubeSeven/astro-website-base-template` (`square-series`) — an unused redesign
  experiment: no Tailwind, no Swiper, own `src/ui/sections` block library.
  **Zero client projects ever used it.** Archived 2026-10-22.
- `CubeSeven/float-skills`, `CubeSeven/astro-business-template` — superseded by
  this repo.

## 6. `starter/` does not yet carry the §0.5 kit

§0.5 (added 2026-11-16) makes these mandatory on every build, and the starter still ships none of them:

- **No `src/i18n/` scaffold.** §0.5.4 wants a typed dictionary with `en.ts` stubbed against `Dict`, so a
  second language is one file. Every project currently invents its own shape, which is how the seam gets
  skipped.
- **No `scripts/check-third-party.mjs`.** §0.5.5 claims "no cookies, no banner" and that claim is only
  gated if the checker runs in `npm run build`. The script exists in the Hermes skill
  (`float-website-skills`) and needs to move here as the canonical copy.
- **No `public/robots.txt`** with a sitemap line, and `sitemap()` is called without the `i18n` block that
  §0.5.4 requires once a second locale exists.
- **No skip link / `<main id="main">`** and no `scroll-margin-top` on anchor targets (§0.5.3).

Decision needed: fold these into the starter (one commit, then re-verify the build), or leave the rules
ahead of the starter and say so here until someone does. The rules lead; the starter does not follow yet.
