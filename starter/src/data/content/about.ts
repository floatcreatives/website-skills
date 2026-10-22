export interface AboutContent {
  hero: {
    badge: string;
    headingParts: string[];
    highlightedHeadingPart: string;
    tagline: string;
  };
  story: {
    badge: string;
    heading: string;
    paragraphs: string[];
    image: string;
    alt: string;
    ctaText: string;
    ctaLink: string;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export const aboutContent: AboutContent = {
  hero: {
    badge: "About Us",
    headingParts: ["Our", "Story"],
    highlightedHeadingPart: "Story",
    tagline:
      "A short tagline about what makes your business unique. What's your mission?",
  },
  story: {
    badge: "Who We Are",
    heading: "Your Trusted Partner",
    paragraphs: [
      "Write your company story. When did you start? What motivated you? What values guide your business? Share what customers appreciate about working with you.",
      "Add more depth — your expertise, your team, your commitment to quality.",
    ],
    image: "/images/placeholder.svg",
    alt: "About us image",
    ctaText: "Get in Touch",
    ctaLink: "/contact",
  },
  cta: {
    badge: "Contact Us",
    title: "Want to Know More About Us?",
    description: "Call or message us. We're happy to answer any questions.",
  },
};
