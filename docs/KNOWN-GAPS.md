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

## 4. Stale local rule copies — fixed 2026-11

The copy previously named here (`~/.hermes/skills/software-development/brochure-website-astro-tailwind/`)
no longer exists. The local agent skill is now `float-website-skills`, deliberately named after
this repo, and its frontmatter `version:` must equal the root `VERSION` file. When the rules change
here, bump `VERSION` and the skill's `version:` in the same change — otherwise a machine silently
builds against an older contract, which is exactly the drift gap 3 describes.

## 5. The starter does not yet pass its own §7.14 detector gate

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
