export interface TrustBarItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface HeroStat {
  label: string;
  value: string;
}

export interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    stats: HeroStat[];
  };
  trustBar: {
    items: TrustBarItem[];
  };
  servicesIntro: {
    badge: string;
    heading: string;
    description: string;
    cards: ServiceCard[];
  };
  aboutIntro: {
    badge: string;
    heading: string;
    paragraphs: string[];
    image: string;
    alt: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  features: {
    badge: string;
    heading: string;
    items: FeatureItem[];
  };
  whyChooseUs: {
    badge: string;
    heading: string;
    items: WhyChooseUsItem[];
  };
  serviceAreas: {
    badge: string;
    heading: string;
    description: string;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export const homeContent: HomeContent = {
  hero: {
    title: "Your Headline",
    subtitle:
      "A compelling subtitle that describes what your business does. Keep it clear and benefit-focused.",
    stats: [
      { label: "Years of Experience", value: "20+ Years" },
      { label: "Availability", value: "24/7 Always Open" },
      { label: "Quality", value: "100% Local & Fresh" },
    ],
  },
  trustBar: {
    items: [
      {
        icon: "users",
        title: "Trusted by Our Customers",
        description: "Rated on Google reviews",
      },
      {
        icon: "medal",
        title: "Licensed & Certified",
        description: "Fully licensed and authorized",
      },
      {
        icon: "map-pin",
        title: "Our Location",
        description: null,
      },
    ],
  },
  servicesIntro: {
    badge: "Our Services",
    heading: "What We Offer",
    description:
      "A brief overview of your core services. Replace with your own copy describing what you do best.",
    cards: [
      {
        icon: "star",
        title: "Service One",
        description:
          "Describe your first key service. What does the customer get? Why should they choose you?",
      },
      {
        icon: "check",
        title: "Service Two",
        description:
          "Describe your second key service — your most popular or flagship offering. Make it stand out.",
        highlighted: true,
      },
      {
        icon: "shield",
        title: "Service Three",
        description:
          "Describe your third key service. Highlight what makes it different or special.",
      },
    ],
  },
  aboutIntro: {
    badge: "About Us",
    heading: "Your Story, Your Promise",
    paragraphs: [
      "Tell your story here. What makes your business special? How did you start? What do you believe in?",
      "Share a second paragraph that builds trust. Mention your experience, your values, or what customers love about working with you.",
    ],
    image: "/images/placeholder.svg",
    alt: "About us image",
    ctaText: "Our Services",
    ctaLink: "/services",
    secondaryCtaText: "Learn More",
    secondaryCtaLink: "/about",
  },
  features: {
    badge: "What We Offer",
    heading: "Key Benefits of Choosing Us",
    items: [
      {
        icon: "star",
        title: "Benefit One",
        description:
          "Describe the first key benefit your customers get. Be specific.",
      },
      {
        icon: "check",
        title: "Benefit Two",
        description:
          "Describe the second key benefit. What problem do you solve?",
      },
      {
        icon: "shield",
        title: "Benefit Three",
        description:
          "Describe your third key benefit. Why are you the better choice?",
      },
      {
        icon: "users",
        title: "Benefit Four",
        description:
          "Describe the fourth key benefit. Reinforce trust and reliability.",
      },
    ],
  },
  whyChooseUs: {
    badge: "Why Choose Us",
    heading: "What Makes Us Different",
    items: [
      {
        icon: "star",
        title: "Quality First",
        description:
          "Describe what quality means for your business and how customers benefit.",
      },
      {
        icon: "certificate",
        title: "Licensed & Insured",
        description:
          "Highlight your credentials, certifications, and professional affiliations.",
      },
      {
        icon: "truck",
        title: "Fast Service",
        description:
          "Describe your delivery speed, response time, or turnaround.",
      },
      {
        icon: "heart",
        title: "Customer Focus",
        description:
          "Share how you put customers first and what makes your service personal.",
      },
    ],
  },
  serviceAreas: {
    badge: "Service Areas",
    heading: "Where We Serve",
    description: "Available across our service area.",
  },
  cta: {
    badge: "Get in Touch",
    title: "Ready to Work With Us?",
    description: "Call or WhatsApp us anytime. We're here to help.",
  },
};
