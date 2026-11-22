# Retrofitting an existing site to the current rules

A site built before rules 1.3.x carries the same handful of defects. They are mechanical — no redesign, no
re-layout, no copy rewrite — and they are worth more than a new feature, because they are what search and
accessibility actually measure. This page is the method; the per-repo progress tracking lives in the
private ops repo, not here.

## First, measure

```bash
npm run build                     # must pass before anything is measured
node scripts/check-platform.mjs   # headers, meta, image dims, budgets — copy it from starter/scripts/
curl -sI https://<domain>/ | grep -iE 'strict-transport|content-security|referrer|permissions|x-content-type'
```

Sixty seconds of measurement tells you which batches below are needed. A site passing `check-platform` and
serving the header set does not need this page.

## The batches, in value order

### Batch 1 — five-minute wins (every site)

1. `public/_headers` (Netlify/CF Pages), `vercel.json` (Vercel) or `.htaccess` (Apache/cPanel) with the §18
   set: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP, caching. Delete the
   host files that do not match the real host — a header file for the wrong host never applies.
2. `max-image-preview:large` in the robots meta; `noindex` only on 404 and staging.
3. `color-scheme` plus two `theme-color` values (light/dark).
4. `fetchpriority="high"` on the hero image, never combined with `loading="lazy"`.
5. Remove `overflow-x: hidden` from `html`/`body`; fix the offending element, then assert
   `scrollWidth <= innerWidth` at 390 and 1440.
6. A real skip link to `<main id="main">`.

### Batch 2 — forms and announcements

`autocomplete` tokens on personal fields, correct `type`/`inputmode`, one polite live region for errors and
success, validate on blur and clear on input, honeypot + `reportValidity()`, never a disabled submit button
as validation.

### Batch 3 — overlays onto `<dialog>`

Replace `<div role="dialog">` overlays with the starter's `Lightbox.astro` (or the same shape): `showModal()`,
`::backdrop`, `[open]` states, openers as `<button data-lightbox>`, focus returned on close. Re-test with
`verify-page.cjs`, which asserts `dialog[open]`.

### Batch 4 — images

Raw photo originals belong in `assets/` (or any folder outside `public/`), never on the wire. Generate webp
variants at 400/800/1600, publish a manifest, and render `srcset` + intrinsic `width`/`height` through one
component. A 700 KB JPEG tile becomes 40–180 KB and stops shifting the layout.

### Batch 5 — third parties, measurement, hand-off

Self-host fonts and icon fonts, take libraries from `npm` instead of a CDN, put maps and video behind a
click-to-load facade, then measure: PSI mobile at p75 (LCP / INP / CLS), Rich Results Test, Search Console
sitemap and hreflang.

## Ordering

Batch 1 for every site first — it is the cheapest and it is the one that is missing everywhere. Then batch 3
for sites whose gallery is part of the sell, batch 2 for sites with a real form, batch 4 where photography
dominates. A site with batches 1–2 green is already ahead of most of the sites competing with it.

## Acceptance per site

```bash
npm run build
node scripts/check-platform.mjs   # clean
node scripts/a11y-check.mjs <url>
node scripts/verify-page.cjs <url>
curl -sI https://<domain>/        # headers on the wire, not just in the repo
```

One branch per site, one PR, merge after the gate is green.

## What not to chase

Dark mode, `:has()`, container queries, `content-visibility` on short pages, view transitions, image sitemaps
without a gallery, service workers. None is a ranking or usability requirement for a brochure site; each
costs days. See `WEB-PLATFORM.md` §E.
