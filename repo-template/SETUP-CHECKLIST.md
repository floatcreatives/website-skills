# New project — setup checklist

Run through this top to bottom for every new Float site. Doing it in order prevents
the two mistakes that have already cost us time: secrets in git history, and photos
silently excluded from the repo.

---

## 1. Create the repo

```bash
gh repo create floatcreatives/<project-name> --private --disable-wiki
gh repo edit floatcreatives/<project-name> \
  --enable-squash-merge --enable-merge-commit=false --enable-rebase-merge=false \
  --delete-branch-on-merge
```

Private, always. Client work never goes public.

## 2. Copy the template files — BEFORE the first commit

```bash
cp float-devops/repo-template/.gitignore    <project>/
cp float-devops/repo-template/.env.example  <project>/
cp float-devops/repo-template/AGENTS.md     <project>/
cp float-devops/repo-template/README.md     <project>/
```

`.gitignore` must exist **before** anything is committed. Adding it later leaves
secrets and build output in history, where they are much harder to remove.

## 3. Confirm the photo gate passes

```bash
cd <project> && rm -rf /tmp/gate && mkdir -p /tmp/gate && cd /tmp/gate && git init -q .
cp "<project>/.gitignore" . && mkdir -p public/images && touch public/images/T.jpg
git check-ignore -q public/images/T.jpg && echo "BAD — fix .gitignore" || echo "OK"
```

## 4. Scaffold and build

```bash
npm create astro@latest          # or copy an existing site as the base
npm install
npm run build                    # must pass before the first push
```

## 5. Fill in the project details

- `src/data/site.config.ts` — name, phone, address, hours, geo, SEO, schema
- `src/data/content/*.ts` — page copy, FAQs, services, gallery
- `public/images/` — real photos
- `AGENTS.md` — set the live domain and deploy target in the table at the top

## 6. Set up deploy access

Only if the site is going live:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/<project>_hostinger -C "float-deploy-<project>"
cat ~/.ssh/<project>_hostinger.pub
```

Paste the public key into Hostinger → **Advanced → SSH Access** under the correct
cPanel account, then verify:

```bash
ssh -i ~/.ssh/<project>_hostinger <user>@<host> "echo OK"
```

One key per site — a leaked key then affects one site only.

## 7. First push

```bash
git init -b main
git add -A
# confirm nothing sensitive is staged
git diff --cached --name-only | grep -iE '(^|/)\.env$|\.pem$|id_rsa' && echo "ABORT"
git commit -m "Initial commit: <project> brochure site"
git remote add origin https://github.com/floatcreatives/<project>.git
git push -u origin main
```

## 8. Verify on GitHub — do not trust the push

```bash
gh api repos/floatcreatives/<project>/contents/.env            # expect 404
gh api repos/floatcreatives/<project>/contents/public/images   # expect 200
gh api repos/floatcreatives/<project>/git/trees/main?recursive=1 \
  --jq '[.tree[]|select(.path|startswith("dist/"))]|length'    # expect 0
```

## 9. Register the site

Add a row to the inventory table in `float-devops/README.md` §3, and to the table in
`DEVELOPER-GUIDE.md`. Undocumented sites get forgotten.

---

## Never

- Commit `.env`, `dist/`, `node_modules/`, `*.zip`
- Push to `main` directly
- Deploy without explicit instruction
- Add a bare `images/` line to `.gitignore`
- Assume a green push means the content landed — read it back
