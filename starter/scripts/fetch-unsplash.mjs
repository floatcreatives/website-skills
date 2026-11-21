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
