# Project name

Short description of the site and who it is for.

**Live site:** _domain or "not deployed"_

---

## Stack

Astro + Tailwind CSS v4, static output, TypeScript.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
```

## Editing content

All business content lives in `src/data/` — do not hardcode it into components.

```
src/data/site.config.ts      name, phone, address, hours, SEO, schema
src/data/content/*.ts        page copy, FAQs, services, testimonials, gallery
```

## Contributing

Work on a branch and open a Pull Request — never push to `main` directly.

```bash
git switch -c fix/short-description
# edit
npm run build
git add -A && git commit -m "fix: what changed"
git push -u origin fix/short-description
```

Read `AGENTS.md` (agent rules) and the company method in `floatcreatives/float-devops`
before your first change.

## Deployment

Built `dist/` is synced to the Hostinger `public_html` over SSH. Credentials live in
`.env` (gitignored — copy `.env.example`). Deployment is performed by the owner only.
