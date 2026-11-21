# Retrofit plan — bringing the 17 shipped sites up to rules 1.3.0

Measured 2026-11-21 against the rules in `BROCHURE-SITE-RULES.md` 1.3.0 and the checklist in
`docs/WEB-PLATFORM.md`. Static scan of every repo's source (no build, no deploy, no live test), so read
"—" as "not found in source", not "definitely absent on the wire".

Rationale: the starter fixes these from now on, but 17 sites were built before the rules existed. The
gaps are mechanical, not architectural — no redesign, no re-layout, no copy rewrite. One file of headers
and a handful of attributes per site.

## Per-site matrix

| Repo | Astro | Header policy | `fetchpriority` | `<dialog>` | `autocomplete` | live region | `max-image-preview` | font metrics | forced-colors |
|---|---|---|---|---|---|---|---|---|---|
| `traditional-skiathos-market` | yes | — | yes | — | — | — | — | — | — |
| `alexandras-villas` | yes | — | yes | — | — | — | — | — | — |
| `seaskiathos` | yes | — | yes | — | — | — | — | — | — |
| `stenaki-apartments` | yes | — | yes | yes | — | yes | yes | yes | — |
| `gravityx-landing` | yes | — | yes | — | — | — | — | — | — |
| `atletico-skiathos` | yes | — | yes | — | — | yes | — | yes | — |
| `kahlua-skiathos` | yes | — | yes | yes | yes | yes | yes | yes | — |
| `supway` | yes | — | yes | yes | yes | yes | yes | yes | — |
| `villa-kriopigadi` | yes | — | yes | — | — | yes | yes | — | — |
| `fish-market` | yes | — | yes | — | — | — | — | — | — |
| `gio-barber-studio` | yes | — | yes | — | yes | yes | — | yes | — |
| `bluehorizon` | yes | — | yes | yes | yes | yes | yes | yes | — |
| `ginfish-website` | yes | — | yes | yes | — | yes | yes | — | — |
| `taverna-stamatis` | yes | — | yes | — | — | — | — | — | — |
| `villa-anemoessa` | yes | — | yes | — | yes | yes | — | — | — |
| `lpl-cars` | yes | — | — | — | yes | yes | — | yes | — |
| `rooms-skiathos` | yes | — | — | — | — | — | — | — | — |

Reading it: **Header policy 0/17** and **forced-colors 0/17** are universal. `fetchpriority` is mostly
there (15/17) because the starter hero carried it. `<dialog>` 5/17 is the only structural item.

## Batches, in value order

Each batch ends with the same acceptance gate for every touched repo:

```bash
npm run build                       # zero errors
node scripts/check-platform.mjs     # copy from website-skills/starter/scripts/ if absent
node scripts/a11y-check.mjs <url>   # axe, from the skill
node scripts/verify-page.cjs <url>  # dialog + interactions
```

One branch per repo (`chore/conformance-1.3.0`), one PR, merge after the gate is green. Never push to
`main` directly.

### Batch 1 — five-minute wins, every repo (~2–3 h total)

The highest score per minute of work. Do it for all 17 before anything else.

1. Copy `starter/public/_headers` into each repo's `public/`. For Vercel repos translate it to
   `vercel.json`; for cPanel repos use the `.htaccess` block that now carries the same CSP. Delete the
   host files that do not match the actual host — a header file for the wrong host is worse than none.
2. Per repo, set `frame-src` to the map provider that site really uses (OSM vs Google) and `form-action`
   to its real form endpoint.
3. Add `max-image-preview:large` to the robots meta in `Layout.astro` (11 sites).
4. `fetchpriority="high"` + `decoding="async"` + width/height on the hero image (`lpl-cars`,
   `rooms-skiathos`).
5. Delete any `overflow-x: hidden` on `html`/`body`, find the real offender (usually a `100vw` box or an
   untransformed overlay), and assert `scrollWidth === innerWidth` at 390 and 1440.
6. `color-scheme` meta + the second `theme-color` value.
7. Verify on the wire: `curl -sI https://<domain>/ | grep -iE 'strict-transport|content-security|referrer|permissions|x-content-type'`.
   Record the output in the repo's `POST-SETUP.md`.

### Batch 2 — forms and announcements (~4 h, 11 repos)

Real WCAG 1.3.5 / 4.1.3 failures, and the fix is attributes, not markup surgery.

1. `autocomplete` tokens on every personal field: `name`, `email`, `tel`, `street-address`, `postal-code`,
   `organization`.
2. Correct `type`/`inputmode` (`tel`, `email`, `numeric` for codes; never `number` for phone/postcode).
3. One polite live region per page; errors move into it; on success focus moves to the confirmation.
4. Validate on blur / submit, clear on input; remove any "disable submit until valid" logic.
5. Honeypot present, `reportValidity()` called, labels tied with `for`/`id` and hints via
   `aria-describedby`.

### Batch 3 — overlays on `<dialog>` (12 repos, ~15–25 min each after 1.3.1)

The only item that touches markup, so it gets its own batch and its own gate. Since 1.3.1 there is a
reference implementation, which halves the work: copy `starter/src/components/Lightbox.astro` instead of
writing the overlay again.

1. Replace the existing overlay root with that component (same visual design: counter, caption, thumbs,
   arrows, close). Keep the project's classes, take the markup and the script.
2. Convert the openers to real buttons: `<div class="js-gallery-item">` → `<button type="button"
   data-lightbox data-index="0">`. The gate clicks `[data-lightbox]`; a div leaves keyboard users nothing.
3. Move the overlay styles from the old root to `dialog.lightbox-overlay`, `::backdrop` and `[open]`;
   delete the `.active` class rules.
4. Re-test with `verify-page.cjs` (it asserts `dialog[open]`) plus a manual pass: open, tab inside, ESC,
   focus returned to the trigger, backdrop click closes, the image click does not.

**Three sites are not the same job:**

| Site | State | Work |
|---|---|---|
| `lpl-cars` | overlay markup exists, **no script opens it** — the gallery is dead | take the component and the openers; this one is a bug fix, not a refactor |
| `alexandras-villas`, `rooms-skiathos` | no lightbox at all | add the component, or decide the grid is the gallery and document the choice |
| the other 12 | working div overlays | the four steps above |

Do the two live, client-facing sites first (`bluehorizon`, `atletico-skiathos`), then the rest.

### Batch 4 — font metrics and CLS leftovers (~2 h, 10 repos)

1. Add the `size-adjust` / `ascent-override` fallback `@font-face` from `starter/src/styles/theme.css`.
2. Confirm every `<img>` has numeric width/height (gallery data types included).
3. Reserve the map iframe box with `aspect-ratio`; it already has a class height on most sites.

### Batch 5 — measurement and hand-off (~2 h, deployed sites only)

1. PSI mobile for each deployed URL; paste p75 LCP / INP / CLS into that repo's `POST-SETUP.md`.
2. Rich Results Test on home + one interior page per site.
3. Search Console: sitemap submitted, no hreflang or canonical errors; the sites that emit `hreflang="el"`
   while only English exists (`seaskiathos`, `gio-barber-studio`, `gravityx-landing`, `supway`,
   `villa-kriopigadi`) will show exactly that error — fix by emitting hreflang only for built locales.
4. Anything over the §9.7.6 weight budget gets a named owner and a fix date, not a shrug.

## Ordering by business value

1. `atletico-skiathos` (public sponsor guide), `bluehorizon` (live, has a domain), `seaskiathos`
   (largest codebase, 878 files).
2. `supway`, `stenaki-apartments`, `ginfish-website`, `kahlua-skiathos`, `gio-barber-studio` — built
   recently, so batch 1 closes most of it.
3. The villa and market sites (`alexandras-villas`, `villa-anemoessa`, `villa-kriopigadi`,
   `traditional-skiathos-market`, `fish-market`, `taverna-stamatis`, `rooms-skiathos`, `lpl-cars`,
   `gravityx-landing`) — same batches, lower traffic.

## Not in scope (deliberate)

- Dark mode, `:has()`, container queries, `content-visibility`, view transitions, image sitemaps, service
  workers. None is a ranking or usability requirement here; each costs days (see `docs/WEB-PLATFORM.md` §E).
- Rewriting copy or re-art-directing pages. If a site fails the §19 content floor (fabricated reviews,
  thin locality pages), that is a separate conversation with the client, not a retrofit.

## Effort

| Batch | Work | Estimate |
|---|---|---|
| 1 | all 17 | 2–3 h |
| 2 | 11 repos | ~4 h |
| 3 | 12 repos (component now exists) | 3–5 h |
| 4 | 10 repos | ~2 h |
| 5 | deployed sites | ~2 h |
| **Total** | | **≈ 1.5 focused days** |

## Tracking

Add one checkbox block per repo to `float-devops` (or this file) with the five batch rows; tick only when
the acceptance gate ran on that repo. A repo with green batches 1–2 is already ahead of 90 % of the
websites competing with these clients.

---

## Addendum — what 1.3.1 changed for this plan

- **Batch 3 got cheaper and safer.** `starter/src/components/Lightbox.astro` is a working native-`<dialog>`
  gallery (open, next, prev, thumbs, arrow keys, ESC, backdrop, swipe, focus return). Copy it. The old
  starter overlay was markup with no script — do not copy that shape into another repo.
- **`npm run check:platform`** now exists; add it to each site's `scripts/` and run it after every batch.
  It fails on a lazy hero, missing dimensions, a missing header policy, missing `max-image-preview`, a
  second `h1`, positive `tabindex`, and images over 400 KB.
- **Courses of action that no longer apply:** adding GLightbox or Swiper's lightbox module. One `<dialog>`,
  zero dependencies.
