#!/usr/bin/env node
// Platform gate: the things a Lighthouse 100 still ships wrong.
// Usage: node scripts/check-platform.mjs   (after `npm run build`)
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const fails = [];
const notes = [];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('No dist/. Run `npm run build` first.');
  process.exit(1);
}

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
const files = walk(DIST);

// 1. Security headers must be shipped, whichever host file the project uses.
const headerFiles = ['public/_headers', '_headers', 'vercel.json', 'public/.htaccess', '.htaccess'];
const shipped = headerFiles.filter((f) => existsSync(f));
if (shipped.length === 0) fails.push('no host header file (_headers / vercel.json / .htaccess)');
else {
  const body = readFileSync(shipped[0], 'utf8');
  for (const h of ['Strict-Transport-Security', 'X-Content-Type-Options', 'Referrer-Policy', 'Content-Security-Policy'])
    if (!body.includes(h)) fails.push(`${shipped[0]} is missing ${h}`);
  notes.push(`headers file: ${shipped.join(', ')}`);
}

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const name = page.replace(`${DIST}/`, '');
  const is404 = name.includes('404');

  // 2. Indexable pages advertise a large image preview and a self-referencing canonical.
  const robots = html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? '';
  if (!is404 && !/max-image-preview:large/i.test(robots)) fails.push(`${name}: robots meta lacks max-image-preview:large`);
  if (!is404 && !/<link rel="canonical" href="/i.test(html)) fails.push(`${name}: no canonical`);
  if (is404 && /<link rel="canonical" href="/i.test(html)) fails.push(`${name}: 404 must not carry a canonical`);

  // 3. hreflang must never point at the page itself for another locale.
  const alternates = [...html.matchAll(/<link rel="alternate" href="([^"]+)" hreflang="([^"]+)"/g)];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical) {
    for (const [, href, lang] of alternates) {
      if (href === canonical && lang !== 'x-default') fails.push(`${name}: hreflang="${lang}" points at itself`);
    }
  }

  // 4. Colour scheme + both theme colours.
  if (!/<meta name="color-scheme"/i.test(html)) fails.push(`${name}: no color-scheme meta`);
  const themeColors = [...html.matchAll(/<meta name="theme-color"[^>]*>/g)].length;
  if (themeColors < 2) fails.push(`${name}: theme-color must be declared for light and dark`);

  // 5. The LCP image is prioritised and not lazy-loaded.
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  if (imgs.length) {
    // Home must prioritise a hero image; no image may combine lazy with high priority.
    const hero = imgs.find((i) => /fetchpriority="high"/.test(i));
    if (name === 'index.html' && !hero) fails.push(`${name}: no image carries fetchpriority="high" (LCP)`);
    if (hero && /loading="lazy"/.test(hero)) fails.push(`${name}: the prioritised image is also lazy-loaded`);
  }
  const badCombo = imgs.filter((i) => /fetchpriority="high"/.test(i) && /loading="lazy"/.test(i));
  if (badCombo.length) fails.push(`${name}: ${badCombo.length} image(s) combine lazy + fetchpriority=high`);

  // 6. Every image reserves its box.
  const unsized = imgs.filter((i) => !(/width=/.test(i) && /height=/.test(i)) && !/aspect-ratio/.test(i));
  if (unsized.length) fails.push(`${name}: ${unsized.length} <img> without width/height`);

  // 7. Accessibility basics that are cheap to assert statically.
  if (!/<html[^>]+lang="/i.test(html)) fails.push(`${name}: <html> has no lang`);
  if (!/id="main"/i.test(html) && !/id="main-content"/i.test(html)) fails.push(`${name}: no <main> target for the skip link`);
  if (/tabindex="[1-9]/.test(html)) fails.push(`${name}: positive tabindex`);
  const h1s = (html.match(/<h1\b/g) || []).length;
  if (h1s !== 1) fails.push(`${name}: ${h1s} <h1> elements`);
}

// 8. Oversized assets that should not have reached production.
for (const f of files.filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))) {
  const kb = statSync(f).size / 1024;
  if (kb > 400) fails.push(`${f.replace(`${DIST}/`, '')}: ${Math.round(kb)} KB — over the 400 KB image budget`);
}

console.log(`checked ${pages.length} pages, ${files.length} files`);
for (const n of notes) console.log(`note: ${n}`);
if (fails.length) {
  console.error(`\n${fails.length} platform issue(s):`);
  for (const f of fails) console.error(` - ${f}`);
  process.exit(2);
}
console.log('platform gate: clean');
