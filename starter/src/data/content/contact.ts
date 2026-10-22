export interface ContactMethod {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  hint?: string;
}

export interface ContactContent {
  badge: string;
  heading: string;
  description: string;
  methods: {
    phone: ContactMethod;
    whatsapp: ContactMethod;
    email: ContactMethod;
    address: ContactMethod;
    hours: ContactMethod;
  };
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export const contactContent: ContactContent = {
  badge: "Contact Us",
  heading: "Get in Touch",
  description: "We're available during business hours. Call, WhatsApp, or email us.",
  methods: {
    phone: {
      icon: "phone",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Phone",
      hint: "Available during business hours",
    },
    whatsapp: {
      icon: "whatsapp",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      label: "WhatsApp",
      hint: "We respond fast on WhatsApp",
    },
    email: {
      icon: "mail",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Email",
    },
    address: {
      icon: "map-pin",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Address",
    },
    hours: {
      icon: "clock",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      label: "Hours",
    },
  },
  cta: {
    badge: "Call Us Today",
    title: "We're Here to Help",
    description: "Available during business hours. We're just a call or message away.",
  },
};
