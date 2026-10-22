export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQPageContent {
  description: string;
  hero: {
    badge: string;
    headingParts: string[];
    highlightedHeadingPart: string;
    subtitle: string;
  };
  stillHaveQuestions: string;
}

export const faqs: FAQItem[] = [
  {
    q: "What are your business hours?",
    a: "Add your first FAQ answer here. Describe your hours, availability, and how customers can reach you.",
  },
  {
    q: "How can I contact you?",
    a: "Add your second FAQ answer here. List your phone, email, and other contact methods.",
  },
  {
    q: "Where are you located?",
    a: "Add your third FAQ answer here. Describe your location and service area.",
  },
];

export const faqPageContent: FAQPageContent = {
  description: "Frequently asked questions about our services, hours, and policies.",
  hero: {
    badge: "Help Center",
    headingParts: ["Frequently Asked", "Questions"],
    highlightedHeadingPart: "Questions",
    subtitle: "Find answers to common questions. Can't find what you're looking for? Contact us directly.",
  },
  stillHaveQuestions: "Still have questions? We're available during business hours.",
};

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
