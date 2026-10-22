# Brochure Website — AI Agent Rule File

> **Portability note:** This file is IDE/agent-agnostic. If your environment prefers a
> specific filename, copy these contents verbatim into that file:
> - opencode → `AGENTS.md` (or `.opencode/rules/*.md`)
> - Claude Code → `CLAUDE.md`
> - Cursor → `.cursor/rules/*.mdc` or `.cursorrules`
> - Windsurf → `.windsurfrules`
> - Continue → `.continue/config.json` rules array
> - GitHub Copilot → `.github/copilot-instructions.md`
>
> Keep the original `BROCHURE-SITE-RULES.md` in the repo root as the source of truth
> and symlink/copy where your tooling expects it.

---

## 0. What this file is

A portable contract for building **static brochure websites** (Astro + Tailwind CSS v4).
Target projects: local businesses, restaurants, clinics, shops, villas, studios,
small service companies — typically 3–15 pages, mostly static, contact/WhatsApp-driven.

**Trigger:** If the user says **"start"**, **"begin"**, or opens a new brochure-site
request without details, immediately run §1 (Project kickoff protocol) before any code.
Do not wait for a detailed brief — ask the questions from §1 first.

When the agent detects a new project request that matches this shape, **load and obey
this file before writing any code.** It exists to:

1. Reduce hallucination by spoon-feeding the exact patterns the project expects.
2. Cut token usage by removing the need to re-derive decisions per session.
3. Guarantee that every interactive feature actually works end-to-end on first build.

If anything in here conflicts with a user's explicit instruction, the user wins —
but the agent should flag the conflict and ask before deviating.

---

## 1. Project kickoff protocol (run automatically on first task)

Before any code is written or files are created, the agent **MUST** run this interview.
Skip any phase the user already answered in their initial brief/design drop.

If no strategic brief is provided, the agent should draft a 1-paragraph competitive/
positioning brief after step 0, get a quick OK, then continue. The brief — not the
boilerplate — drives section choice, persona CTAs, and SEO keywords.

### Step 0 — Inputs inventory
Ask, in one message:
- A strategic brief / description of the business? (paste or path)
- **Any reference links the agent can scrape?** (Google Maps place link, Facebook page,
  TripAdvisor, existing old website, Instagram, Menu/price list URL, etc.) — the agent
  fetches these and auto-extracts name, address, phone, hours, geo coordinates, rating,
  review snippets, service list and social handles so the user doesn't retype them
  (see §7.13). **Do not skip this ask** — it saves ~80% of Phase B/C typing.
- **A design reference?** The agent should *suggest* the user provide a **`design.md` file**
  (Google's DESIGN.md token spec — palette, typography, spacing, radii, shadows). If the user
  doesn't have one, point them to a template. Accepted forms (any one is enough):
  - A `design.md` file path — read it as the **single source of truth** for design tokens;
    it **overrides** the §7.3 defaults. Validate before use.
  - An image, mood-board, screenshot, competitor URL, or Figma link
  - Or **"you decide"** — the agent derives tokens from the brief per §7.3
  - **Conflict rule:** `design.md` wins for tokens; the brief wins for content/voice.
  - **Validation:** if a provided `design.md` is malformed, the agent **refuses to build**
    and returns a one-line fix request before any code is written.
- An images folder path? (logo + photos) — if none, agent uses grey placeholders first,
  then offers to pull contextual stock from Unsplash (see §7.12)
- A brand palette? (hex codes, reference site, or "you decide")
- A font preference? (or "you decide")
- An **Unsplash API access key**? (optional — get one free at
  https://unsplash.com/oauth/applications. If provided, agent fetches contextual stock
  photos matched to the brief; if not, agent uses grey placeholders + flags them in
  POST-SETUP.md for later swap.)
- A design-attitude pick, one word: **sharp/editorial** (square corners, hairline
  dividers, restrained ornament) or **soft/rounded** (chips, capsules, friendly).
  Default per brief — leisure/premium defaults to sharp editorial. Asking this one
  question prevents a full visual rework later.

### Phase A — Identity & scope
- Business name, short tagline, one-line description (for SEO meta)
- Website URL (or placeholder)
- Primary language + any secondary languages (multilingual = extra work, confirm)
- List of pages wanted (suggested menu: Home, About, Services/Products, Gallery,
  Contact, FAQ, Blog — user picks which)
- Scope tag: `brochure` | `multi-page` | `multi-language`

### Phase B — Business facts
- Phone (display + raw), email, WhatsApp number
- Full street address (street, locality, region, postal, country)
- Geo coordinates (lat, lng) — needed for map + schema
- Opening hours (display text + schema format `Mo,Tu,We,Th,Fr,Sa,Su 08:00-23:30`)
- Service areas (list of neighbourhoods/regions served)
- Social links (Facebook, Instagram, others — empty = skip)
- Year established, price range symbol

> **Hard-mandatory contact facts.** If the reference link does not provide email,
> WhatsApp and the exact location pin, ask the user directly in the same message —
> never ship a placeholder for a fact the brief implies exists (email, phone,
> WhatsApp, exact coordinates). For the pin, prefer a Google Maps place link from
> the user; it is the authoritative geo source. If none is given and you resolve a
> text address via Nominatim, SHOW the resolved lat/lng to the user for
> confirmation before building (Nominatim returns "nearest place" approximations).
> Placeholders are only allowed for fields the user explicitly said do not exist.

### Phase C — Content
- Services or product categories (name + 1-line description each, or "skip → placeholders")
- Testimonials: Google review link, TripAdvisor link, manual list, or "skip"
- FAQ Q&A pairs, or "skip"
- Blog yes/no (blog requires `src/data/content/blog.ts` + `/blog/` route)

### Phase D — Assets
- Logo SVG path (or skip → agent generates a placeholder via **logoipsum**,
  https://shape-creator.logoipsum.com — see §7.14). Never invent a fake logo mark
  yourself; always use logoipsum so the placeholder is recognisable and clearly
  interchangeable by the designer later.
- Images folder path (agent will run the image pipeline on it)
  - If empty → ask: "Want me to fetch contextual stock from Unsplash? If yes, paste
    your Unsplash access key (free at https://unsplash.com/oauth/applications)."
  - If yes → store in `.env` as `UNSPLASH_ACCESS_KEY`, run `npm run fetch-images`
    with brief-derived queries (see §7.12).
  - If no/empty → agent generates grey SVG placeholders for every image slot
    (hero, gallery, services, about, OG) so the build passes and layout is correct.
- Brand primary hex (or "use neutral default, agent picks accent")
- If the agent cannot visually inspect images (no vision model): DO NOT guess which
  photo fills which slot. Generate a numbered contact sheet from the image folder and
  ask the client for sheet-numbers-per-slot (or direct URLs) for hero, about, and
  each tile/galley position. Until answered, use folder order as an explicitly
  flagged assumption in POST-SETUP — never present guessed mappings as final.

### Confirm before coding
Print a one-paragraph plan: page list, major sections per page, third-party libraries
to add (with one-line justification each), estimated file structure. Get explicit user OK.

Then, and only then, scaffold.

---

## 2. Hard-lock core stack (non-negotiable defaults)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output) | Best DX for content sites, zero JS by default |
| CSS | **Tailwind CSS v4** (via `@tailwindcss/vite`) | Token-friendly, no class-name sprawl |
| Slider/carousel | **Swiper** (`swiper` pkg) | Mature, responsive, a11y-aware, works without React |
| Icons | **astro-icon** + one icon set (lucide / iconify) | Single import path, tree-shaken SVGs |
| Sitemap | **@astrojs/sitemap** | official Astro integration, builds `sitemap-index.xml` |
| Language | TypeScript, `as const` data files | typed content, autocomplete for handoff |
| Fonts | Self-hosted `.woff2` with `font-display: swap` + unicode-range | fast, private, no Google Fonts CLS/legal issues |
| Images | Script-generated responsive `.webp`/`.avif` variants | never ship raw 5 MB JPEGs |
| Node | `>=22.12.0` (pin in `package.json` `"engines"`) | matches toolchain |

**Do not substitute these without a stated, user-approved reason.**

### 2.1 Versions — always latest stable, never copied from old projects

This file intentionally pins **no dependency versions**, so it cannot go stale. Follow this protocol at scaffold time so new projects never start on old versions:

1. **Verify before writing `package.json`:** run `npm view <pkg> version` for every dependency (astro, tailwindcss, @tailwindcss/vite, swiper, lucide-react, @astrojs/sitemap, etc.) and use what npm reports **today**.
2. **Never copy version ranges** from an older project, from agent memory, or from a tutorial — they are stale by definition.
3. **Newer major wins:** if a package's latest is a higher major than the stack table implies, use the new major and read its migration notes if `npm run build` complains.
4. **TypeScript stays on the newest 6.x** while `@astrojs/check` declares `typescript@^5.0.0 || ^6.0.0`; do not jump to 7.x until `@astrojs/check` supports it.
5. **Keep the starter templates current too:** when a dependency releases a new major, upgrade it in the base template and re-run `npm run build` + a dev-server smoke test **before** scaffolding new client projects from it. A stale template is a stale project.

### 3. Extendable — but with justification

The agent MAY add mature, well-supported libraries when they materially serve the brief.
Always: document *why* in one line, verify it works with Astro static output, ensure
`npm run build` stays clean, prefer zero-JS or SSR-friendly options.

Pre-approved usual suspects (agent can pick without re-asking):
- **Leaflet + OpenStreetMap** for maps (replace Google Maps embed if privacy/offline matters)
- **GLightbox / spot-lightbox / swiper lightbox module** for galleries
- **Framer Motion** only inside hydrated framework islands; for pure static,
  prefer vanilla `IntersectionObserver` (see §7 patterns)
- **Web3Forms / Formspree / Netlify Forms** for contact forms (no backend)
- `@astrojs/rss` for blog feed; `astro-pagefind` for on-site search if requested
- `sharp` / `@squoosh/lib` for image processing scripts

Reject any library that is unmaintained (>18 months no release), untyped with no
`@types/*`, or pulls runtime React/Vue base into a static site for decoration only.

---

## 4. Must-work interactive contract

Every interactive feature below must **work end-to-end on the first build**, on mobile
and desktop, keyboard + touch. "Looks fine" is not enough — click through every state.

For each, two columns: **Behaviour (hard rule)** and **Recommended lib (soft default)**.

### 4.1 Sliders / carousels
- **Behaviour:** autoplay by default; pause on hover and on `prefers-reduced-motion`;
  responsive breakpoints (1 slide mobile, more on wider); keyboard arrows; swipe on
  touch; pagination dots clickable; no layout shift on resize; loop wraps cleanly;
  pagination/dots reflect actual count.
- **Library:** Swiper (use bundle import, init in inline `<script>` after the swiper
  container). Reference pattern in §7.

### 4.2 Static image gallery → lightbox
- **Behaviour:** clicking any gallery image opens a full-screen overlay; overlay shows
  the larger image (or full-res); prev/next arrows; caption from alt text; close on
  ESC, overlay-click, and X button; swipe left/right and up-to-dismiss on touch;
  body scroll locked while open; restored focus on close; respects reduced motion.
- **Library:** GLightbox for larger galleries (>20 images) or when touch-swipe/zoom
  is needed. Vanilla zero-dependency lightbox (§7.6b) for smaller galleries — lighter
  bundle, no npm dependency. Swiper's lightbox module if Swiper is already loaded.
  See §7.6 for both patterns.

### 4.3 Mobile menu
- **Behaviour:** hamburger toggle; overlay covers screen; links stagger in; body
  scroll locked; closes on link click, ESC, and overlay-click-outside; focus trap
  inside while open; restored focus to trigger on close; *no JS animation conflict
  with scroll-reveal* (see §7 — the convention is to force `data-motion` visible inside
  `#mobile-menu` via CSS).
- **Library:** vanilla JS + CSS classes (no library needed). See §7.7 for the full
  pattern including all anti-bug rules.

### 4.4 Accordions (FAQ, "read more")
- **Behaviour:** smooth height transition (use the `grid-template-rows: 0fr → 1fr`
  trick, not `max-height`); single-open or multi-open mode (per project); keyboard
  accessible (button + aria-expanded); chevron rotates; only one transition runs at a
  time per item to avoid jank.
- **Library:** vanilla. See §7.

### 4.5 Scroll-reveal
- **Behaviour:** elements with `data-motion` or `data-animate` start hidden + offset;
  IntersectionObserver toggles a `.visible` class; stagger via `--motion-delay` style;
  **always visible by default if `prefers-reduced-motion: reduce`**; never block
  content above the fold from being read while JS loads (use a no-JS fallback).
- **Library:** vanilla `IntersectionObserver`. Pattern in §7.

### 4.6 Click-to-call / WhatsApp
- **Behaviour:** all phone/WhatsApp/email links pull from `SITE.business.contact.*` —
  never hardcoded numbers; WhatsApp links use `https://wa.me/<raw>` with optional
  pre-filled `?text=`; phone uses `tel:<raw>`; email `mailto:`.
- **Library:** none.

### 4.7 Forms
- **Behaviour:** client-side validation (required, email format, min length); success
  state replaces the form on submit; error states inline per field; no backend code —
  integrate a static provider (Web3Forms/Formspree) or a `mailto:` fallback.
  - Required fields are a brief decision, never a blanket: message/notes fields are
   OPTIONAL by default unless the client says otherwise, and the required set lives
   in a data file, not scattered `required` attributes. After any edit that touches a
   multi-line inline script, run `npm run build` immediately — string-patching out a
   branch commonly leaves unbalanced braces.
- **Library:** vanilla; provider SDK only if needed.

### 4.8 Maps
- **Behaviour:** embed without API key where possible; lazy-loaded (only on user
  scroll-near or click); responsive aspect; coordinates pull from `SITE.business.geo`.
- **Library:** OpenStreetMap embed (privacy) or Google Maps embed; Leaflet only if
  interactive pins/auth needed.

---

## 5. Brochure section menu (the *menu*, not the *recipe*)

The agent chooses which sections each page needs based on the brief. **Visual design
of every section is project-specific and the agent's creative responsibility.** This
list is the menu the agent may pull from — never assume all are needed, never omit
one the brief requires.

- `Hero` — primary message + primary + secondary CTA (often background image/video).
- `Features` / `Why us` — 3–6 differentiators with icons.
- `About` — story, photo, trust signals, year established, certifications.
- `Services` / `Product categories` — grid or list of offerings.
- `Gallery` — grid + lightbox (always lightbox if >1 image).
- `Stats` — 3–5 numeric counters (years, products, hours, customers).
- `Testimonials` / `Reviews` — slider or grid, star rating visible.
- `Delivery areas` / `Service areas` — map + list (local service businesses).
- `FAQ` — accordion list (6–10 items optimal for SEO).
- `CTA band` — repeated between sections; varies by persona.
- `Contact` — form + map + NAP + hours + click-to-call.
- `Blog` — optional cards list + post page (only if user confirmed).
- `Breadcrumbs` — every interior page.
- `404` — friendly, on-brand, with links.
- `Privacy / Terms` — placeholder text if user opted out of legal review.

---

## 6. Content is data-driven (the handoff rule)

**All site content lives in `src/data/` as typed `as const` exports.** Components,
layouts, and pages never hardcode business strings (name, phone, hours, services).
This is what makes a project handoff editable by a non-developer.

### Mandatory structure
```
src/data/
  site.config.ts          # SITE object — identity, contact, hours, nav, seo, schema generators
  content/
    services.ts           # service / product categories
    testimonials.ts       # reviews (with rating, source, body)
    faq.ts                # Q&A pairs
    gallery.ts            # image paths + alt text + (optional) credit + placeholder flag (see §7.12)
    blog.ts               # only if blog confirmed
```
Each `gallery.ts` entry shape (extends to all image-bearing sections):
```ts
{ src: '/images/hero.webp', alt: 'Skiathos harbour at sunset',
  w: 1600, h: 900, placeholder: false,                // true while grey/SVG (§7.12 Tier 1)
  variants?: { src: string, w: number }[],            // responsive srcset, generated by process-images.mjs
  credit?: { name: string, url: string } }            // required if image is from Unsplash (§7.12 Tier 2)
```

### `SITE` object must include (shape, not exact keys — adapt to brief)
- `name`, `shortName`, `tagline`, `description`, `url`, `language`, `locale`
- `languages[]` (only if multilingual)
- `business.{legalName, alternateName, yearEstablished, priceRange, address, geo,
  contact.{phone.{display,raw}, email, whatsappUrl}, hours.{display,shortDisplay,schema},
  social, serviceAreas[], trustSignals[]}`
- `seo.{titleSuffix, defaultDescription, defaultOGImage, themeColor, author}`
- `nav.main[]`, `nav.footer[]`
- `rating.{value, best, count}`
- `reviews[]`
- `maps.{openStreetMap, googleMaps}`
- `heroImage`, `logoPath`

### Schema generators (export functions, not inline JSON)
- `generateBusinessSchema()` — `LocalBusiness` or relevant subtype
- `generateWebsiteSchema()` — `WebSite` + potential `SearchAction`
- `generateContactSchema()` — `ContactPoint` + hours
- `generateBreadcrumbSchema(items)`
- `canonicalUrl(path)`

See §7 for canonical templates — do not improvise JSON-LD by hand, hallucinated
schemas break Google's console silently.

---

## 7. Reference patterns (copy-paste starting points, not hardcoded design)

These are **behaviour only** — the agent may restyle freely but the structure
should stay close to avoid re-deriving working solutions.

### 7.1 Folder structure convention
```
/
  public/
    fonts/                # self-hosted woff2
    images/               # processed web gallery + hero
    logo.svg
    favicon*.{png,svg}
  src/
    components/           # one .astro per component (PascalCase)
    layouts/Layout.astro
    pages/                # one .astro per route; blog/[slug].astro if blog
    styles/
      global.css          # @import "tailwindcss"; + tokens import + base + keyframes + component classes
      theme.css           # @theme { --color-*, --font-*, --animate-* }
    data/                 # see §6
    utils/                # helpers (e.g., formatPhone)
  scripts/
    setup.mjs             # optional non-interactive config generator
    process-images.mjs    # responsive webp/avif pipeline
    dev.sh                # background dev server (setsid + disown)
  astro.config.mjs
  package.json
  tsconfig.json
  AGENTS.md → copy of BROCHURE-SITE-RULES.md
```

### 7.2 astro.config.mjs minimal shape
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://example.com',           // MUST be real eventually — affects sitemap/canonical
  integrations: [sitemap(), icon()],
  vite: { plugins: [tailwindcss()] },
});
```

### 7.3 Tailwind v4 token file (`src/styles/theme.css`)
Register brand color scale, fonts, animations as `@theme` tokens so they become
Tailwind utilities (`bg-brand-500`, `font-sans`, `animate-float`).

**If a validated `design.md` was provided in §1 (Step 0), read all tokens from it —**
it becomes the **single source of truth** for palette, type scale, spacing, radii,
and shadows. The pattern below shows the expected shape; fill from `design.md` values.

**If no validated `design.md`**, exact hex / font names are the agent's creative decision
per brief. Pattern:
```css
@theme {
  --color-brand-50: color-mix(in srgb, var(--brand-base) 5%, white);
  /* ...50–950 via color-mix... */
  --color-brand-500: var(--brand-base);

  --font-family-sans: 'Inter', sans-serif;   /* self-hosted, see §7.4 */

  --animate-shimmer: shimmer 2s ease-in-out infinite;
  --animate-float:    float 3s ease-in-out infinite;
  /* keyframes defined in global.css */
}
```
Components use tokens — never raw hex inside `.astro`.

### 7.4 Font self-host pattern
For each weight + subset needed:
```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, ...;
}
```
Add matching `<link rel="preload" as="font" type="font/woff2" crossorigin>` in
`Layout.astro` **for the regular + bold weights only** (avoid over-preloading).

### 7.5 Swiper init pattern (works inside Astro static)
```astro
---
import 'swiper/css';
import 'swiper/css/pagination';
---
<div class="swiper" data-swiper>
  <div class="swiper-wrapper">
    <div class="swiper-slide">…</div>
  </div>
  <div class="swiper-pagination"></div>
</div>
<script>
  import Swiper from 'swiper';
  import { Pagination, Autoplay, Keyboard, A11y } from 'swiper/modules';
  document.querySelectorAll('[data-swiper]').forEach(el =>
    new Swiper(el, {
      modules: [Pagination, Autoplay, Keyboard, A11y],
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      keyboard: { enabled: true },
      pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
      slidesPerView: 1,
      breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    }));
</script>
```
Wrap autoplay init in a `matchMedia('(prefers-reduced-motion: no-preference)')` check,
otherwise leave the slider static (still scrollable).

### 7.6 Lightbox patterns

Two options — pick based on gallery size and feature needs. Both are tested and work
on first build.

**Decision:** vanilla (7.6b) for <20 images. GLightbox (7.6a) if you need touch-swipe,
zoom, video embeds, or galleries >20 images.

#### 7.6a GLightbox (external library)

```astro
---
import 'glightbox/dist/css/glightbox.min.css';
---
<a href={img.full} class="glightbox" data-gallery="gallery" data-title={img.alt}>
  <img src={img.thumb} alt={img.alt} loading="lazy" width={img.w} height={img.h} />
</a>
<script>
  import GLightbox from 'glightbox/dist/js/glightbox.min.js';
  const lb = GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  // ESC, overlay-click, swipe already built in
</script>
```

#### 7.6b Vanilla zero-dependency lightbox (recommended default)

Prefer this for most brochure galleries — no npm dependency, ~80 lines of JS,
full keyboard + mouse + touch support. Tested across every brochure site built
from this rule file.

**Critical CSS warning — must read before implementing:**

Astro scopes `<style>` tags inside `.astro` components by appending a hash to class
names. If the lightbox overlay is rendered in markup (or created by JS and appended
to `document.body`), it sits outside the component's scoped DOM tree — scoped CSS
rules **will not match** the overlay elements. The overlay will exist in the DOM but
stay invisible (`opacity:0; visibility:hidden`) with no way to toggle it.

**The fix:** lightbox overlay styles MUST live in `src/styles/global.css` (or any
non-scoped `.css` file imported as a module). Component-local `<style>` tags are
only safe for styles that apply to elements *inside* the component's own rendered
output (e.g., the gallery grid, the thumbnail strip scrollbar). The overlay itself
(visibility, opacity, image transition, caption transition) goes in global CSS.

**Step 1 — Global CSS** (`src/styles/global.css`):

```css
.lightbox-overlay {
  transition: opacity 0.35s ease, visibility 0.35s ease;
  opacity: 0;
  visibility: hidden;
}
.lightbox-overlay.active {
  opacity: 1;
  visibility: visible;
}
.lightbox-image {
  transition: opacity 0.35s ease, transform 0.35s ease;
  opacity: 0;
  transform: scale(0.92);
}
.lightbox-overlay.active .lightbox-image {
  opacity: 1;
  transform: scale(1);
}
.lightbox-caption {
  transition: opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s;
  opacity: 0;
  transform: translateY(10px);
}
.lightbox-overlay.active .lightbox-caption {
  opacity: 1;
  transform: translateY(0);
}
```

**Step 2 — `Lightbox.astro` component:**

```astro
---
interface Props {
  images: { src: string; alt: string }[];
}
const { images } = Astro.props;
const imageData = JSON.stringify(images);
---
<!--
  Overlay is rendered in markup (not dynamically created by JS).
  Default state: opacity:0, visibility:hidden.
  JS toggles .active class to show/hide.
-->
<div id="lightbox" class="lightbox-overlay fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
     role="dialog" aria-modal="true" aria-label="Image gallery lightbox"
     data-images={imageData}>

  <button id="lb-close"
    class="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center
           rounded-full bg-white/10 hover:bg-white/20 text-white transition
           hover:scale-110 active:scale-95"
    aria-label="Close lightbox">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
         stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round"
         d="M6 18L18 6M6 6l12 12"/></svg>
  </button>

  <div id="lb-counter"
    class="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full
           bg-white/10 text-white text-sm font-medium backdrop-blur-md">
    1 / {images.length}
  </div>

  <div id="lb-caption"
    class="lightbox-caption absolute bottom-24 left-1/2 -translate-x-1/2 z-10
           max-w-2xl px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-md text-white
           text-sm text-center"></div>

  <button id="lb-prev"
    class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10
           sm:w-12 sm:h-12 flex items-center justify-center rounded-full
           bg-white/10 hover:bg-white/20 text-white transition hover:scale-110
           active:scale-95"
    aria-label="Previous image">
    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor"
         viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round"
         stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
  </button>

  <button id="lb-next"
    class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10
           sm:w-12 sm:h-12 flex items-center justify-center rounded-full
           bg-white/10 hover:bg-white/20 text-white transition hover:scale-110
           active:scale-95"
    aria-label="Next image">
    <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor"
         viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round"
         stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
  </button>

  <div id="lb-backdrop"
    class="absolute inset-0 flex items-center justify-center p-4 sm:p-12 md:p-20
           cursor-zoom-out">
    <img id="lb-img" src="" alt=""
         class="lightbox-image max-w-full max-h-full object-contain rounded-3xl
                shadow-2xl cursor-default" />
  </div>

  {images.length > 1 && (
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2
                max-w-[90vw] overflow-x-auto px-2 py-2 rounded-2xl bg-white/5
                scrollbar-hide">
      {images.map((img, i) => (
        <button class="lb-thumb w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden
                        flex-shrink-0 border-2 border-transparent
                        hover:border-white/50 transition hover:scale-105"
                data-index={i} aria-label={`Go to image ${i + 1}`}>
          <img src={img.src} alt="" class="w-full h-full object-cover"
               loading="lazy" decoding="async" />
        </button>
      ))}
    </div>
  )}
</div>

<script is:inline>
  (function () {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    let images = [];
    try {
      images = JSON.parse(lightbox.dataset.images || '[]');
    } catch (e) { return; }

    let currentIndex = 0;

    const imgEl = document.getElementById('lb-img');
    const captionEl = document.getElementById('lb-caption');
    const counterEl = document.getElementById('lb-counter');
    const thumbs = document.querySelectorAll('.lb-thumb');
    const galleryItems = document.querySelectorAll('.js-gallery-item');

    function update(index) {
      if (!images.length) return;
      currentIndex = (index + images.length) % images.length;
      const image = images[currentIndex];
      imgEl.src = image.src;
      imgEl.alt = image.alt || '';
      captionEl.textContent = image.alt || '';
      if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
      thumbs.forEach((t, i) => {
        t.classList.toggle('border-white', i === currentIndex);
        t.classList.toggle('border-transparent', i !== currentIndex);
        t.classList.toggle('scale-110', i === currentIndex);
      });
    }

    function open(index) {
      update(index);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    }

    function close() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    }

    function next() { update(currentIndex + 1); }
    function prev() { update(currentIndex - 1); }

    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => open(i));
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        update(parseInt(thumb.dataset.index, 10));
      });
    });

    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-next').addEventListener('click', next);
    document.getElementById('lb-prev').addEventListener('click', prev);
    document.getElementById('lb-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) close();
    });
  })();
</script>

<style>
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
```

**Step 3 — Gallery grid in the consuming page** (`gallery.astro`):

Each gallery item needs `class="js-gallery-item"` and a `data-index` attribute so
the lightbox JS can wire click events:

```astro
---
import { galleryImages } from '../data/content/gallery';
import Lightbox from '../components/Lightbox.astro';
---
<div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
  {galleryImages.map((img, i) => (
    <div class="js-gallery-item group relative rounded-3xl overflow-hidden cursor-pointer"
         data-index={i}>
      <img src={img.src} alt={img.alt}
           class="w-full h-64 sm:h-72 lg:h-80 object-cover
                  group-hover:scale-105 transition-transform duration-500"
           loading={i < 6 ? "eager" : "lazy"} decoding="async" />
    </div>
  ))}
</div>

<Lightbox images={galleryImages} />
```

**What makes this work — summary of the three critical decisions:**

| Decision | Why it matters |
|---|---|
| Overlay rendered in markup, not created by JS | DOM is ready at page load; no timing issues |
| Visibility/opacity styles in `global.css` | Astro doesn't scope them — they always match |
| JS uses `is:inline` directive | Raw DOM access without build-step interference |

### 7.7 Mobile menu pattern (vanilla)

Seven hard rules. Visual design (colors, fonts, exact layout of contact/CTA zone,
glass effects, backdrop blur intensity) is project-specific. The structural invariants
below are non-negotiable — violating any one produces a silent broken state that looks
fine in source but fails on click.

**Why overlay styles go in `global.css` — same reason as the lightbox (§7.6b):**
the mobile overlay is rendered outside any component's scoped DOM (it's a sibling to
`<header>`, not inside it). Component `<style>` tags are scoped by Astro and won't
match elements at the document root level. All `.mobile-overlay` + `.menu-link`
animation styles go in `src/styles/global.css`.

#### Rule 1 — Overlay placement

The overlay MUST be a direct sibling to `<header>`, never nested inside it. A
`position:fixed` element inside a header that has `transform`, `backdrop-filter`,
or `will-change` is trapped inside the header's stacking context — it gets clipped
to the header's computed height instead of covering the viewport.

```astro
<!-- Header.astro — correct structure -->
<header>…</header>

<div id="mobile-menu" class="mobile-overlay …">
  <!-- overlay is header sibling, not child -->
</div>
```

#### Rule 2 — Display state

`display:flex` must live in the **base** state, never only in `.open`. Toggling
`display` by adding/removing `.open` causes layout thrashing: when `.open` is
removed, the element drops from `display:flex` to `display:inline`, triggering a
visible paint-jump at the end of the close animation.

The clean set — only three properties toggle, none trigger layout:

```css
.mobile-overlay {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 50;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}
.mobile-overlay.open {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}
```

#### Rule 3 — Toggle wiring

Use `querySelectorAll('[data-menu-toggle]')`, never `querySelector`. Both the
hamburger button AND the X button inside the overlay carry the
`[data-menu-toggle]` attribute. `querySelector` only hits the first match — the
X button inside the overlay ends up with no click handler, silently broken.

```js
document.querySelectorAll('[data-menu-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(open));
  });
});
```

#### Rule 4 — Close button tappable area

The X button inside the overlay needs `w-11 h-11` (44px minimum), a `rounded-full`
background for the tappable footprint, and `z-10` to stay above content. A bare
inline SVG is a ~24px target that fails WCAG touch-target size and feels broken.

#### Rule 5 — Staggered open, unified close

Menu links animate in staggered (`opacity` + `translateY` with per-item `transition-delay`).
On close, **all delays must drop to `0s !important`** — without this, links trail the
overlay fade-out with their individual staggered delays, looking like lag.

```css
.menu-link {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.mobile-overlay.open .menu-link {
  opacity: 1;
  transform: translateY(0);
}
.mobile-overlay:not(.open) .menu-link {
  transition-delay: 0s !important;
  transition-duration: 0.2s !important;
}
@media (prefers-reduced-motion: reduce) {
  .mobile-overlay, .menu-link { transition: none; }
  .menu-link { opacity: 1; transform: none; }
}
```

#### Rule 6 — Pointer-events

Without `pointer-events: none` in the base state, the invisible overlay
intercepts clicks on page content below it. Must be `none` when closed,
`all` when open. (Covered in Rule 2's CSS — it's in the three-property toggle.)

#### Rule 7 — Contrast on dark surface

The overlay background is a dark surface (typically `rgba(dark, 0.92) +
backdrop-blur`). Text on it must be light — using the site's body text color
(which is dark-on-light for normal reading) on the overlay will fail WCAG
contrast. Pick light-on-dark colors for all overlay text, links, and icons.

#### Rule 8 — Scoped link colors + measured contrast

Never style overlay links with a bare element selector (`#overlay a { color: … }`) —
its specificity beats any utility color on a button/CTA inside the overlay, producing
invisible text (e.g. brand-color text on a cream button) that looks fine in source.
Scope with classes (`#overlay a.menu-link`, `#overlay a.menu-cta`). After styling,
MEASURE contrast of every contrasting element (buttons, links, text on glass) against
its own background and require WCAG ≥ 4.5:1 (7:1 for large text) — compute the ratio,
never eyeball it.

#### Rule 9 — Scroll containment

Lock BOTH `document.documentElement` and `document.body` to `overflow: hidden` while
the overlay is open, and make the overlay itself the scroll container
(`overflow-y: auto; overscroll-behavior: contain`). Verify at 390×844: while open,
`window.scrollY` must not change under any wheel/touch input; after close, the page
must scroll again.

---

**Minimal JS skeleton** (escort, close-on-link, close-on-ESC):

```js
const overlay = document.getElementById('mobile-menu');

document.querySelectorAll('[data-menu-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = overlay.classList.contains('open');
    overlay.classList.toggle('open', !open);
    document.body.style.overflow = !open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(!open));
    btn.setAttribute('aria-label', !open ? 'Close navigation menu' : 'Open navigation menu');
  });
});

overlay.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  })
);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});
```

**Hamburger icon swap** (optional, in Header.astro):

Render both icons, toggle opacity. The hamburger and X SVG are both present in the
DOM at all times; CSS `opacity` toggles which is visible.

```
<button data-menu-toggle aria-label="Open navigation menu" aria-expanded="false"
  class="lg:hidden w-10 h-10 flex items-center justify-center rounded-full">
  <svg id="menu-icon" class="w-6 h-6">…hamburger paths…</svg>
  <svg id="close-icon" class="w-6 h-6 absolute opacity-0">…X paths…</svg>
</button>
```

Toggle `opacity` on the two SVG elements inside the same click handler as the
overlay toggle. Both icons share the `data-menu-toggle` target.

**Contact + CTA in overlay** (optional, driven by brief):

Include phone, email, and a CTA button at the bottom of the overlay, reading from
`SITE.business.contact.*`. Not every project needs this — only if the brief calls
for prominent contact prompts on mobile.

---

**What makes this work — the three structural invariants:**

| Decision | Failure if violated |
|---|---|
| Overlay as `<header>` sibling, not child | Clipped to header height, not viewport |
| `display:flex` in base state, not `.open` only | Layout thrashing + flicker on close |
| `pointer-events:none` in base + `all` in `.open` | Dead clicks on page behind invisible overlay |
| `querySelectorAll`, not `querySelector` | X button unresponsive |
| `0s !important` delay on close animation | Links trail overlay fade-out |
| Unscoped `#overlay a` selectors | Invisible CTAs (specificity beats utilities) |
| Scroll lock applied to `body` only | Background scrolls behind the open overlay |

### 7.8 Accordion (the grid-template-rows trick)
```css
.faq-accordion { display:grid; grid-template-rows:0fr; transition: grid-template-rows .35s ease-out; }
.faq-accordion.open { grid-template-rows:1fr; }
.faq-accordion-inner { overflow:hidden; }
```
```html
<button aria-expanded="false" class="faq-trigger">…</button>
<div class="faq-accordion"><div class="faq-accordion-inner"><p>…</p></div></div>
```
```js
document.querySelectorAll('.faq-trigger').forEach(btn => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    // close others if single-open mode:
    // document.querySelectorAll('.faq-trigger').forEach(b => b.setAttribute('aria-expanded','false'));
    btn.setAttribute('aria-expanded', String(!open));
    btn.nextElementSibling.classList.toggle('open', !open);
  });
});
```

### 7.9 Scroll-reveal (one observer, respects reduced motion)
```css
[data-motion] { opacity:0; transform:translateY(30px); transition: opacity .5s, transform .5s;
  transition-delay: var(--motion-delay, 0ms); }
[data-motion].visible { opacity:1; transform:none; }
@media (prefers-reduced-motion: reduce) {
  [data-motion], [data-animate] { opacity:1 !important; transform:none !important; filter:none !important; }
}
```
```js
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible');
      io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-motion], [data-animate]').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('[data-motion], [data-animate]').forEach(el => el.classList.add('visible'));
}
```

### 7.10 JSON-LD injection pattern
In `Layout.astro`:
```astro
<script type="application/ld+json" set:html={JSON.stringify(generateBusinessSchema())} />
<script type="application/ld+json" set:html={JSON.stringify(generateWebsiteSchema())} />
{breadcrumbs && <script type="application/ld+json"
  set:html={JSON.stringify(generateBreadcrumbSchema(breadcrumbs))} />}
```
Never inline arbitrary JSON-LD by hand — generators keep NAP consistent.

### 7.11 Image pipeline
- Source images go in a `content/images/` or `Images/` folder (gitignored if huge).
- A `scripts/process-images.mjs` (using `sharp`) generates responsive `.webp` (and
  optionally `.avif`) variants + writes width/height + alt into `gallery.ts`.
- Components always render `<img>` with `width`, `height`, `loading="lazy"`,
  `decoding="async"`, and `srcset` for the variants.
- OG/social image: a pre-generated 1200×630 jpg/png.

### 7.12 Placeholder images & Unsplash stock (build-then-replace workflow)

**Goal:** a project must build with a correct layout *before* any real photos exist.
The agent never blocks on missing images and never ships broken layout to make up
for them. Two-tier strategy:

#### Tier 1 — Grey SVG placeholder (default, zero-dependency)
Always scaffold with these first so the build passes immediately and layout is real.
- Ship `public/images/placeholder.svg` once:
  ```xml
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9' preserveAspectRatio='xMidYMid slice'>
    <rect width='16' height='9' fill='%23e5e7eb'/>
  </svg>
  ```
  (decode `%23` as `#` if writing the file directly — keep `#` encoded only inside data URIs)
- For per-slot sizing without shipping one SVG per aspect, prefer an inline data URI in
  the `src/utils/placeholder.ts` helper:
  ```ts
  export const placeholder = (w = 1600, h = 900, label = '') => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>
      <rect width='100%' height='100%' fill='#e5e7eb'/>
      <text x='50%' y='50%' font-family='sans-serif' font-size='${Math.max(12, w / 40)}'
        fill='#9ca3af' text-anchor='middle' dominant-baseline='middle'>${label || `${w}×${h}`}</text>
    </svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  };
  ```
- Components reference it via a single convention, so real images just slot in later:
  ```astro
  ---
  import { placeholder } from '../utils/placeholder';
  const src = img?.src ?? placeholder(1600, 900, 'Hero image');
  const alt = img?.alt ?? 'Placeholder — replace before launch';
  ---
  <img src={src} alt={alt} width={img?.w ?? 1600} height={img?.h ?? 900}
       loading="lazy" decoding="async" class="…" />
  ```
- The placeholder helper guarantees `width`/`height` are always present → zero CLS
  now and after the real image is dropped in (use the same aspect ratio).
- **Mark every placeholder** in `POST-SETUP.md` via the `placeholder` flag in
  `gallery.ts` (see §6). The build/verify gate (§10) should grep `placeholder: true`
  and remind the user of pending replacements.

#### Tier 2 — Unsplash contextual stock (when key provided)
If the user gave `UNSPLASH_ACCESS_KEY` in §1 Phase D, fetch contextual photos so the
site looks real to stakeholders before the brand shoot lands.

- **Auth + env:** store key in `.env` (gitignored); load via `process.env` in the
  fetch script. `.env.example` ships:
  ```env
  UNSPLASH_ACCESS_KEY=your_key_here
  ```
- **Rate limit awareness:** demo apps = 50 requests/hour, production = 1000/hour
  after approval. **Cache aggressively** — one search query → save JSON results to
  `content/images/.unsplash-cache.json`, never re-fetch the same query. Image-file
  requests to `images.unsplash.com` do NOT count against the rate limit.
- **Hotlinking is required by Unsplash ToS** — do NOT download the binary. Components
  use the returned `urls.raw` URL directly (CDN-served). Append `&w=…&q=80&fit=crop`
  for sizing; never strip the `ixid` parameter (it powers view tracking).
- **Attribution is mandatory** — every Unsplash image must carry a credit. Store it
  in `gallery.ts` and render it in the lightbox caption or footer credits:
  ```ts
  // gallery.ts entry shape
  { src: '/images/…webp', unsplashRaw: 'https://images.unsplash.com/…?ixid=…',
    alt: 'Skiathos harbour at sunset', placeholder: false,
    credit: { name: 'Marina Cavalli', url: 'https://unsplash.com/@marinacavalli' } }
  ```
  Render: `Photo by <a href={credit.url} rel="nofollow noopener">{credit.name}</a> on <a href="https://unsplash.com" rel="nofollow noopener">Unsplash</a>`
- **Reference fetch script** (`scripts/fetch-unsplash.mjs`):
  ```js
  import fs from 'node:fs/promises';
  import path from 'node:path';

  const KEY = process.env.UNSPLASH_ACCESS_KEY;
  if (!KEY) { console.error('Missing UNSPLASH_ACCESS_KEY — add to .env'); process.exit(1); }

  const queries = process.argv.slice(2);
  if (!queries.length) { console.error('Usage: npm run fetch-images -- "query1" "query2" …'); process.exit(1); }

  const cacheFile = 'content/images/.unsplash-cache.json';
  let cache = {};
  try { cache = JSON.parse(await fs.readFile(cacheFile, 'utf8')); } catch {}

  const outDir = 'content/images';
  await fs.mkdir(outDir, { recursive: true });

  const results = [];
  for (const q of queries) {
    if (cache[q]) { results.push(...cache[q]); continue; }   // never re-fetch
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=12&orientation=landscape&content_filter=high`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` }});
    if (!res.ok) { console.error(`Unsplash ${res.status} for "${q}"`); continue; }
    const { results: photos } = await res.json();
    const mapped = photos.map(p => ({
      id: p.id,
      raw: p.urls.raw,                  // hotlink — keep ixid intact
      alt: p.alt_description || `${q} photo`,
      credit: { name: p.user.name, url: p.user.links.html },
      blur_hash: p.blur_hash,
      width: p.width, height: p.height,
    }));
    cache[q] = mapped; results.push(...mapped);
    await new Promise(r => setTimeout(r, 1000));              // be polite to the API
  }
  await fs.writeFile(cacheFile, JSON.stringify(cache, null, 2));
  await fs.writeFile(path.join(outDir, 'unsplash-manifest.json'),
    JSON.stringify(results, null, 2));
  console.log(`Fetched ${results.length} images for: ${queries.join(', ')}`);
  console.log(`Manifest: ${outDir}/unsplash-manifest.json  (cache: ${cacheFile})`);
  ```
- **Wire into package.json:** `"fetch-images": "node scripts/fetch-unsplash.mjs"`
- **Brief-derived queries:** the agent should translate the project's sections into
  Unsplash search queries, e.g. for a ski resort: `["ski slope", "chalet interior",
  "mountain restaurant", "spa wellness", "gondola lift"]`. One query per section +
  one generic per service category is usually enough; cap at ~5 queries/hr to stay
  well under demo limit.
- **Keep `placeholder: true` flag off** once an Unsplash image is wired in — but keep
  the `credit` field so attribution survives into production.
- **Replaces but doesn't override** user-provided images: if `Images/` folder exists
  and contains real photos, those win — Unsplash only fills empty slots.

#### Component integration
A `Picture.astro` (or similar) helper keeps both tiers consistent:
```astro
---
import { placeholder } from '../utils/placeholder';
const { img, w, h, label, sizes } = Astro.props;
const src = img?.src ?? placeholder(w, h, label);
const srcset = img?.variants ? img.variants.map(v => `${v.src} ${v.w}w`).join(', ') : undefined;
---
<picture>
  {img?.credit && <small class="sr-only">Photo by {img.credit.name} on Unsplash</small>}
  <img src={src} srcset={srcset} sizes={sizes}
       alt={img?.alt ?? 'Placeholder — replace before launch'}
       width={w} height={h} loading="lazy" decoding="async" class="…" />
</picture>
```

#### When user's real images arrive later
User drops photos into `Images/` → runs `npm run images -- Images/` (§7.11) →
`process-images.mjs` overwrites the `gallery.ts` entries in place, clears the
`placeholder` flag, and keeps any existing `credit` field if the slot was Unsplash
(strips it if the new image is a real photo, since attribution no longer applies).
POST-SETUP.md should still list "swap placeholders for brand photos" as the final
quality gate.

### 7.13 Reference-link scraping (auto-extract business facts)

When the user provides URLs in §1 Step 0 (Google Maps place link, Facebook page,
TripAdvisor, existing old website, Instagram, menu PDF, etc.), the agent fetches each
and extracts structured fields to pre-fill Phases B & C — instead of asking the user
to retype everything. This cuts interview length drastically and reduces NAP
hallucination (the source of truth becomes the link itself).

**What to extract per source:**
- `maps.google.com` / place short-link → name, full postal address, latitude/longitude,
  phone (display + raw), opening hours (display + schema), price range, rating
  (value + count), review snippets (first ~10), website URL, service areas,
  `plusCodes` if present.
- `facebook.com/<page>` → about text, phone, email, hours, address, link to Instagram
  if cross-listed.
- `tripadvisor.com` → rating, top review bodies, service category label.
- Existing old website (any URL) → NAP from footer, hours, services list, FAQ if
  present, team names, gallery `<img src>` list (useful to seed `gallery.ts`).
- Instagram profile → recent caption text for tagline/voice, contact email in bio.
- Menu / price list URL (PDF or HTML) → service/product category list + prices.

**Flow:**
1. After Step 0, fetch each URL with the agent's web-fetch tool before asking Phase A.
2. Build a `setup-facts.json` draft mentally (or write to a scratch file under
   `content/.setup-scratch.json`, gitignored) covering every Phase B/C field.
3. Present it to the user in Phase A as: "I pulled the following from your links —
   correct anything that's wrong and add what's missing." Let them confirm/edit; only
   ask open Phase B/C questions for fields that came back empty.
4. Never silently trust scraped data for the final `SITE` config — always show the
   extracted values to the user for confirmation, since Google/FB often return
   stale or partial hours.

5. **Geo source rule:** a user-provided Google Maps place link beats any geocoder.
   Resolved coordinates that were never confirmed by the user must be listed in
   POST-SETUP as "verify the pin", never silently shipped as final.

**Geometry caveat:** Google Maps embed URLs encode lat/lng inside the `!1d!2d!3d`
pb tokens; parse the segment after `!3d` (lat) and `!2d` (lng) — but prefer the
`?q=<lat>,<lng>` form if the user pastes a `maps.google.com/?q=...` share link, or
use the OpenStreetMap Nominatim geocode API (no key) as a fallback when only a
text address is available:
`https://nominatim.openstreetmap.org/search?format=json&q=<url-encoded-address>`.
Store the resolved lat/lng into `SITE.business.geo` and reuse for the map embed (§8).

**Rate limit & politeness:**
- One fetch per URL, never refetch the same URL twice in the same session.
- Cache extracted facts to `content/.setup-scratch.json` so a re-interview after a
  crash doesn't re-hit the network.
- If a fetch fails (404, login wall, JS-rendered SPA), tell the user exactly which
  field couldn't be auto-filled and ask them to paste it manually. Don't invent.

### 7.14 Logo placeholder — logoipsum

If the user has no logo and didn't supply a brand mark in Phase D, **always** use
**logoipsum** (https://shape-creator.logoipsum.com) to generate a placeholder. Never
invent a fake wordmark or hand-draw a logo SVG — those slip past the user's quality
gate and ship to production.

**Workflow:**
1. Pick one of logoipsum's monogram styles (e.g. the "S" stack-style, "spinner",
   "split-letter" families) — choose the family whose silhouette best matches the
   brand voice: geometric for B2B/markets, organic for wellness/cafes, mono-weight
   for tech/legal. No need to ask the user; just pick one and flag it in
   POST-SETUP.md.
2. Download the SVG from logoipsum; save as `public/logo.svg`.
3. Use it via `<img src={SITE.logoPath} alt={SITE.name} />` (or inline `<Logo.astro>`
   if the project has one) — single source of truth = `SITE.logoPath`.
4. **Flag for replacement** in POST-SETUP.md under "Replace `public/logo.svg`":
   state the logoipsum family used, the brand color it was tinted with (if any), and
   remind the designer to swap with the client's real mark before launch.
5. If the brand already has a colour (Phase D hex) recolour the logoipsum SVG's
   primary paths to match so the placeholder site feels cohesive, not grey.

**Why logoipsum over a generic wordmark:** logoipsum placeholders are
recognisable as deliberate interim art — designers/clients immediately understand
"this needs replacement", unlike a styled wordmark which can read as "done".

---

### 7.15 Live UX patterns (header auto-hide, floating contact CTA, scrollspy)

Tested defaults for common live-UX requests. Violating the invariants produces
silent broken states (header that never reappears, CTA that blocks clicks).

**Header auto-hide (scroll direction):**
- Hide only on clearly downward motion (`delta > +10`) and `y > 80`.
- Show on ANY upward motion (`delta < -3`), at `y < 80`, or at the top.
  ASYMMETRIC thresholds are mandatory — symmetric ones (e.g. ±6) trap the header
  stuck-hidden on trackpads/smooth mice whose per-event deltas are small.
- Respect `prefers-reduced-motion: reduce` — never hide for those users.
- Verify with REAL wheel/touch gestures in a browser (never `scrollTo` jumps,
  which mask threshold bugs), including a slow, small-delta scroll-up.

**Floating contact CTA:**
- Appear after ~360px of scroll so it never covers the hero CTA.
- Hidden state must be `opacity:0; pointer-events:none` PLUS `aria-hidden="true"`
  and `tabindex="-1"`, all toggled together when shown (visible =
  `pointer-events:all`, `aria-hidden="false"`, `tabindex="0"`).

**Scrollspy (active nav on scroll):**
- Initialize after DOMContentLoaded — inline scripts run before later sections
  exist, and observing null elements silently kills the observer.
- IntersectionObserver with a middle-viewport band rootMargin
  (`-40% 0px -55% 0px`); toggle one active class on nav links.

**Tested heading decoration:** gold square marker (7×7px) before uppercase,
letterspaced overline labels + a short (3rem × 3px) gold underline bar beneath
section titles (centered or left, matching alignment). Avoid dash/rule ornaments
that read as boundary lines — clients perceive them as unfinished.

---

## 8. SEO contract (day one, every project)

- `<title>` = page name + titleSuffix; meta description from brief.
- Canonical link via `canonicalUrl(path)`.
- OpenGraph + Twitter card meta in `Layout.astro` (uses `SITE.seo.defaultOGImage`).
- JSON-LD `LocalBusiness` (or `Restaurant`, `Store`, `HealthAndBeautyBusiness`,
  `LodgingBusiness` per brief) on every page via the generator.
- BreadcrumbList on every interior page.
- `sitemap-index.xml` via `@astrojs/sitemap`.
- `/rss.xml` if blog enabled — `@astrojs/rss`.
- `robots.txt` allowing all, pointing to sitemap.
- `manifest.webmanifest` for PWA installability (themeColor from `SITE.seo.themeColor`).
- NAP (name/address/phone) string stays identical in `SITE`, schema, footer, contact.

Keyword strategy derives from the brief (see §1) — not from this rule file.

---

## 9. Responsive & accessible baseline (every section, every project)

- Mobile-first: every section works at 320 px before being styled up.
- No horizontal scroll on any viewport (set `html, body { overflow-x: hidden; }`).
- Tap targets ≥ 44×44 px on touch.
- All `<img>` have `alt`; decorative SVG tagged `aria-hidden="true"`.
- Color contrast passes WCAG AA (4.5:1 body, 3:1 large).
- `prefers-reduced-motion` honoured for every animation.
- Forms have labels, `aria-required`, error messaging tied to input via `aria-describedby`.
- Skip-to-content link as first focusable element.
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section aria-labelledby>`.

---

## 10. Build & verify gate (before declaring the project done)

```bash
npm install
npm run build      # MUST pass with zero errors, zero unhandled warnings
npm run dev:bg      # server must come up, pages load, links work, console clean
```
Placeholder audit (cheap sanity check the agent should run before declaring done):
```bash
rg -n 'placeholder:\s*true' src/data/                 # count remaining grey placeholders
rg -n 'unsplashRaw' src/data/                          # list Unsplash slots awaiting brand photos
rg -n 'YOUR_|@example\.com|Lorem|TODO|FIXME' src/ public/   # catch other un-replaced stubs
```
Any non-zero count is fine for a hand-off build — but every hit MUST be reflected in
POST-SETUP.md (§12) so the human knows what's still pending.

**Runtime & asset verification (before hand-off):**
1. **Asset-reference integrity** — parse built HTML/CSS for every `/images/…` (and
   other asset) reference and assert each maps to an existing file on disk. A
   ~10-line script; catches 404s before the human does.
2. **Icon names** — verify every icon name used exists in its iconify collection
   (`@iconify-json/<set>/icons.json`) before relying on the build.
3. **Browser E2E on the BUILT output** (not just dev): open at 390×844 and desktop,
   click menu open/close, open the lightbox, then assert zero console errors /
   uncaught exceptions and zero failed network requests on a cold load (cache
   cleared). Test scroll-dependent UX with real wheel/touch gestures.

Self-check the agent must run mentally after each section:
1. Did the build pass?
2. Does the route open in preview without console errors?
3. Did every interactive element from §4 get click-tested (all states)?
4. Did the Lighthouse mobile score land > 90 on Perf/A11y/SEO/Best-Effort? (warn, not block)
5. Did OG card + canonical + schema render in the page source?
6. Did every image slot have a real `width`/`height` (grey placeholder OK, broken layout NOT)?

---

## 11. Dev-server rule (background server that survives the shell)

Reason: in AI-driven shells, background `&` processes die from SIGHUP when the
calling command returns. Solution: detach via `setsid` + `disown`.

Recommended `scripts/dev.sh`:
```bash
#!/usr/bin/env bash
set -e
lsof -ti :4321 | xargs -r kill -9 2>/dev/null || true
setsid node_modules/.bin/astro dev --host 0.0.0.0 --port 4321 \
  > /tmp/astro-dev.log 2>&1 &
disown
echo "Astro dev on http://localhost:4321 (logs: /tmp/astro-dev.log)"
```
`package.json` scripts:
```json
{
  "dev": "astro dev",
  "dev:bg": "bash scripts/dev.sh",
  "build": "astro build",
  "preview": "astro preview"
}
```
Stop: `lsof -ti :4321 | xargs -r kill`.

If the host IDE has its own background-runner affordance (Cursor/Cline), prefer that.
Bind `--host 0.0.0.0` only if the user wants network access; otherwise `127.0.0.1`.

---

## 12. Hand-off doc (POST-SETUP.md)

Generate after the first successful build. Contains only-human tasks, no code:
- Google Business Profile verification + add `googleVerification` code
- Replace favicon set (`public/favicon*.{png,svg}`)
- Replace `public/logo.svg`
- Add real images via `npm run images -- <folder>` (or fetch stock with
  `npm run fetch-images -- "<query>"` if Unsplash key was set — see §7.12)
- **Replace grey placeholders** — list every `placeholder: true` entry from `gallery.ts`
  and every `placeholder()` call site, with the slot's aspect/role so the photographer
  knows what to shoot (e.g. "Hero 16:9 landscape, ~1600×900" or "Services card 4:3 ~800×600")
- **Swap Unsplash stock for brand photos** — list every `credit` field in `gallery.ts`;
  each Unsplash image is fine to ship but carries attribution, so flag which slots the
  client wants replaced before launch
- Real map embed URLs in `SITE.maps`
- Blog posts in `src/data/content/blog.ts`
- Deploy `dist/` to Netlify/Vercel/Cloudflare/Pages
- Submit `sitemap-index.xml` in Google Search Console
- Replace placeholder `Lorem` text (agent should flag every placeholder it left)
- **Apply for Unsplash production rate limit** if app exceeded demo's 50 req/hr
  (https://unsplash.com/oauth/applications → "Apply for Production")

---

## 13. Agent self-discipline (anti-hallucination rules)

- Never invent a business fact not given by the user — use obvious placeholders
  (`YOUR_PHONE`, `CONTACT_EMAIL@example.com`) and list them in POST-SETUP.
- Never write a working slider/lightbox/menu blind — use §7 patterns as starting
  points, then adapt. Reasoning blind → broken states on click 3.
- Never add a dependency without checking: published on npm, last release < 18 months,
  Astro-static-compatible, has TS types.
- Never modify an existing working file's behaviour unless asked.
- Never commit changes, never push, never deploy unless the user explicitly requests.
- **Comments** — write zero code comments unless the user asks. No `// TODO`, no
  inline explanations. Variable names carry the meaning.
- One task at a time: if the user asks for a gallery, add the gallery using §7.6 +
  §6 `gallery.ts`. Don't refactor the header unprompted.
- When asked for "add a X section to page Y", the agent should:
  1. Locate the page route under `src/pages/`.
  2. Use the matching component from `src/components/` if exists; otherwise create.
  3. Pull content from `src/data/content/X.ts`; if missing, scaffold it.
  4. Wire lightbox/slider/accordion per §7 patterns immediately — not "later".
  5. Build, verify, done. **No "let me know if you want me to wire this up" follow-ups.**

---

## 14. Brief-first principle (the philosophical core)

If the user gives a brief → derive everything from it.
If the user gives only a name → interview (§1) → draft a short positioning brief →
get OK → derive.
If the user gives a design image → use it as the visual north star but still complete
the interview for content/SEO/contact facts.

The brief, not the boilerplate, decides: which sections, which CTAs per persona,
which keyword clusters map to which landing pages, which color feels right, which
font family fits the brand voice. The boilerplate provides the *structure*; the
brief provides the *meaning*.

---

## 15. File naming & conventions (apply uniformly)

- Components: PascalCase `.astro` (`Hero.astro`, `TestimonialsSlider.astro`).
- Pages: kebab-case `.astro` (`local-specialties.astro`, `rss.xml.ts`).
- Data files: kebab-case `.ts` (`gallery.ts`, `faq.ts`).
- CSS files: kebab-case (no `.module.css` — Tailwind v4 doesn't need it).
- TypeScript: strict, `as const` on exported config arrays/objects.
- ESM throughout (no `require`, no CommonJS).
- Trailing slash on URLs (`/about/`), enforced via `canonicalUrl()`.
- 2-space indent, single quotes, semicolons (or follow repo's prettier/eslint config
  if present).

---

## 16. Forbidden / explicit don'ts

- Don't ship Google Fonts CDN links — self-host.
- Don't inline raw SVG markup repeated across components — use `astro-icon`.
- Don't hardcode phone/email/hours in `.astro` — read from `SITE`.
- Don't use `max-height` for accordion animations — use the grid trick.
- Don't autoplay motion without `prefers-reduced-motion` check.
- Don't import a React/Vue component for what a 30-line Astro component can do.
- Don't add a chat widget, analytics, or pixel without user confirmation.
- Don't use `npx astro` — use `node_modules/.bin/astro` (version drift protection).- Don't interpolate Astro `{expressions}` inside `<script is:inline>` — inline
  scripts pass through RAW; carry config via `data-*` attributes on elements.
- Don't reference icon names you haven't verified against the installed icon
  collection (builds fail with "Unable to locate…").
- Don't delete or rename conventions this project already established without flagging.

---

## 17. Quick decision table (when unsure, pick the default)

| If the brief asks for… | Default |
|---|---|
| "a map" | OpenStreetMap embed (privacy, no API key) |
| "a gallery" | Responsive grid + GLightbox |
| "testimonials" | Swiper slider + star svgs |
| "FAQ" | Accordion (grid trick), single-open |
| "booking" | External link / mailto / Formspree — never invent a fake calendar |
| "shop / prices" | Static catalogue page + WhatsApp order CTA (no fake cart) |
| "prices in multiple currencies" | Confirm with user — out of scope by default |
| "login / user accounts" | Out of scope — flag, decline, suggest a different stack |
| "real-time data" | Out of scope — static-only by default |
| "AI chatbot widget" | Confirm with user; default is no |
| "blog comments" | Out of scope |
| "newsletter" | Plain mailto or Formspree → email list provider (e.g. Buttondown) |
| "share buttons" | Static anchor links (FB/X/LinkedIn share URLs) — no SDK |

---

End of file. Copy this verbatim into your project root as `AGENTS.md` (or the file
your IDE prefers) and start the kickoff interview in §1.