// ===================================================================
//  SITE CONFIGURATION — Edit this file to customize your website.
//  This is the single source of truth for all site data.
// ===================================================================

export const SITE = {
  // ── Site Identity ──────────────────────────────────────────────
  name: "Your Business Name",
  shortName: "Business",
  tagline: "Your Tagline Here",
  description:
    "A brief description of your business for SEO and social previews.",
  url: "https://yourdomain.com",
  language: "en",
  locale: "en_US",

  // ── Google Search Console ──────────────────────────────────────
  // Get this from: Google Search Console → Settings → Verification
  googleVerification: "YOUR_VERIFICATION_CODE",

  // ── Business ───────────────────────────────────────────────────
  business: {
    legalName: "Your Business Legal Name",
    alternateName: "Optional alternate name in another language",
    yearEstablished: 2020,
    priceRange: "€€",
    languages: ["English"] as const,

    address: {
      street: "123 Main Street",
      locality: "Your City",
      region: "Your Region",
      postalCode: "12345",
      country: "GR",
      countryName: "Greece",
    },

    geo: {
      latitude: "37.9838",
      longitude: "23.7275",
    },

    contact: {
      phone: { display: "210 000 0000", raw: "+302100000000" },
      email: "info@yourdomain.com",
      whatsappUrl: "https://wa.me/302100000000",
    },

    hours: {
      display: "Mon-Fri 9:00-18:00",
      shortDisplay: "Mon-Fri 9-6",
      schema: "Mo,Tu,We,Th,Fr 09:00-18:00",
    },

    social: {
      facebook: "https://www.facebook.com/yourbusiness",
      instagram: "https://www.instagram.com/yourbusiness/",
      twitter: "@yourbusiness",
    },

    serviceAreas: ["City A", "City B", "City C"] as const,
  },

  // ── SEO Defaults ───────────────────────────────────────────────
  seo: {
    titleSuffix: " | Your Business",
    defaultDescription:
      "A brief description of your business for SEO and social previews.",
    defaultOGImage: "https://yourdomain.com/images/placeholder.svg",
    ogImageAlt: "Your business description for social sharing",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterHandle: "@yourbusiness",
    themeColor: "#333333",
    author: "Your Business",
  },

  // ── Navigation ─────────────────────────────────────────────────
  nav: {
    main: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ] as const,
    footer: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ] as const,
  },

  // ── Hero Image ─────────────────────────────────────────────────
  heroImage: "/images/placeholder.svg",

  // ── Logo ───────────────────────────────────────────────────────
  logoPath: "/logo.svg",

  // ── Rating ─────────────────────────────────────────────────────
  rating: {
    value: "5.0",
    best: "5",
    count: 0,
  },

  // ── Reviews ────────────────────────────────────────────────────
  // Fill with your real customer reviews.
  reviews: [],

  // ── Map Embeds ─────────────────────────────────────────────────
  maps: {
    openStreetMap:
      "https://www.openstreetmap.org/export/embed.html?bbox=23.6%2C37.8%2C23.9%2C38.1&layer=mapnik",
    googleMaps:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3144.941197503706!2d23.72503437686618!3d37.97863137195051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a1bd06239ecb9d%3A0x400bd2ce4738850!2sAthens!5e0!3m2!1sen!2sgr",
  },

  // ── PWA Manifest ───────────────────────────────────────────────
  manifest: {
    backgroundColor: "#ffffff",
    display: "standalone" as const,
  },
} as const;

// ── Helper: generate LocalBusiness JSON-LD schema ────────────────
export function generateBusinessSchema() {
  const { business, url, rating, reviews } = SITE;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.legalName,
    alternateName: business.alternateName,
    image: SITE.heroImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.latitude,
      longitude: business.geo.longitude,
    },
    url,
    telephone: business.contact.phone.raw,
    email: business.contact.email,
    priceRange: business.priceRange,
    openingHours: business.hours.schema,
    description: SITE.description,
    areaServed: {
      "@type": "City",
      name: business.address.locality,
    },
    sameAs: [business.social.facebook, business.social.instagram],
  };
  if (reviews.length > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.value,
      bestRating: rating.best,
      ratingCount: rating.count || reviews.length,
      reviewCount: reviews.length,
    };
    schema.review = reviews.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewBody: r.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: rating.best,
      },
    }));
  }
  return schema;
}

// ── Helper: generate WebSite JSON-LD schema ──────────────────────
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/faq/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Helper: generate ContactPoint JSON-LD schema ─────────────────
export function generateContactSchema() {
  const { business } = SITE;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.legalName,
    telephone: business.contact.phone.raw,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: business.contact.phone.raw,
      contactType: "customer service",
      contactOption: ["TollFree", "WhatsApp"],
      areaServed: ["GR", ...business.serviceAreas],
      availableLanguage: business.languages,
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    },
  };
}

// ── Helper: generate BreadcrumbList JSON-LD ──────────────────────
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}

// ── Helper: build canonical URL ──────────────────────────────────
export function canonicalUrl(path: string): string {
  const normalized = path.endsWith("/") ? path : `${path}/`;
  return normalized === "/" ? `${SITE.url}/` : `${SITE.url}${normalized}`;
}
