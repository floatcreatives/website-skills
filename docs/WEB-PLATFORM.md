# Web-platform conformance — what "perfect according to Google" actually means

Source of the rules in §9, §9.7, §18 and §19. Kept here so the contract stays short and this stays
checkable. Reviewed 2026-11-21 against:

| Source | What it decides |
|---|---|
| `github.com/GoogleChrome/modern-web-guidance` (210 expert-vetted guides, 17 categories) | platform craft: LCP/INP/CLS mechanics, forms, accessibility, security, modern CSS |
| `web.dev/articles/vitals` | the numbers: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, at p75, mobile** |
| Google Search Essentials (`/search/docs/essentials` + `/technical`) | eligibility: Googlebot not blocked, page works, content indexable |
| `/search/docs/appearance/page-experience` | CWV + HTTPS + mobile display + no excessive ads + no intrusive interstitials |
| `/search/docs/specialty/international/localized-versions` | hreflang + `x-default` |
| `/search/docs/appearance/google-images` | image discovery, filenames, alt, image sitemap, `max-image-preview` |
| `/search/docs/appearance/structured-data/review-snippet` | why a business may not mark up its own reviews |
| `web.dev/baseline` | what "safe to use without a fallback" means |

Two hard truths from reading all of it:

1. **modern-web-guidance contains no SEO and no CWV thresholds.** Agent guidance and ranking guidance are
   different documents; a build that follows only one is half-conformant.
2. **Every guide that matters is a DON'T.** The failures are not missing features, they are six reflexes:
   lazy-loading the hero, hiding overflow instead of fixing it, shipping no headers, dimming contrast for
   aesthetics, silencing focus rings, and validating a form by disabling its button.

---

## A. Indexability (Search Essentials)

- Googlebot not blocked — `robots.txt` allows, no stray `Disallow`, no `noindex` inherited from staging.
- Page returns 200 with real content in the HTML (not an empty shell waiting for JS).
- Unique title 15–60 chars, unique description 50–160, one `h1`, no skipped levels.
- Self-referencing canonical, trailing-slash consistent; 404 has none.
- Sitemap with `lastmod`, submitted in Search Console; every page linked from nav/footer.
- `max-image-preview:large`; descriptive image filenames; image sitemap when the gallery sells the place.
- hreflang for built locales only, plus `x-default`; never an alternate pointing at the same URL.
- Rich Results Test clean on the deployed URL.
- No doorway pages, no duplicate intros, no invented ratings/awards (spam policies, not style).

## B. Core Web Vitals

| Metric | Bar (p75, mobile) | The build decision that decides it |
|---|---|---|
| LCP | ≤ 2.5 s | hero image in raw HTML, `fetchpriority="high"`, never lazy, `srcset`+`sizes`, AVIF/WebP, ≤ 200 KB |
| INP | ≤ 200 ms | one delegated passive listener per concern, rAF-throttled, tasks sliced at ~50 ms, transform/opacity only |
| CLS | ≤ 0.1 | width/height or `aspect-ratio` on every media box, font metric overrides, no injected content above the fold |

Field data beats lab data. Lighthouse is a diagnostic; PSI/CrUX is the verdict. Numbers go in
`POST-SETUP.md` or the site is unverified.

## C. Accessibility (WCAG 2.2 AA, and usable)

Skip link, one `<main>`, landmarks, heading order, `lang`, `scroll-margin-top`; `:focus-visible` never
removed, no positive `tabindex`, no visual reordering of interactive content; 44×44 targets; alt text that
describes purpose; colour never the only signal (and survives `forced-colors`); labels + `autocomplete`
tokens + `inputmode`; validate on blur, clear on input, one polite live region, never a disabled submit as
validation, never block paste; native `<dialog>` for overlays; `prefers-reduced-motion` honoured; layout
survives 200 % zoom and 320 px.

## D. Security and privacy

HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, CSP with `frame-ancestors 'none'`,
`base-uri 'none'`, `object-src 'none'`; SRI on any third-party; no `innerHTML` with data; no PII in
`localStorage`; cookieless analytics only; click-to-load facades for maps/video/embeds; no `no-store` on
HTML (it kills bfcache); no `unload` handlers.

## E. What we deliberately do not chase

Included so nobody re-litigates it every build. None of these is a ranking or usability requirement for a
brochure site, and each one costs days:

- `:has()`, container queries, `content-visibility` on short pages, view-transition chains, scrollytelling,
  WebGL/canvas effects, WebMCP/Web AI, passkeys, service workers, speculative prerendering.
- A dark palette (the `color-scheme` meta and a dark `theme-color` are required; a second design is not).
- Perfect Lighthouse 100 — the field metrics are the gate.
- Image sitemaps on sites without a real gallery page.
- Polyfills for Baseline-widely features.
