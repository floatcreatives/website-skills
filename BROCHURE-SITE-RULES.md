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

> **VERSION: 1.3.2** — bump this number with every change to these rules, and bump the local
> agent skill `float-website-skills` (`version:` in its frontmatter) to the same number in the same
> change. One name, one version: `float-website-skills` v1.3.2 == `BROCHURE-SITE-RULES.md`
> 1.3.2. The root `VERSION` file carries the same string.

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

## 0.5 The default kit — blocks, styles, language seam, privacy floor (read before §1)

Every Float site ships these, new design or legacy migration. Each one is asked for by name on real
projects, and each one delivered late costs a correction round instead of a decision. Read this before
scaffolding: it decides what the build contains, not just how it looks.

### 0.5.1 Blocks

| Block | Spec | Proof before hand-off |
|---|---|---|
| Header with scroll state | §4, §7 | measured at 0 / just-past-threshold / deep scroll |
| Full-screen mobile menu | §4, §7.7 | open state captured at 390, close control visible, ESC + both scroll roots locked |
| Hero scrim + open-now status line | §4, §7 | computed open/closed state asserted, not the label |
| Text and image reveals | §4, §7.10 | every `[data-reveal]` animated after a full scroll, zero stuck |
| Hover floor on every control | §7.16 | lift + icon nudge, nav underline, card zoom ~3%, focus ring, lightbox fade |
| Parallax on every full-bleed band | §4, §7.10 | band captured, `scrollWidth - innerWidth === 0` |
| Gallery / rail with lightbox | §4, §7.5 | counter, arrows, ESC, swipe, focus return |
| Reviews rail (CSS scroll-snap) | §7.6 | manual swipe keeps the counter in sync |
| FAQ accordion | §4 | panel height 0 → N px, panel resolved via `aria-controls` |
| Sticky mobile action bar | §4, §7.7 | `body` reserves the bar height, last line not covered at 390 |
| Map block | §4 | tiles render, a placeholder hint shows before init |
| Booking / contact form | §4, §7.13 | both composed URLs readable from `form.dataset.*` |
| Privacy page + real 404 | §8, §12 | footer link resolves, host serves the 404 |
| `og:image` 1200×630, favicon, touch icon | §8 | file existence asserted by the SEO gate |
| SEO, a11y and interaction gates | §8, §9, §10 | green **before** the repo is created |

### 0.5.2 Design base — declare these once, before the first section

`global.css` opens with one block of values; no section below it invents its own. This is what stops a
page where each section picked a different radius, easing and heading size.

| Token | Values |
|---|---|
| Section rhythm | three sizes only: `--pad-y: clamp(4rem, 9vw, 7rem)` (band), `--pad-y-sm: clamp(2.5rem, 5vw, 4rem)` (strip), `--gap: clamp(1rem, 2vw, 1.5rem)` (grid) |
| Type scale | `--t-display: clamp(2.6rem, 7vw, 5.5rem)`, `--t-h2: clamp(1.9rem, 3.4vw, 3rem)`, `--t-h3: 1.15–1.35rem`, `--t-body: 1rem/1.65`, `--t-micro: .72rem` caps + `.14em` tracking. No size between steps. |
| Measure | body `65ch`, lead `50ch`; never a `ch` measure on an element that does not carry the display font |
| Radius | one decision per site: `0` (sharp/editorial) or one soft step (12–16px); never mixed |
| Motion | `--dur-1: 180ms` (hover), `--dur-2: 420ms` (reveal), `--dur-3: 700ms` (band); one easing `cubic-bezier(.22,.61,.36,1)`; no bounce |
| Focus | `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px }`, styled once for every control |
| Icons | one set, one stroke width (1.5), two sizes (18 nav / 20 CTA); never two sets |
| Font metrics | every `@font-face` carries `size-adjust` + `ascent-override` matched to the fallback face, so the swap does not reflow the first screen (§9.7) |
| Wrapping | `text-wrap: pretty` on body copy, `text-wrap: balance` on headings only — never `* { text-wrap: balance }`, the browser cost is real |
| Viewport units | `dvh`/`svh` for full-height sections; never `100vw` for a full-width box (it ignores the scrollbar) |

Primitives every section composes, so a bespoke value in a section is a bug: `.btn` (solid / outline /
text, hover lift with icon nudge), `.eyebrow` (caps micro, one fact only), `.rule` (1px hairline
separator, the alternative to another card), `.grid-num` (numbered editorial grid on hairlines, the card
reflex killer), `.field` (label + input + focus ring + error state).

### 0.5.3 The floor — small things every site needs and most builds forget

- **Skip link + one `<main id="main">`**, first in the body, visible on focus.
- **`scroll-margin-top` on every anchor target** (`calc(var(--header-h) + 1rem)`), never a JS offset.
- **`theme-color`, `<html lang>`, `og:locale`** on every page.
- **Phone digits normalised once** in the site config: `tel:` takes the display form, `wa.me` takes
  digits only with no `+`.
- **Honeypot + `reportValidity()` on every form, never a captcha.** A static site cannot validate on the
  server; say so rather than implying it.
- **`robots.txt` with the sitemap line**, and `lastmod` in the sitemap.
- **A loading screen only when the hero is heavy**, opt-in, removed on `load`, never a condition for
  the content to exist.
- **`public/_headers` shipped with every build** (Netlify / Cloudflare Pages syntax; `vercel.json` for
  Vercel, `.htaccess` only for Apache hosts): HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `frame-ancestors 'none'`, one-year immutable caching for hashed assets, and
  `Cache-Control` that keeps HTML bfcache-able. Full set and rationale: §18.
- **`<meta name="robots" content="index, follow, max-image-preview:large">`** on every indexable page —
  without `max-image-preview:large` Google shows a smaller preview image; `noindex` only on 404 and on
  a staging host.
- **`color-scheme` plus a two-value `theme-color`** (`prefers-color-scheme: light` / `dark`) so the
  browser chrome and native form controls match the page instead of flashing white. A dark palette is a
  brief decision; the `color-scheme` declaration is not.
- **A recorded Core Web Vitals baseline** — PageSpeed Insights on the deployed URL, mobile, at p75, with
  LCP / INP / CLS pasted into `POST-SETUP.md`. A site with no field numbers is not verified (§9.7).

### 0.5.4 Bilingual-ready from day one

Every build ships the seam for a second language even when only one is live. Bilingual is a seasonal
request that arrives mid-season, and by then it must cost one file, not a rewrite. Full recipe, folder
layout and the flip-on checklist: `docs/I18N-AND-PRIVACY.md`.

- Root is the default language, the second sits at `/<lang>/…`, same slug structure, and `<html lang>`
  comes from the route rather than a constant.
- All copy lives in `src/i18n/<lang>.ts`, with the dictionary type derived from the default file, so a new
  key fails the build until the other language has it. NAP, hours, geo and socials stay language-neutral
  in `site.config.ts`. This is the same rule as §6 (nothing a visitor reads sits in a component).
- Every page emits `hreflang` (including `x-default`) and `og:locale`; the sitemap lists both languages;
  canonical is self-referencing per language, never cross-language.
- The language switcher ships **hidden** until the second dictionary is complete. A switcher into
  half-translated pages is worse than no switcher, and it is the version that ships when nobody gates it.
- The second language is written, not translated sentence by sentence; trade and product terms stay
  English, brand names stay as they are.

### 0.5.5 GDPR floor

Default position: the site stores nothing, so it needs no cookie banner. That is true only while
everything below holds, and it is enforced by a build gate (§0.5.1, `scripts/check-third-party.mjs`), not
by memory. Clause list, art. 13 sections and operator wording: `docs/I18N-AND-PRIVACY.md` and §12.

- Self-hosted fonts, Leaflet + OSM instead of a Google Maps iframe, no YouTube/Vimeo/Instagram embed
  unless behind a click-to-load facade that fetches only on click.
- Cookieless analytics only, if the owner wants numbers: Cloudflare Web Analytics or a self-hosted
  Plausible. No Google Analytics, no tag manager, no ad pixels, no session recording, no heatmaps.
- The privacy page is written from the built HTML: name the host logs, the mail client and the analytics
  provider, and delete every claim the build cannot support.
- Forms carry a consent sentence naming purpose and retention plus a `/privacy/` link. WhatsApp is Meta:
  a `wa.me` submission transfers the visitor's details to a third party, so say it and offer email as the
  alternative.
- Never invent VAT numbers, a DPO, retention periods or a legal basis. Omit the line and mark it
  owner-confirm in `POST-SETUP.md` (§12).

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
- A **design anchor**, one sentence: the single image or idea the page is built around. If the
  user has no opinion, the agent picks one from the brief and states it. State the **display
  face**, the **palette source** and the **motion budget** in the same breath — these four lines
  are part of the plan, not an afterthought. Full contract: §7.16.

### Phase A — Identity & scope
- Business name, short tagline, one-line description (for SEO meta)
- Website URL (or placeholder)
- Primary language + any secondary languages (multilingual = extra work, confirm)
- List of pages wanted (suggested menu: Home, About, Services/Products, Gallery,
  Contact, FAQ, Blog — user picks which)
- Scope tag: `brochure` | `multi-page` | `multi-language`

### Phase A.5 — Niche and competitor pass (the quality lever nobody skips twice)

The brief says what the client wants. The niche says what "best in this market" already looks like, and
what the visitor has already seen twice before landing here. Best-possible version means beating the
best local site, not the average one. Time-box: 25 minutes. Output: `RESEARCH.md` in the project root.

- **Pick three: the top local organic result, the client's own chosen benchmark, and one best-in-class
  site from the same category outside the region.** A taverna in Skiathos competes with the two
  tavernas on the same beach and with the best taverna site in the Aegean — not with a SaaS landing page.
- For each, record in six lines: URL · page/section inventory · the one thing it does better than the
  client could · the section order on the home page · the words it uses for its own services (their
  keywords, not ours) · what its reviews praise and complain about.
- Then write the two columns that decide the build:
  - **Table stakes** — sections every competitor ships. Missing one reads as an incomplete site, so these
    are in unless the brief says otherwise.
  - **The wedge** — one thing none of them does that this business can honestly claim. That is the hero,
    the anchor image and the one section that gets the extra art direction (§7.16).
- **Copy the information order, never the execution** (§17). Palette, type, motion and layout are ours.
- If a competitor blocks or is unreachable, say so and move on. Never write a research section from
  memory of what tourism sites usually contain — that is how the generic build gets made.

### Phase A.6 — Art direction brief (the part that decides whether it looks like anything)

The competitor pass says what must exist. This step decides what the page *is*, in eight lines, before a
single component is written. It is the difference between a site with good rules applied and a site with a
point of view. Record it at the top of `RESEARCH.md` — and if any answer is "whatever the starter does",
the build is a template and the owner will say so.

| Decision | What "good" looks like |
|---|---|
| **Anchor** | One image or one fact the page is built around, named. Not "the hero photo" — *that* photo, and why it beats the other five. |
| **One signature move** | One thing a visitor remembers: a full-bleed band, a 40/60 split that repeats, a numbered index of the rooms, a single loud colour used once. One, not five. |
| **Type** | A display face + a text face with a reason attached (era, place, trade), both Greek-verified (§7.16), sizes from §0.5.2 only. |
| **Palette** | Three values from the place itself (stone, sea, olive, sign paint) — not from a colour generator, not the purple gradient. |
| **Composition** | Which two section shapes carry the page: hairline grid, band, asymmetric split, editorial stack. Chosen before the first section, then reused. |
| **Density** | Small-screen-first decision: is this page quiet and airy or dense and informative? A taverna menu and a villa both lose if they get the other one. |
| **Photography treatment** | Crop ratio, treatment (full colour / one duotone band), and whether type sits on the image or beside it. Never both on one page. |
| **The anti-slop check** | Read §7.16's never-by-default list out loud against the plan. Every hit is removed now, not waived later. |

**Rules**

- **Decisions are made before layout, not discovered during it.** An agent that starts a hero and "sees how
  it feels" ships the default.
- **The signature move is allowed to be quiet.** One perfect band beats five effects; motion is a decision
  from §0.5.2's durations, never an added library.
- **Owner-supplied art wins.** If the client sends a photo or a logo, the anchor changes to it — the brief
  adapts, the rules do not bend (§14).
- **Write the two lines you will be judged by**: "this page is about X" and "the one thing you remember is
  Y". If they are not in `RESEARCH.md`, the build has no thesis.

---
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
6. **A site is not "done" when it ships — it is done when its dependencies are current.** Scaffold-time freshness is not enough: the scanner on a client's host reads `package-lock.json` and mails the owner about every advisory it finds, whether or not the vulnerable code path can run on a static host. Two standing checks, run at hand-off and on every revisit:
   - `npm audit --audit-level=high` — **zero** high/critical, no exceptions, no explanation. A security fix lands immediately, whatever the major.
   - `npm outdated` — every line is a decision, not background noise: *upgrade now*, or *parked until `<blocker>`* written in `POST-SETUP.md`. A major that has been available for a quarter without a note is a stale site, and stale is how a 9.8 arrives.
7. **Do not park a major on a whim.** `@astrojs/check` blocking TypeScript 7 is a real blocker and is documented above; "it might break something" is not. Upgrade on a branch, run the build and the browser smoke test, read the migration note when the build complains.
8. **Automate the watching, not the remembering:** every repo carries `.github/dependabot.yml` (copied from `repo-template/`) — grouped security updates weekly, majors monthly. Nobody catches a CVE by re-reading a rule file.

### 3. Extendable — but with justification

The agent MAY add mature, well-supported libraries when they materially serve the brief.
Always: document *why* in one line, verify it works with Astro static output, ensure
`npm run build` stays clean, prefer zero-JS or SSR-friendly options.

Pre-approved usual suspects (agent can pick without re-asking):
- **Leaflet + OpenStreetMap** for maps (replace Google Maps embed if privacy/offline matters)
- **A lightbox library** — only for pinch-zoom/pan; the overlay stays a `<dialog>` (§7.6)
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
- **Library:** none by default. The overlay is a native `<dialog>` opened with `showModal()` (§7.6b),
  which gives the focus trap, `inert` background, top layer and ESC for free; 20 images or 200, the
  markup does not change. An external lightbox is allowed only when the brief needs pinch-zoom or pan,
  and even then the overlay element must still be a `<dialog>` — the verify gate asserts
  `dialog[open]`. A `<div role="dialog">` fails the gate, not just the review.

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

  --font-family-sans: 'Manrope', sans-serif;  /* self-hosted, see §7.4 */

  --animate-shimmer: shimmer 2s ease-in-out infinite;
  --animate-float:    float 3s ease-in-out infinite;
  /* keyframes defined in global.css */
}
```
Components use tokens — never raw hex inside `.astro`.

### 7.4 Font self-host pattern
Self-host one file per subset. Prefer a **variable** face: one file covers the whole weight
range, instead of one file per weight (the starter's Inter set was 12 files / ~400 KB; Manrope
variable is 2 files / 33 KB).
```css
@font-face {
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 400 800;          /* variable range */
  font-display: swap;
  src: url('/fonts/manrope-var-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
                 U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
                 U+2212, U+2215, U+FEFF, U+FFFD;
}
```
Add a second block for the **Greek** subset (`U+0370-0377, U+037A-037F, U+0384-038A, U+038C,
U+038E-03A1, U+03A3-03FF`) from `/fonts/manrope-var-greek.woff2`. Add matching
`<link rel="preload" as="font" type="font/woff2" crossorigin>` in `Layout.astro` for those two
files only. **Check the family actually ships a Greek subset before choosing it** (§7.16).

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

### 7.6 Lightbox — native `<dialog>`, no library

One pattern, every gallery, any size. `<dialog>` + `showModal()` gives the focus trap, `inert` background,
top layer, ESC and focus return for free; a `<div role="dialog">` reimplements all five and gets three of
them wrong (§4.2, §9.5). The verify gate asserts `dialog[open]` — this is the only shape that passes.

**Global CSS** (`src/styles/global.css`) — the overlay is not a component-scoped element, so its rules
live here (§7.1):

```css
dialog.lightbox {
  border: 0; padding: 0; margin: 0;
  max-width: none; max-height: none;
  width: 100%; height: 100%;
  background: transparent;
  color: inherit;
}
dialog.lightbox::backdrop { background: rgb(0 0 0 / .92); backdrop-filter: blur(6px); }
dialog.lightbox[open] { display: grid; place-items: center; }
dialog.lightbox img { max-width: min(92vw, 1400px); max-height: 82vh; object-fit: contain; }
@media (prefers-reduced-motion: no-preference) {
  dialog.lightbox img { animation: lb-in .32s cubic-bezier(.22,.61,.36,1) both; }
  @keyframes lb-in { from { opacity: 0; transform: scale(.96) } to { opacity: 1; transform: none } }
}
```

**Component** (`src/components/Lightbox.astro`) — the starter ships this file; copy it rather than retyping:

```astro
---
interface Image { src: string; full?: string; alt: string; width: number; height: number }
const { images } = Astro.props as { images: Image[] };
---
<dialog id="lightbox" class="lightbox" aria-labelledby="lb-caption" aria-modal="true">
  <img id="lb-img" src={images[0].full ?? images[0].src} alt="" width="1600" height="1200" />
  <p id="lb-caption"></p>
  <button type="button" data-lb-prev aria-label="Previous image">&#8592;</button>
  <button type="button" data-lb-next aria-label="Next image">&#8594;</button>
  <button type="button" data-lb-close aria-label="Close gallery">&#215;</button>
</dialog>

<script>
  const dialog = document.getElementById('lightbox') as HTMLDialogElement;
  const img = document.getElementById('lb-img') as HTMLImageElement;
  const caption = document.getElementById('lb-caption')!;
  const items = [...document.querySelectorAll<HTMLElement>('[data-lightbox]')];
  let index = 0;

  const show = (i: number) => {
    const item = items[(index = (i + items.length) % items.length)];
    img.src = item.dataset.full || item.dataset.src || '';
    img.alt = '';
    caption.textContent = item.dataset.alt || '';
  };

  document.querySelectorAll<HTMLElement>('[data-lightbox]').forEach((item, i) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  document.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  document.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  document.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());

  // Click on the backdrop closes; a click on the image does not.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  // ESC is native. Focus returns to the opener automatically.

  // Touch swipe: horizontal distance over 40px, or a downward drag to dismiss.
  let startX = 0, startY = 0;
  dialog.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
  }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dy) > 90 && dy > Math.abs(dx)) dialog.close();
    else if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
</script>
```

**The grid calls it, nothing else does:**

```astro
<button type="button" data-lightbox data-src={img.src} data-full={img.full}
        data-alt={img.alt} aria-label={`Open image: ${img.alt}`}>
  <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" />
</button>
```
Render `<Lightbox images={gallery} />` once per page; the inline script above is a module, so it runs
after the markup exists. One `id="lightbox"` per page — two galleries, one dialog, both lists merged into
`images`.

**Rules that break it**

- The opener must be a `<button>` carrying `data-lightbox` (plus `data-index` for order), not a `<div>` or
  an `<a href="#">` — the verify gate clicks `[data-lightbox]`, and a non-button leaves keyboard users with
  nothing. One attribute name for every gallery on the site.
- Give the `<img>` a real initial `src` (the first gallery image, not `""`); an empty `src` resolves to the
  page URL and shows up as a broken request in every probe.
- `width`/`height` on the dialog `<img>` are the reserved box, not the final size — without them the dialog
  jumps on open and CLS pays for it.
- Keep the `<dialog>` in the component that renders it. Do **not** append it to `document.body` from JS:
  Astro's scoped styles stop matching and the overlay renders invisible (§7.1).
- Images above the fold in the grid are `loading="eager"`; everything inside the dialog is lazy — nobody
  opens a gallery before scrolling.

---

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

**Goal:** a project must build with a correct layout *before* any real photos exist. The agent never
blocks on missing images and never ships a broken layout to make up for them.

#### Tier 1 — Grey SVG placeholder (default, zero-dependency)

- Ship `public/images/placeholder.svg` once:
  ```xml
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9' preserveAspectRatio='xMidYMid slice'>
    <rect width='16' height='9' fill='%23e5e7eb'/>
  </svg>
  ```
- For per-slot sizing, use an inline data URI from `src/utils/placeholder.ts` instead of one SVG per aspect:
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
- The helper guarantees `width`/`height` on every placeholder → zero CLS now and after the real image
  lands. Keep the same aspect ratio when replacing.
- Mark every placeholder with the `placeholder: true` flag in the data file (§6) and list it in
  `POST-SETUP.md`. The gate greps for it (§10).

#### Tier 2 — Unsplash stock (only when the client supplies a key)

Stock exists so the owner can see the layout with real-looking photos before the brand shoot. It never
replaces the client's own images, and it is not a launch plan.

- Key lives in `.env` as `UNSPLASH_ACCESS_KEY` (gitignored); `.env.example` ships the empty key.
- **The script is in the starter: `scripts/fetch-unsplash.mjs`.** Run
  `npm run fetch-images -- "skiathos beach" "taverna interior"`, or copy the file into a project that
  predates it. It caches per query in `content/images/.unsplash-cache.json`, so re-runs cost nothing.
- **Hotlinking is required by the Unsplash terms** — use the returned `urls.raw` URL, append
  `&w=…&q=80&fit=crop`, never strip `ixid`. Do not download the binary.
- **Attribution is mandatory**: keep the `credit` field and render it (visible or `sr-only` linking to the
  photographer). Remove it only when the photo is replaced by the client's own.
- Rate limits: 50 requests/hour on a demo app, 1000 after approval. One query per section, five max.
- Translating sections into queries is the agent's job (`rooms` → "boutique hotel room sea view",
  `menu` → "greek taverna food") — never a generic "business" search.

#### Swapping in the real photos

`npm run images -- Images/` (§7.11) rewrites the data entries in place, clears `placeholder`, keeps a
`credit` only if the slot is still stock. `POST-SETUP.md` keeps "swap stock for brand photos" as the last
line item until the owner confirms.

---

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

### 7.16 Design default — good taste by default, never blocking a brief

Two layers, never mixed up:

| Layer | What a finding means |
|---|---|
| **Gate** — contrast, overflow, heading levels, tiny text, content hidden behind an animation | **Fix it.** Not waivable by a dev |
| **Default** — the taste rules below | **Fix it, or waive it in one line with a reason** |

A dev with no design instinct must be able to ship a good-looking site by following this page.
A dev with a creative brief must never be stopped by it — only asked to write down why.

**Anchor before layout (see §1).** If you cannot name the one image or idea the page is built
around, you are about to build the trend instead of this business.

**Never by default** — rule ids are the design detector's (§10, item 4):

- **Palette:** purple/violet gradient or cyan-on-dark (`ai-color-palette`); the warm cream/beige
  "tasteful" page background (`cream-palette`); gradient text (`gradient-text`); coloured glow
  shadows, radial halos or spotlight washes (`dark-glow`, `radial-halo`, `radial-spotlight-glow`).
- **Type:** Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk (`overused-font`);
  oversized italic serif hero (`italic-serif-display`); a full sentence at display size
  (`oversized-h1`); size steps under 1.25× (`flat-type-hierarchy`); a tiny tracked-caps eyebrow
  above the hero (`hero-eyebrow-chip`, `kicker-above-heading`); numbered section labels
  (`numbered-section-labels`); all-caps body copy (`all-caps-body`).
- **Layout:** cards inside cards (`nested-cards`); a rounded icon tile above every heading
  (`icon-tile-stack`); a thick accent border on one side of a card (`side-tab`); one spacing value
  everywhere (`monotonous-spacing`); a whole row wearing hairline border + wide shadow
  (`gpt-thin-border-wide-shadow`); repeating-gradient stripes or a decorative grid background;
  auto-scrolling marquee (`marquee`).
- **Motion:** bounce/elastic easing (`bounce-easing`) — use ease-out-quart/quint/expo; decorative
  pulsing dots (`pulsing-dot`) and blinking cursors (`blinking-cursor`).
- **Copy:** marketing buzzwords — streamline, empower, world-class, cutting-edge
  (`marketing-buzzword`); "X. Just Y." cadence across sections (`aphoristic-cadence`); em-dash
  saturation (`em-dash-overuse`).

**Greek-safe face shortlist.** A distinctive face is worth nothing on a Greek site if it has no
Greek subset: the failure is silent per-glyph fallback, so one paragraph renders in two faces.
Verified to serve Greek and absent from the overused list: **Manrope, Literata, Source Serif 4,
IBM Plex Sans / Serif / Mono, Alegreya, Fira Sans, Commissioner, GFS Didot, GFS Neohellenic,
Gentium Book Plus, Ubuntu.** The starter ships **Manrope** (variable, Greek + Latin). Starting
points by attitude: sharp/editorial → GFS Didot or Source Serif 4 display + Manrope body;
soft/friendly → Literata or Alegreya + Commissioner or Fira Sans; trade/utility → IBM Plex Sans,
Plex Mono for figures.

**The override — this is what keeps creativity unblocked.**

1. *A deviation is allowed. An undocumented deviation is not.*
2. Record it where the choice lives: `<!-- impeccable-disable overused-font: brand face, supplied
   by client -->` in markup, or `data-impeccable-ignore="hard-offset-shadow"` on the element.
3. Whole-project value ignore (brand font used everywhere):
   `npx impeccable ignores add-value overused-font <Family> --reason "brand font"`.
4. Gates are **not** waivable by a dev: contrast, overflow, heading levels, tiny text, content
   hidden behind an animation. Fix them or ask the owner.
5. Two attempts, then decide. Ship the deviation with its reason instead of negotiating
   aesthetics with a checklist all afternoon.

---

## 8. SEO contract (day one, every project)

### 8.1 The head, per page

- `<title>` = page name + titleSuffix, **15–60 chars**, unique per page; description **50–160 chars**,
  unique, written as the answer a visitor came for — not a keyword list.
- Exactly one `<h1>`; no skipped heading levels. Gate, not preference.
- Canonical via `canonicalUrl(path)`, self-referencing, trailing slash, one canonical per page.
- `<meta name="robots" content="index, follow, max-image-preview:large">` on every indexable page.
  `noindex` only on 404 and on a staging host (belt: `X-Robots-Tag` in the host config too).
- OpenGraph + Twitter card, `og:image` 1200×630 with alt, `og:locale`, `og:type`.
- `hreflang` **only for locales that exist** — a second language that is not built must not emit an
  alternate pointing at the same URL. When it exists: self + the other locale + `x-default`.
- `manifest.webmanifest`, favicon set, `theme-color` for both schemes (§0.5.3).
- JSON-LD `LocalBusiness` (or `Restaurant`, `Store`, `HealthAndBeautyBusiness`, `LodgingBusiness` per
  brief) via the generator, `BreadcrumbList` on interior pages, `WebSite` on the root.
- NAP string identical in `SITE`, schema, footer and contact — one source, four renderings.

### 8.2 Crawl and index

- `sitemap-index.xml` via `@astrojs/sitemap`, `lastmod` present, 404 excluded.
- `robots.txt` allows all, points at the sitemap, absolute URL, no `Disallow` left over from testing.
- Every page reachable from nav or footer — no orphans, no page only reachable by sitemap.
- Image sitemap entries when the gallery is a primary asset (`image:image`/`image:loc`).
- Descriptive image filenames (`villa-anemoossa-sea-view-01.webp`), never `IMG_2041.jpg`.
- Search Console: verification meta present and **sitemap submitted** before hand-off — in
  `POST-SETUP.md`, not in a hope.
- Rich Results Test on the deployed home + one interior page; zero errors, warnings named or fixed.

### 8.3 What we never emit

- `aggregateRating` for self-serving reviews. Google only accepts review markup for reviews about
  *other* businesses; a taverna marking up its own Google rating is ineligible at best, a spam signal at
  worst. Ratings appear as visible text with a link to the source (§7.16, §19).
- Ratings, awards, "as seen in" logos or certification badges the client cannot evidence.
- Keyword-stuffed alt text, hidden text, doorway pages per locality permutation, or the same intro copy
  on two pages (thin/duplicate content is a Search Essentials spam policy, not a style nit).

Keyword strategy derives from `RESEARCH.md` (§1) — competitor phrasings, then the client's own words,
never this rule file.

---

## 9. Accessibility baseline (every section, every project)

The floor is WCAG 2.2 AA, and the difference between "axe passes" and "a person can use it" is the
point of this section. Every item is checked, not assumed.

### 9.1 Layout and reading

- Mobile-first: every section works at 320 px before it is styled up.
- **No horizontal scroll, and never `html, body { overflow-x: hidden }` to fake it.** `hidden` clips the
  content past the edge and the visitor cannot reach it; it hides the defect from the screenshot review
  too. Find the offending element (fixed width, `100vw`, negative margin, untransformed overlay) and fix
  it. Assert `document.documentElement.scrollWidth <= window.innerWidth` at 320 / 390 / 768 / 1440.
- No fixed height on anything holding text (buttons, cards, badges) — `min-block-size` plus padding.
- Layout survives 200 % zoom and a raised browser font size; `rem` for type, never `px` font-size.
- `user-select: none` only on chrome (drag handles, decorative labels), never on body content.
- Headings in order, one `<h1>`, and never a heading used for size.
- Landmarks: `<header>`, `<nav>`, `<main>` (exactly one), `<footer>`, `<section aria-labelledby>`
  where the section has a heading. Skip link first in the body, visible on focus, targets `<main>`.
- `scroll-margin-top` on every anchor target (§0.5.3).

### 9.2 Controls and focus

- Tap targets ≥ 44×44 px (Google's floor is 24 — we keep 44 because thumbs).
- `:focus-visible` styled once in the token layer (§0.5.2), contrast ≥ 3:1 against the adjacent colour.
  Never `outline: none` without a replacement that measures.
- No `tabindex` above `0`, ever. `tabindex="0"` only on a non-native control that already carries a role;
  the real fix is a `<button>` or `<a href>`.
- Never reorder interactive content with `order`, `row-reverse` or `grid-auto-flow: dense` — visual order
  and tab order diverge and keyboard users pay for it.
- Enter/Space handled only where no native element exists; native `<button>`/`<a href>` first.

### 9.3 Text, images, meaning

- Every `<img>` has `alt`; decorative images `alt=""`, decorative inline SVG `aria-hidden="true"`,
  meaningful inline SVG `role="img"` + `<title>`. No "image of", no keyword stuffing.
- Colour never carries state alone — pair it with text, icon or shape (error, required, selected, stock
  status). Same in `forced-colors` mode: any state drawn with `box-shadow`, gradient or background-image
  disappears there, so give it a border or a glyph.
- Contrast AA: 4.5:1 body, 3:1 large and for UI edges; check the pair in **both** schemes if a dark
  palette ships, and re-check text over photography with a scrim, not a hope.
- Language: `<html lang>` from the route, `lang` on any inline foreign-language passage.

### 9.4 Forms (the part every build gets wrong)

- One `<label for>` per control, hint above the input, both tied with `aria-describedby`.
- `autocomplete` tokens on every personal field — `name`, `given-name`, `family-name`, `email`, `tel`,
  `street-address`, `postal-code`, `organization`, `url`. Missing tokens are a WCAG 1.3.5 failure and the
  mobile keyboard loses its fill button.
- Correct `type` / `inputmode`: `type="tel"` + `inputmode="tel"` for phone, `type="email"`,
  `inputmode="numeric"` for a code — `type="number"` loses leading zeros and scrolls the value.
- Validate on blur or submit, clear the error on input — never announce an error on every keystroke.
  One polite live region per page carries the message; on success, focus moves to the confirmation and
  the region announces it.
- Errors are text next to the field and in the live region, `aria-invalid="true"` only while the message
  is present.
- Never disable the submit button as validation (the user cannot see what is wrong). Disable it *after*
  a successful submit to stop doubles.
- Never block paste, never block `autocomplete="off"` on contact fields, never auto-submit on change.
- Honeypot + `reportValidity()` (§0.5.3), never a captcha.

### 9.5 Overlays, motion, media

- Modals and lightboxes are native `<dialog>` + `showModal()` (§7.6b). Anything custom needs `inert` on
  the outside, `role="dialog"`, focus moved in, focus returned on close.
- `prefers-reduced-motion` honoured for every animation, including scroll-reveal, parallax and the
  marquee; the reduced state is the readable state, not a blank page.
- No autoplaying audio. Video carries `controls` and captions when there is speech; background video is
  `muted` + `aria-hidden="true"` + a visible pause control.
- Nothing opens over the content on load — no newsletter modal, no interstitial, no cookie wall when the
  site truly sets no cookies.

### 9.6 Verification before hand-off

1. `a11y-check.mjs` (axe) passes on every route — it is a floor, not a certificate.
2. Keyboard pass: tab through the whole page, open and close every overlay with ESC, focus never lost,
   visible at every stop.
3. One screen-reader pass (VoiceOver on macOS) over home + the contact form: labels announced, error
   announced, order sensible.
4. Zoom to 200 % and 320 px: nothing clipped, nothing overlapped, no two-column squeeze.
5. Both colour schemes, and `forced-colors: active` emulation: every control still visible and every
   state still legible.

---

## 9.7 Performance contract — Core Web Vitals, or it did not happen

Google's acceptance bar is **field data at the 75th percentile, mobile**: **LCP ≤ 2.5 s, INP ≤ 200 ms,
CLS ≤ 0.1**. Lighthouse is a diagnostic that guesses; PageSpeed Insights / CrUX is the verdict. A green
Lighthouse 90 with a red CrUX is a failing site.

Record in `POST-SETUP.md`: PSI mobile p75 for LCP / INP / CLS on the deployed URL, plus the date. No
numbers, no hand-off.

### 9.7.1 LCP (loading)

- The hero image is in the raw HTML — `<img>`, not a CSS background, not injected by JS. If it must be a
  CSS background, preload it: `<link rel="preload" as="image" fetchpriority="high">`.
- `fetchpriority="high"` on the hero `<img>` and on its preload. Never combined with `loading="lazy"`.
- `loading="lazy"` for everything below the fold; `fetchpriority="low"` (plus lazy) for media that is
  above the fold but hidden — carousel slides, mega-menu art, closed dialogs.
- `srcset` + `sizes` on every content image; hero `sizes="100vw"`, cards their real column width. AVIF
  with WebP fallback via `<picture>`, never a raw 4 MB JPEG.
- Hero image budget ≤ 200 KB at 1x, ≤ 400 KB at 2x, correct dimensions in the attributes.

### 9.7.2 Fonts and CSS

- Self-hosted subset `woff2`, `font-display: swap`, and **metric overrides** (`size-adjust`,
  `ascent-override`, `descent-override`) on the fallback face so the swap does not reflow (§9 CLS).
- Preload only the two faces used above the fold, always with `crossorigin`; no `fetchpriority="high"` on
  fonts (they already load high, and preloading weights you do not use starves the hero).
- No `@import` in CSS — it serialises the critical path. Tailwind v4 already emits one stylesheet.
- Third-party CSS/JS is deferred and, where possible, interaction-loaded (map on click, video on click,
  embed behind a facade — §0.5.5).

### 9.7.3 INP (interactivity)

- Any handler that can exceed ~50 ms is sliced; yield with `scheduler.yield()` and fall back to a
  `setTimeout` promise. Over ~250 ms of work moves off the main thread.
- `scroll`, `resize`, `pointermove` listeners are passive and rAF-throttled; never one per element when
  one delegated listener does the job (the parallax + scroll-progress + header-state trio is the usual
  offender).
- No layout thrashing: batch reads (`getBoundingClientRect`) then writes (`style.transform`), never
  interleaved in a loop.
- Animate `transform`/`opacity` only. `will-change` on a handful of elements, never globally.
- The mobile menu, accordions and sliders open in one frame — no animation queue that makes the second
  tap feel dead.

### 9.7.4 CLS (stability)

- `width`/`height` (or `aspect-ratio`) on every image, video, iframe and embed before it loads.
- Reserve the map slot, the carousel slot and any late-loading banner; never insert content above the
  fold after paint.
- Accordion height changes use the grid trick (§7.8), never `max-height` guessing.
- No `content-visibility` above the fold.
- Web font swap is covered by metric overrides; no late font substitution in the hero.

### 9.7.5 Long pages, media, caching

- Beyond ~8 sections: `content-visibility: auto` + `contain-intrinsic-size` (with `rem`/`lh` units derived
  from the content) on below-fold bands, and re-check keyboard reachability afterwards.
- Video: explicit dimensions, `poster`, `preload="none"`, `loading="lazy"` when offscreen, captions track
  when there is speech, never autoplay with sound, never a hero video that is also the LCP image.
- Hashed assets `Cache-Control: public, max-age=31536000, immutable`; HTML short-lived but **not**
  `no-store` — that kills bfcache. No `unload`/`beforeunload` handlers (§18).
- `preconnect` only for an origin used above the fold; none if there are no third parties. Optional
  `prefetch` of the most likely next page on the home page.

### 9.7.6 Weight budget (per page, gzipped)

| Asset | Budget |
|---|---|
| HTML | ≤ 50 KB |
| CSS (all) | ≤ 30 KB |
| JS initial (before interaction) | ≤ 20 KB |
| Hero image | ≤ 200 KB (1x) |
| Everything above the fold, cold load | ≤ 500 KB |

Over budget means naming what grew and why, in one line, before shipping. Not "it's fine on my Mac".
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
4. **Design detector** — `npx impeccable detect src/` for the code tells, and
   `npx impeccable detect http://localhost:<port>` against the running server for the
   rendered-only ones (contrast, tiny text, overflow). Exit `2` = findings, `1` = a target could
   not be scanned. Triage per §7.16: `quality/*` findings are gates, `slop/*` findings are
   defaults to fix or waive in one line with a reason. A clean scan is not proof the page is good —
   the screenshots still decide.

**Definition of done — the whole list, in this order, before you say "built".**

1. `npm run build` passes with zero errors and zero unhandled warnings.
2. Every route opens on the built output, zero console errors, zero failed requests on a cold load.
3. Every interactive element from §4 is click-tested in every state, at 390 and at desktop.
4. Gates green: `seo-check`, `a11y-check` (axe), `verify-page` (dialog + interactions), layout sweep,
   `impeccable detect` (§10 items above), and `npm run check:platform` (headers, `max-image-preview`,
   colour scheme, hero priority, image dimensions, single `h1`, no positive `tabindex`, weight budgets).
5. **Accessibility manual pass** — §9.6: keyboard through the page, one screen-reader pass, 200 % zoom,
   both colour schemes, `forced-colors` emulation.
6. **Headers live** — `curl -sI https://<deployed>/ | grep -i 'strict-transport\|content-security\|referrer\|permissions\|x-content-type'`
   returns the §18 set. A header file in the repo is not a header on the wire.
7. **CWV measured** — PSI on the deployed URL, mobile; p75 LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, numbers
   pasted in `POST-SETUP.md`. A red field metric blocks hand-off; a yellow Lab score does not.
8. OG card, canonical, schema and `max-image-preview` render in the page source; Rich Results Test clean.
9. Every image has real `width`/`height` (grey placeholder fine, broken layout not) and the hero carries
   `fetchpriority="high"` with no `loading="lazy"`.
10. Every placeholder, waiver and unverified fact is listed in `POST-SETUP.md` — the count in the audit
    commands above matches the entries.

A section is "done" when 1–10 hold for it, not when it looks right in one browser window.

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
- Don't ship the reflex AI look — Inter, purple/violet gradient, cream off-white page, gradient
  text, eyebrow kicker above the hero, rounded icon tile above every heading, nested cards,
  coloured glow (§7.16). Waive one explicitly, in writing, or don't ship it.
- Don't pick a display face without a Greek subset for a Greek brief — verify the `.woff2`, don't
  assume (a font's Latin presence says nothing about its Greek coverage).
- Don't "fix" overflow with `overflow-x: hidden` on `html`/`body`, and don't size a full-width box with
  `100vw` (it ignores the scrollbar). Fix the element, then assert `scrollWidth === innerWidth` (§9.1).
- Don't set a `px` font-size, a fixed height on text, or `user-select: none` on content (§9.1).
- Don't convey state with colour alone, or with `box-shadow`/gradient as the only border — both vanish in
  forced-colours mode (§9.3).
- Don't use `tabindex` above `0`, don't reorder interactive content with `order`/`-reverse`/dense grid
  (§9.2), and don't put a `role="dialog"` on a `<div>` when `<dialog>` exists (§7.6b, §9.5).
- Don't validate by disabling the submit button, don't announce errors on every keystroke, don't block
  paste, don't omit `autocomplete` tokens (§9.4).
- Don't open anything over the content on load — no newsletter modal, no interstitial, no cookie banner
  for a site that sets no cookies (§9.5, Google page-experience).
- Don't autoplay audio or video with sound, and don't use a hero video that is also the LCP element (§9.7).
- Don't ship `Cache-Control: no-store` on HTML, or an `unload` handler — both kill bfcache (§9.7, §18).
- Don't assign user or CMS data with `innerHTML`; `textContent` or `setHTML()` (§18).
- Don't emit `aggregateRating` for the client's own reviews, or any award/badge they cannot evidence (§8.3).
- Don't put a fake trust strip (Google logo + five stars + "trusted by our customers") on a site with no
  linked, real reviews. It is a claim, and it is the first thing a client is asked to justify (§19).

---

## 17. Quick decision table (when unsure, pick the default)

| If the brief asks for… | Default |
|---|---|
| "a map" | OpenStreetMap embed (privacy, no API key) |
| "a gallery" | Responsive grid + native `<dialog>` lightbox (§7.6b); external library only for pinch-zoom |
| "a video" | poster + `preload="none"` + dimensions + lazy when offscreen; never a hero that competes with the LCP image |
| "dark mode" | Only if the brief asks. Always ship `color-scheme` + two `theme-color` values; a second palette is a design decision, not a default |
| "a long page" (>8 sections) | `content-visibility: auto` + `contain-intrinsic-size` on below-fold bands, keyboard re-checked |
| "a form" | Labels + `autocomplete` tokens + one polite live region + honeypot; validate on blur, never a disabled button |
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
| "a hero" | one anchor image + a headline that carries itself — no eyebrow, no pill, no gradient (§7.16) |
| "a font" / no preference | Manrope (starter default); otherwise the §7.16 shortlist, Greek subset verified |
| "make it pop" / "more premium" | name the move (bolder / quieter / typeset) and one target — never restyle the whole page |
| "make it look like <competitor>" | copy the structure and the information order, never the palette, type or tells |

---

## 18. Security, headers and hosting

A static brochure site has almost no attack surface, and almost every build still ships none of the
five-minute defences. All of these live in a host config file, not in code.

### 18.1 The header set — every site, every host

| Header | Value | Why |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | pins HTTPS after the first visit |
| `X-Content-Type-Options` | `nosniff` | stops MIME sniffing on uploads and proxied assets |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | no path leakage to third parties |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` — open one only if the brief needs it | nothing gets silently requested |
| `Content-Security-Policy` | see below | the only real XSS backstop |
| `Content-Security-Policy: frame-ancestors 'none'` | part of the same header | clickjacking; drop to `'self'` only for a deliberate embed |
| `Cache-Control` | hashed assets `public, max-age=31536000, immutable`; HTML `public, max-age=0, must-revalidate` | fast reloads, instant deploys, bfcache kept alive |

Where the file goes: `public/_headers` for Netlify and Cloudflare Pages (shipped by the starter),
`vercel.json` for Vercel, `.htaccess` for Apache/cPanel hosts. Pick the one for the host the client pays
for and delete the others from the build so nobody debugs a header that never applied.

### 18.2 CSP for a static Astro site

Start here, then tighten:

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
font-src 'self';
frame-src https://www.openstreetmap.org https://www.google.com;
form-action 'self' https://formspree.io https://api.web3forms.com;
frame-ancestors 'none';
base-uri 'none';
object-src 'none';
```

- `'unsafe-inline'` for script and style is the honest starting point for Astro's inline islands and
  Tailwind's inline styles. Once the page's inline scripts stop changing, replace it with their SHA-256
  hashes — then the policy actually blocks injected script.
- `frame-src` lists the map provider the brief chose, nothing else. Adding an embed means adding an
  origin and saying so.
- `form-action` lists the form endpoint. A CSP that allows everything is decoration, and a CSP that
  allows nothing breaks the contact form on the client's first day.
- Third-party script (analytics, widget): self-host it, or pin it with `integrity` + `crossorigin` (§18.4).

### 18.3 Code hygiene

- `innerHTML` only with a constant string; user, CMS or API content goes through `textContent`,
  `replaceChildren()` or `setHTML()`.
- No `eval`, no `new Function`, no `document.write`, no inline `onclick=`.
- No secrets in the client bundle: form endpoints are public by design, API keys are not. An Unsplash key
  or a Maps key that must ship is restricted by referrer in the provider console and named in
  `POST-SETUP.md`.
- Staging and preview hosts send `X-Robots-Tag: noindex` and a `robots.txt` that disallows everything.

### 18.4 Third parties, kept honest

- Every external `<script>`/`<link rel=stylesheet>` is pinned with `integrity` + `crossorigin`, or
  self-hosted. A CDN URL that silently changes content is a supply-chain hole.
- Maps, video and embeds behind a click-to-load facade (§0.5.5) — better privacy *and* better LCP.
- One line per third party in `POST-SETUP.md`: what it is, who receives data, how to remove it.

---

## 19. Content quality floor (people-first, or the SEO is theatre)

Google's guidelines are explicit that technical perfection does not rescue thin or untrustworthy content.
This section is the part a design checklist cannot cover.

### 19.1 Every page earns its existence

- A page exists because a visitor needs it, not because a keyword cluster wanted it. One page per real
  service, real room type, real trip, real place served.
- **No doorway pages.** Ten near-identical "villa in <beach name>" pages are a spam-policy violation.
  One page listing the areas served beats nine thin ones.
- No duplicate intros across pages; each page's first 100 words answer a different question.
- Seasonal and factual content carries its verification date (`Prices correct for the 2027 season`),
  and the same date goes in `POST-SETUP.md`.

### 19.2 Trust signals must be real

- Reviews: visible text plus a link to the source. Never `aggregateRating` for the business's own reviews
  (§8.3). Never a rating on a page that cannot link to it.
- Names, faces and facts: the family that runs it, the year it opened, the address that appears on the
  map. A brochure site's advantage over an OTA is that a human is behind it — show that human.
- Photography: the client's own photos first, commissioned second, stock last and credited. A tourism
  site with generic stock of "a Mediterranean beach" is indistinguishable from the 200 sites above it.
- No invented certifications, awards, "as featured in" logos, VAT numbers, DPO or insurance claims.

### 19.3 Copy

- Written for a person deciding whether to book: what it is, where exactly, what it costs, what happens
  next, who to ask.
- Competitor phrasings from `RESEARCH.md` are used to *match the words people search*, never to pad.
- The buzzword and cadence bans from §7.16 apply to every page, including the meta description.
- The Greek version or the English version. Never machine-translated leftovers in production (§0.5.4).

---

End of file. Copy this verbatim into your project root as `AGENTS.md` (or the file
your IDE prefers) and start the kickoff interview in §1.