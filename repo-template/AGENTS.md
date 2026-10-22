# AGENTS.md

**Any AI agent or developer working in this repo: read this first.**

This repo is part of the Float Creatives site collection. The company-wide method,
site inventory, deployment targets and safety rules live in one place:

> **`floatcreatives/float-devops`** → `README.md` (method) + `DEVELOPER-GUIDE.md` (walkthrough)

Read those before making changes. This file only covers rules local to this repo.

---

## Non-negotiables

1. **Never deploy without explicit owner instruction.** Read-only inspection (`ls`, `echo`, `cat`) is fine. `rsync`, `scp`, or any remote write is not, unless the owner asked for that exact deploy in the current conversation.
2. **Never push to `main`.** Work on a branch, open a PR, let the owner merge.
3. **Never commit `.env`** — it holds the server credentials.
4. **Never commit build output:** `dist/`, `.astro/`, `node_modules/`, `*.zip`, `*-deploy/`, `*-build/`.
5. **Never hardcode business content** into components — phone, address, hours and copy belong in `src/data/`.

---

## This project

| | |
|---|---|
| **Stack** | Astro + Tailwind CSS v4, static output, TypeScript |
| **Live site** | _fill in the domain_ |
| **Deploy target** | _fill in host + cPanel user, or "not deployed"_ |

---

## Where content lives

```
src/data/site.config.ts      identity, contact, hours, SEO, schema generators
src/data/content/*.ts        page copy, FAQs, services, testimonials, gallery
src/components/*.astro       presentational, data-driven
src/pages/*.astro            routes only
```

A phone number must appear in exactly one place: `site.config.ts`.

---

## Before pushing

```bash
npm run build     # must pass — this is what CI runs
```

Branch names: `feat/`, `fix/`, `docs/`, `chore/` + short kebab-case description.
Never use agent-branded prefixes (`claude/`, `codex/`, `agent:`).

---

## The two traps

**Photo trap.** A bare `images/` line in `.gitignore` matches `public/images/` too, silently excluding every real site photo. If you ever edit `.gitignore`, verify:

```bash
rm -rf /tmp/gate && mkdir -p /tmp/gate && cd /tmp/gate && git init -q .
cp "<this repo>/.gitignore" . && mkdir -p public/images && touch public/images/T.jpg
git check-ignore -q public/images/T.jpg && echo "BAD — photos excluded" || echo "OK"
```

**Deploy trap.** `rsync --delete` makes the remote folder exactly mirror `dist/` — anything hand-uploaded there gets **deleted**. List the remote folder before any first deploy.

---

## Verifying remote state

Never trust a green push. Read it back:

```bash
gh api repos/floatcreatives/<repo>/contents/.env           # 404 = no secrets leaked
gh api repos/floatcreatives/<repo>/contents/public/images # 200 = photos present
```

Confirm the active GitHub account before writing anything — two accounts exist on
some machines (`CubeSeven` personal, `floatcreatives` company). A client site must
never land on the personal account.
