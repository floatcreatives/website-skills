# Astro Brochure Website — Setup Checklist

When starting a new project from this template, ask the user for the following information **before editing any files**. Go through these sections in order.

## 1. Business Identity

| # | Question | File to edit |
|---|----------|-------------|
| 1 | What is the **business name**? | `src/data/site.config.ts` → `SITE.name` |
| 2 | What is a **short name** (for PWA, mobile)? | `src/data/site.config.ts` → `SITE.shortName` |
| 3 | What is the **tagline**? | `src/data/site.config.ts` → `SITE.tagline` |
| 4 | Write a 1-2 sentence **description** (SEO meta). | `src/data/site.config.ts` → `SITE.description` |
| 5 | What is the **domain URL**? | `src/data/site.config.ts` → `SITE.url` |
| 6 | What is the **legal business name**? | `src/data/site.config.ts` → `SITE.business.legalName` |

## 2. Contact & Location

| # | Question | File to edit |
|---|----------|-------------|
| 7 | What is the **street address**? | `site.config.ts` → `SITE.business.address.street` |
| 8 | What is the **city/locality**? | `site.config.ts` → `SITE.business.address.locality` |
| 9 | What is the **region/state**? | `site.config.ts` → `SITE.business.address.region` |
| 10 | What is the **postal code**? | `site.config.ts` → `SITE.business.address.postalCode` |
| 11 | What **country**? (code + name) | `site.config.ts` → `SITE.business.address.country` / `.countryName` |
| 12 | What is the **phone number** (display + raw)? | `site.config.ts` → `SITE.business.contact.phone` |
| 13 | What is the **email**? | `site.config.ts` → `SITE.business.contact.email` |
| 14 | What is the **WhatsApp link**? | `site.config.ts` → `SITE.business.contact.whatsappUrl` |
| 15 | What are the **business hours**? | `site.config.ts` → `SITE.business.hours` |
| 16 | What **year was the business established**? | `site.config.ts` → `SITE.business.yearEstablished` |
| 17 | What **cities/areas** do you serve? | `site.config.ts` → `SITE.business.serviceAreas` |

## 3. Social & Branding

| # | Question | File to edit |
|---|----------|-------------|
| 18 | What is the **Facebook URL**? | `site.config.ts` → `SITE.business.social.facebook` |
| 19 | What is the **Instagram URL**? | `site.config.ts` → `SITE.business.social.instagram` |
| 20 | What is the **Twitter handle**? | `site.config.ts` → `SITE.business.social.twitter` |
| 21 | What **brand colors**? (Tailwind palette or hex) | `src/styles/theme.css` → `--color-brand-*` |
| 22 | What **font** do you want to use? (default: Inter) | `src/styles/theme.css` + font files in `public/fonts/` |
| 23 | Provide a **logo SVG file**. | Replace `public/logo.svg` |

## 4. SEO

| # | Question | File to edit |
|---|----------|-------------|
| 24 | What is the **title suffix**? (e.g. " | Business Name") | `site.config.ts` → `SITE.seo.titleSuffix` |
| 25 | What is the **Google Search Console verification code**? | `site.config.ts` → `SITE.googleVerification` |
| 26 | What is the **theme/browser color**? | `site.config.ts` → `SITE.seo.themeColor` |

## 5. Homepage Content

| # | Question | File to edit |
|---|----------|-------------|
| 27 | What is the **hero headline**? | `src/data/content/home.ts` → `hero.title` |
| 28 | What is the **hero subtitle**? | `src/data/content/home.ts` → `hero.subtitle` |
| 29 | What are the **hero stats**? (3 items with "label" and "value") | `src/data/content/home.ts` → `hero.stats` |
| 30 | What are the **3 service cards** shown on the homepage? (icon, title, description each) | `src/data/content/home.ts` → `servicesIntro.cards` |
| 31 | What is the **about intro section** copy? (2 paragraphs) | `src/data/content/home.ts` → `aboutIntro.paragraphs` |
| 32 | What are the **4 key benefits/features**? (icon, title, description) | `src/data/content/home.ts` → `features.items` |
| 33 | What are the **4 "Why Choose Us"** items? (icon, title, description) | `src/data/content/home.ts` → `whyChooseUs.items` |

## 6. Other Page Content

| # | Question | File to edit |
|---|----------|-------------|
| 34 | What is the **about page hero tagline**? | `src/data/content/about.ts` → `hero.tagline` |
| 35 | What are the **about story paragraphs**? | `src/data/content/about.ts` → `story.paragraphs` |
| 36 | What **service categories** do you offer? (name, description, detail) | `src/data/content/services.ts` → `services[]` |
| 37 | What are your **FAQs**? (questions + answers) | `src/data/content/faq.ts` → `faqs[]` |
| 38 | What **gallery images** do you have? (paths + alt text) | `src/data/content/gallery.ts` → `galleryImages[]` |
| 39 | What are your **testimonials/reviews**? | `src/data/content/testimonials.ts` → `testimonials[]` |
| 40 | What are your **service/delivery areas**? (title, description, tags) | `src/data/content/delivery-areas.ts` → `deliveryAreas[]` |

## 7. Assets

| # | Question | File to edit |
|---|----------|-------------|
| 41 | Provide **hero image**. | Replace path in `site.config.ts` → `SITE.heroImage` + add file to `public/images/` |
| 42 | Provide **images for each page** (about, services, etc.). | Update image paths in respective content files + `public/images/` |
| 43 | Do you need to update the **map embeds**? | `site.config.ts` → `SITE.maps.openStreetMap` / `SITE.maps.googleMaps` |
| 44 | Do you need to update **PWA manifest**? | `public/manifest.json` + `site.config.ts` → `SITE.manifest` |

## 8. Geo Coordinates

| # | Question | File to edit |
|---|----------|-------------|
| 45 | What are the **latitude/longitude** for your business location? | `site.config.ts` → `SITE.business.geo` |

---

## Workflow

1. Ask all 45 questions above (grouped by section).
2. After collecting answers, edit every file listed in the "File to edit" column.
3. Run `npm run build` to verify the site compiles.
4. Start the dev server with `npm run dev` for the user to preview.
