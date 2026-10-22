# Proposed additions to BROCHURE-SITE-RULES.md

Status: **draft — review before merging.** Produced from a post-mortem of the
Villa Anemoessa rebuild (Astro 7 + Tailwind v4, single-page villa site, 2026-09).
Each item names the target section and includes suggested verbatim text.

---

## 1. §1 Phase B — NAP facts that MUST be asked, never silently placeholder-ed

**Why:** the build shipped `CONTACT_EMAIL@example.com` and approximate hamlet
coordinates because neither was extracted from the reference site — and neither
was asked. Rules already forbid placeholder business facts, but the interview
did not force-ask email/geo.

Add to the end of Phase B:

> **Hard-mandatory contact fields** — if the reference link does not provide
> them, ask the user directly, in the same message; never placeholder a field
> the brief implies exists (email, phone, WhatsApp, exact coordinates):
> - email (even if "no email — phone/WhatsApp only" is the answer)
> - exact pin: ask for the Google Maps place link (or "you decide" → resolve via
>   Nominatim AND show the resolved lat/lng for confirmation before building)

And in §7.13, after the fact-extraction flow, add:

> After scraping ANY reference link, present the extracted NAP/geo to the user
> for confirmation in the SAME interview message. Placeholders are only allowed
> for fields the user explicitly said do not exist. Google-Maps place links are
> the authoritative geo source — prefer them over Nominatim results, which are
> often "nearest place" approximations.

---

## 2. §7.7 Mobile menu — Rules 8 & 9 (hard, verified)

**Why:** shipped a menu whose WhatsApp CTA was invisible (light text on cream:
a CSS specificity clash, `#overlay a` beating utility classes), whose background
kept scrolling (`html` not locked), and whose CTA block mis-aligned at short
viewport heights.

Add as Rules 8 and 9:

> #### Rule 8 — Scoped link colors + measured contrast
> Never style overlay links with a bare element selector
> (`#mobile-menu a { … }`) — it beats any utility color by specificity. Scope to
> `.menu-link` / `.menu-cta` classes. After styling, MEASURE the contrast of every
> contrasting element (buttons, links, text on glass) against its background and
> require WCAG ≥ 4.5:1 (7:1 for large text) — compute it, don't eyeball it.
> Icon-only or text-on-inverted-color buttons are the usual victims.

> #### Rule 9 — Scroll containment
> Lock BOTH `document.documentElement` and `document.body` to `overflow: hidden`
> while open, and make the overlay itself the scroll container
> (`overflow-y: auto; overscroll-behavior: contain`), so the page behind can
> never scroll. Verify: while open, `window.scrollY` must not change under any
> wheel/touch input; after close it must scroll again.

And a verification clause in §7.7's invariants table:

> | Rule 8/9 not verified | Invisible CTAs, scrollable background — both silent to look at but broken |

---

## 3. §4.7 Forms — required fields are a brief decision

**Why:** assumed every old-site field was required and shipped "Message *" with
min-length; the client wanted it optional. Blanket-requiring fields is a
conversion decision, not a technical one.

Add to §4.7 Behaviour:

> Required fields are set per brief, never blanket: message/notes fields are
> OPTIONAL by default unless the client says otherwise. Make the required set a
> data-file value, not scattered `required` attributes.
>
> When editing multi-line JS inside `<script is:inline>`, rewrite the whole block
> or use a linter — string-patching out a branch commonly leaves unbalanced
> braces; always `npm run build` immediately after such an edit.

---

## 4. New §7.15 — Live UX patterns (header auto-hide, floating CTA, scrollspy)

**Why:** these were requested by the client and shipped with bugs on first
attempt (header never re-appeared on slow scroll-up because of a symmetric
±6px threshold; floating button needed aria/tabindex discipline).

Hard rules:

> **Header auto-hide (scroll direction):**
> - Hide only on clearly downward motion: `delta > +10` and `y > 80`.
> - Show on ANY upward motion (`delta < -3`), at `y < 80`, or at page top.
>   ASYMMETRIC thresholds are mandatory — symmetric ones trap the header in a
>   stuck-hidden state on trackpads/smooth mice whose per-event deltas are small.
> - Respect `prefers-reduced-motion`: never hide for those users.
>
> **Floating contact CTA:**
> - Appear after `~360px` scroll (so it never covers the hero CTA); hidden state
>   must be `opacity:0; pointer-events:none` + `aria-hidden` + `tabindex="-1"`,
>   removed together when shown.
>
> **Scrollspy:**
> - Initialize after DOMContentLoaded (inline scripts run before later sections
>   exist — observing null elements silently kills the observer).
> - Use an IntersectionObserver with a middle-viewport band rootMargin
>   (`-40% 0px -55% 0px`) and toggle one active class.

---

## 5. §10 Build & verify — new hard gates

**Why:** shipped 2 image 404s and one invisible-CTA bug that a cold-load check
would have caught before handoff.

Add to the gate, before "declared done":

> ```bash
> # 1) Asset-reference integrity — every /images/... URL in dist must exist on disk
> python3 scripts/check-assets.py   # or: grep -oE '/images/[^"]+' dist/index.html | xargs -I{} test -f dist{}
> # 2) Icons exist in the icon set (astro-icon fails at build for bad names —
> #    check the @iconify-json/* list first if build errors mention icons)
> # 3) Browser E2E on the BUILT output (not just dev): open at 390×844 + desktop,
> #    click menu open/close, open lightbox, then assert:
> #    - zero console errors / uncaught exceptions
> #    - zero HTTP 4xx/5xx in the Network log (cold load, cache cleared)
> #    - header auto-hide/reveal via REAL wheel/gesture input
> ```
>
> A Python/Node script for (1) is the norm: parse dist HTML for `src`/`srcset`/
> CSS-URL image references and assert each maps to an existing file.

---

## 6. §16 New don'ts (technical)

> - Don't interpolate Astro `{expressions}` inside `<script is:inline>` — inline
>   scripts pass through RAW; configuration values must travel via `data-*`
>   attributes on the element.
> - Don't reference icon names without checking the collection: run
>   `python3 -c "import json; json.load(open('node_modules/@iconify-json/<set>/icons.json'))['icons'].keys()"`
>   (or equivalent) on every icon name used.

---

## 7. Phase D — image mapping when the agent cannot view images

**Why:** 4 of 5 photo slots were guessed wrong; the client re-supplied URLs on
later turns. Transparent, cheap to fix.

Add to Phase D after the images-folder question:

> If the agent cannot visually inspect images (no vision model): DO NOT guess
> which photo fills which slot. Generate a numbered contact sheet from the image
> folder, and ask the client to either (a) paste the sheet numbers per slot
> (hero / about / each service or tile / gallery order), or (b) provide image
> URLs directly. Until answered, use the folder order as an explicit, flagged
> assumption in POST-SETUP; never present guessed mappings as final.

---

## 8. §1 Step 0 — one design-attitude question (prevents rework)

**Why:** the client rejected both the rounded-corner aesthetic and the
dash-overline heading ornament after build — design defaults, not content.

Add to Step 0's question list:

> - Design attitude, one pick: **sharp/editorial** (square corners, hairline
>   dividers, restrained ornament) OR **soft/rounded** (chips, capsules, friendly
>   shape). Default per vertical: leisure/premium → sharp editorial.

Add to §7 (reference patterns) a tested heading-decoration default:

> Tested heading decoration: gold square marker (7×7px) before uppercase
> letterspaced overline labels + a short 3rem×3px gold underline bar beneath
> section titles (centered or left per alignment). Avoid dash/rule ornaments
> that double as horizontal lines — clients perceive them as unfinished.