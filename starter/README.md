# Astro Business Website Template

A production-ready Astro website skeleton for local businesses. Built with Astro, Tailwind CSS v4, and TypeScript. Optimized for SEO, accessibility, and performance.

## Quick Start — Using This Template for a New Project

```bash
# 1. Copy the template
cp -r "path/to/this/template" my-new-project
cd my-new-project

# 2. Install dependencies
npm install
```

## Customizing for Your Business

### Step 1: Business Info & SEO — `src/data/site.config.ts`

Edit the single source of truth for ALL site data:

```ts
{
  name: "Your Business Name",
  url: "https://yourdomain.com",
  business: {
    legalName: "Your Business — Owner Name",
    address: { street, locality, region, postalCode, country },
    contact: { phone, email, whatsappUrl },
    social: { facebook, instagram, twitter },
    hours: { display, schema },
    // ...
  },
  nav: { main: [...], footer: [...] },
  seo: { themeColor, author, twitterHandle, ... },
  rating: { value, count },
  reviews: [...],
}
```

### Step 2: Page Content — `src/data/content/*.ts`

| File | Content |
|---|---|
| `testimonials.ts` | Customer reviews and ratings |
| `faq.ts` | FAQ questions and answers |
| `delivery-areas.ts` | Service/delivery area descriptions |
| `gallery.ts` | Gallery images and alt text |
| `services.ts` | Product/service categories |

### Step 3: Brand Colors & Fonts — `src/styles/theme.css`

- Replace `--color-brand-50` through `--color-brand-950` with your palette
- Swap font files in `/public/fonts/` and update `@font-face` declarations
- Change `--font-family-sans` if using a different font

### Step 4: Replace Static Assets

| File | What to replace |
|---|---|
| `public/logo.svg` | Your logo SVG |
| `public/favicon-*.png` | Your favicons |
| `public/apple-touch-icon.png` | Apple touch icon |
| `public/manifest.json` | Update `name`, `short_name`, `description` |
| `public/sitemap.xml` | Replace all domain URLs and image captions |
| `public/robots.txt` | Update sitemap URL if domain changes |
| `Images/` directory | Replace with your own images |

### Step 5: Run & Deploy

```bash
npm run dev           # Start dev server on localhost:4321
npm run build         # Build production site to ./dist/
npm run preview       # Preview the production build
```

## Project Structure

```
src/
├── data/
│   ├── site.config.ts          ★ Single source of truth for all business data
│   └── content/                ★ Page content separated by type
│       ├── testimonials.ts
│       ├── faq.ts
│       ├── delivery-areas.ts
│       ├── gallery.ts
│       └── services.ts
├── components/                  Reusable Astro components
│   ├── Layout.astro            HTML shell, SEO metadata, structured data
│   ├── Header.astro            Sticky navigation (reads from config)
│   ├── Footer.astro            Multi-column footer (reads from config)
│   ├── Hero.astro              Full-screen hero section
│   ├── CTA.astro               Call-to-action component
│   ├── Features.astro          Feature cards grid
│   ├── TestimonialsSlider.astro
│   ├── DeliveryAreasSlider.astro
│   ├── FAQ.astro (inline)
│   ├── Lightbox.astro
│   ├── Breadcrumbs.astro
│   └── ...
├── pages/                       Route files (one .astro per URL)
│   ├── index.astro
│   ├── about.astro
│   ├── services.astro
│   ├── contact.astro
│   ├── faq.astro
│   ├── gallery.astro
│   └── 404.astro
├── styles/
│   ├── theme.css               ★ Brand colors, fonts, border-radius
│   └── global.css               Structural CSS (animations, components, layout)
└── utils/
    └── images.ts                Responsive image helpers (srcset/sizes)
```

## Key Features

- **Single-source configuration** — Change business info, SEO, and content in 3 files
- **JSON-LD structured data** — `LocalBusiness`, `WebSite`, `FAQPage`, `ContactPoint`, `ItemList`, `BreadcrumbList` schemas auto-generated from config
- **Self-hosted fonts** — No Google Fonts request chain; Inter with Latin + Greek subsets
- **Responsive images** — `srcset`/`sizes` with WebP for all display contexts
- **Scroll animations** — IntersectionObserver-based with staggered delays
- **Production-ready SEO** — Open Graph, Twitter Cards, canonical, hreflang, robots, Google verification
- **PWA-ready** — Manifest, favicons, apple-touch-icon
- **Accessible** — Skip-to-content link, ARIA labels, semantic HTML
- **Performance** — Static site generation, font preloads, hero image preload, lazy loading

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Astro (static generation) |
| CSS | Tailwind CSS v4 |
| Icons | astro-icon + Lucide |
| Images | srcset/sizes WebP |
| TypeScript | Strict mode |

## License

MIT — Use freely for your own projects.
