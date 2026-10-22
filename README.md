# Float Creatives — Website Skills

One repo for making client websites. Rules, starter code, and the per-project
template all live here so every person and every AI agent works from the same
source.

**This repo replaces:** `CubeSeven/float-skills` (rules), `CubeSeven/astro-business-template`
(starter code). Both are superseded by this one.

---

## What's in here

| Path | What it is | Who reads it |
|---|---|---|
| `BROCHURE-SITE-RULES.md` | **The contract.** Every rule, pattern and gate for building a brochure site. Source of truth. | Agents read it first, always |
| `CLIENT-BRIEF.md` | Fill-in brief. Copy into a new project, fill it, hand to the agent. | You, before building |
| `starter/` | Working Astro 7 + Tailwind v4 starter. 7 pages, 15 components, SEO/schema, sitemap. Build-verified. | Copy to start a project |
| `repo-template/` | Files every new project repo carries: `AGENTS.md`, `.gitignore`, `.env.example`, `SETUP-CHECKLIST.md` | Copy into the project |
| `agents/` | `AGENTS.md` / `CLAUDE.md` / `.cursorrules` — make any AI agent load the rules automatically | Copy into the project |
| `docs/` | Known gaps, proposed updates, change history | Read when something looks off |

---

## Start a new website

**With an AI agent** — paste one line:

> Use `https://github.com/floatcreatives/website-skills` as the rules library.
> Read `BROCHURE-SITE-RULES.md` and **start**.

The agent reads the rules, asks for the business info (it skips anything you
give it links for), proposes the page structure, then builds.

**Manually:**

```bash
cp -r starter/ my-new-site && cd my-new-site
cp ../repo-template/AGENTS.md ../repo-template/.gitignore .
npm install && npm run dev
```

Then edit `src/data/site.config.ts` (all business facts), `src/data/content/*.ts`
(page content), `src/styles/theme.css` (brand colours + fonts).

---

## Rules for every client site

1. **Never push directly to `main`.** Branch → PR → Panos merges. See
   `floatcreatives/float-devops` for deploy targets and the full workflow.
2. **Business facts live in `src/data/site.config.ts`** — never hardcoded in components.
3. **Page content lives in `src/data/content/*.ts`** — typed, `as const`.
4. **Verify versions before every project** — `npm view <pkg> version`. Never copy
   version ranges from an older project.

---

## Stack (verified 2026-10-22)

| Layer | Package | Version |
|---|---|---|
| Framework | `astro` | 7.4.2 |
| CSS | `tailwindcss` + `@tailwindcss/vite` | 4.3.3 |
| Icons | `astro-icon` + `@iconify-json/lucide` | 1.2.0 / 1.2.147 |
| Sitemap | `@astrojs/sitemap` | 3.7.4 |
| TypeScript | `typescript` | 6.x (stay on 6 — not 7 yet) |
| Node | engine pinned | `>=22.12.0` |

Re-check with `npm view <pkg> version` before each new project — this table is a
snapshot, not a source of truth.
