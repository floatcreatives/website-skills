# Bilingual foundation & GDPR floor

Companion to `BROCHURE-SITE-RULES.md` §0.5.4 (language seam) and §0.5.5 (privacy floor). Every project
ships both from day one, even when only one language is live and nobody has asked about cookies.

---

# 1. Bilingual-ready foundation (EL/EN)

A second language is a seasonal request: the owner asks for English months after launch, usually in
season. The answer then has to be "fill one file", not "rewrite every component". Cost now: one
dictionary, one `t()`, one route rule. Cost if skipped: every route, component, nav item, schema block and
sitemap entry rebuilt.

## 1.1 Decide the route shape once

| Shape | Use when | Notes |
|---|---|---|
| root = default language, second at `/<lang>/…` | default (Greek site, later English) | `/` keeps the ranking URL for the main audience; `/en/` is additive. Recommended. |
| one language only, no prefix | single-language brief | still ship the dictionary, just one file. |

- Trailing slashes everywhere, same slug structure in both languages (`/menu/` ↔ `/en/menu/`) unless a
  translated slug is genuinely better SEO; if it is, keep a redirect map between them.
- `<html lang>` comes from the route, never a constant. `og:locale` + `og:locale:alternate` on every page.
- Every page emits `<link rel="alternate" hreflang="el" href="…">`, the same for `en`, plus
  `hreflang="x-default"` pointing at the default-language URL.
- The sitemap carries both. `@astrojs/sitemap` needs its `i18n` block, or half the site is missing from it
  and the gate cannot see the gap.

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://client.gr',
  i18n: { defaultLocale: 'el', locales: ['el', 'en'], routing: { prefixDefaultLocale: false } },
  integrations: [sitemap({ i18n: { defaultLocale: 'el', locales: { el: 'el-GR', en: 'en' } } })],
});
```

## 1.2 One dictionary, typed, never a literal in a component

```
src/i18n/
  types.ts     # type Lang = 'el' | 'en'; type Dict = typeof el
  el.ts        # the live, complete dictionary
  en.ts        # export const en: Dict = { ... }   ← stub or complete, same shape
  index.ts     # const dicts = { el, en }; export const useT = (lang: Lang) => (k: keyof Dict) => dicts[lang][k]
```

- Flatten to one key map (`nav.menu`, `hero.cta`, `form.consent`), not nested prose objects: a missing key
  then fails type-check in `en.ts` instead of rendering `undefined` at runtime.
- `Dict` is derived from the **default** dictionary, so a new key in `el.ts` breaks the build until `en.ts`
  has it. That build error is the whole safety net.
- Client data (NAP, phones, email, geo, hours) stays in `site.config.ts`, language-neutral, imported by
  both. Only labels and sentences move into the dictionary.
- Nothing a visitor reads is written in an `.astro` file (rules §6). That rule is what makes the seam
  cheap: a build with literals in components cannot be translated without editing components.

Content collections localise as `Record<Lang, Entry[]>` in one file (`menu.ts` → `{ el: [...], en: [...] }`)
or as `<slug>.<lang>.md`. Never a duplicated `content/en/` tree that drifts from the Greek one.

## 1.3 The switcher ships hidden, not later

- One component, rendered in the header and the mobile overlay, `aria-label` in the current language.
- It renders only when the target dictionary is complete (`isComplete('en')`). A visible switcher that
  leads to half-Greek pages is worse than none.
- It preserves the current path (`/menu/` → `/en/menu/`), falls back to the language home when that page
  does not exist yet, and never uses `hreflang` markup to perform a redirect.
- No flag icons. `EL` / `EN` text, or the language names.

## 1.4 What does not get translated

Trade and product vocabulary stays English on a Greek site, and brand names stay as they are (`Manual`,
`Automatic`, `Diesel`, `A/C`, `SUV`, `Bluetooth`, `Apple CarPlay`, `TDCi`). Prices keep the euro symbol and
Greek decimal comma; dates, hours and plurals come from `Intl` with the route's locale, never
hand-formatted.

Greek pluralisation is its own small rule: `1 όχημα` / `2 οχήματα`, hours read `10:00 – 03:00` in both
languages. Write the EN copy as EN, not as a translation of the EL sentence — machine-translated parallel
copy is the tell an owner spots first.

## 1.5 Checklist to flip the second language on

1. `en.ts` complete → type-check passes, switcher appears.
2. `/en/` route generated for every indexable page (not for `404`, which stays per-domain).
3. `lang`, `og:locale`, `og:locale:alternate`, `hreflang` + `x-default` on every page pair.
4. Sitemap lists both; canonical is self-referencing per language, never cross-language.
5. Nav, form labels, error and empty states, 404 copy and the privacy page are all in the dictionary.
6. Title and description written per language, not translated: the query intent differs.
7. `tel:` / `mailto:` / `wa.me` unchanged; the phone is the same in both languages.
8. Screenshot both languages at 1440 and 390 — a longer English label breaks a Greek-length nav.

---

# 2. GDPR floor

## 2.1 The claim, and what keeps it true

The honest default for these builds: the site stores nothing, so there is no consent banner. That claim
is only true while all of the following hold, and it is checked by `scripts/check-third-party.mjs` in the
build, not remembered:

- **Self-hosted fonts**, no Google Fonts CDN.
- **Leaflet + OSM instead of a Google Maps iframe.**
- **No YouTube/Vimeo/Instagram embed** unless behind a click-to-load facade that fetches only on click.
  The facade is the one pattern that keeps a video on the page without a banner.
- **Cookieless analytics only**, if the owner wants numbers: Cloudflare Web Analytics or a self-hosted
  Plausible. No Google Analytics, no tag manager, no ad pixels, no session recording, no heatmaps.

## 2.2 The privacy page is written from the build

Grep the built HTML for third-party origins, list what actually runs (host logs, mail client, the
analytics provider), and delete every claim the build cannot support. A "we use no cookies" sentence is a
promise to grep for, not a phrase to paste. Section list for an art. 13 notice: `BROCHURE-SITE-RULES.md`
§12.

## 2.3 Forms, WhatsApp and people in photographs

- Consent sentence naming purpose and retention, `/privacy/` link, no marketing checkbox unless the client
  really sends marketing, and the real channel named (phone, WhatsApp, email).
- Say plainly when an address is a dummy mailbox that bounces.
- **WhatsApp is Meta.** A booking form that hands a name, phone and dates to `wa.me` transfers them to a
  third party: the privacy page says so, and the form offers email as the alternative.
- Photographs of identifiable staff or guests need the client's confirmation that they consented. Note it
  in `POST-SETUP.md` rather than assuming.
- Greek operator details in the notice: controller identity, the six rights, and the right to complain to
  the Hellenic DPA (ΑΠΔΠΧ, Κηφισίας 1–3, 115 23 Αθήνα, dpa.gr).

## 2.4 Never invent

VAT numbers, a DPO, certifications, retention periods, or a legal basis for a purpose the site does not
have. Omit the line and mark it owner-confirm in `POST-SETUP.md`. Not legal advice: the text is accurate to
*this* build, and adding analytics, a newsletter backend or an embedded widget changes it.
