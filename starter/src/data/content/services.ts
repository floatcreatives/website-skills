export interface ServiceCategory {
  name: string;
  description: string;
  detail: string;
  position: number;
  image: string;
  icon: string;
}

export interface ServicesPageContent {
  description: string;
  hero: {
    badge: string;
    headingParts: string[];
    highlightedHeadingPart: string;
    subtitle: string;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export const services: ServiceCategory[] = [
  {
    position: 1,
    name: "Category One",
    description: "Describe your first service or product category. What do you offer?",
    detail: "Add more detail about this service category. What's included? Why is it valuable? How does the customer benefit? Be specific and use customer-focused language.",
    image: "/images/placeholder.svg",
    icon: "star",
  },
  {
    position: 2,
    name: "Category Two",
    description: "Describe your second service or product category.",
    detail: "Add more detail about this service category. What's included? Why is it valuable? How does the customer benefit? Be specific and use customer-focused language.",
    image: "/images/placeholder.svg",
    icon: "check",
  },
  {
    position: 3,
    name: "Category Three",
    description: "Describe your third service or product category.",
    detail: "Add more detail about this service category. What's included? Why is it valuable? How does the customer benefit? Be specific and use customer-focused language.",
    image: "/images/placeholder.svg",
    icon: "shield",
  },
];

export const servicesPageContent: ServicesPageContent = {
  description: "Describe your services page for SEO. What do you offer? What categories?",
  hero: {
    badge: "Services",
    headingParts: ["What We", "Offer"],
    highlightedHeadingPart: "Offer",
    subtitle: "A short description of your main services page. Explain what customers will find here.",
  },
  cta: {
    badge: "Get Started",
    title: "Ready to Learn More About Our Services?",
    description: "Contact us for details, pricing, and availability.",
  },
};
