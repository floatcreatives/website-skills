export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryPageContent {
  badge: string;
  heading: string;
  description: string;
  cta: {
    badge: string;
    title: string;
    description: string;
  };
}

export const galleryImages: GalleryImage[] = [
  {
    src: "/images/placeholder.svg",
    alt: "Replace with your gallery image 1 — describe the image for SEO and accessibility",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Replace with your gallery image 2",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Replace with your gallery image 3",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Replace with your gallery image 4",
  },
  {
    src: "/images/placeholder.svg",
    alt: "Replace with your gallery image 5",
  },
];

export const galleryPageContent: GalleryPageContent = {
  badge: "Gallery",
  heading: "Our Work",
  description: "A look inside {name}. Our work, our team, and the quality we deliver. Click any photo to view full size.",
  cta: {
    badge: "Get in Touch",
    title: "Like What You See?",
    description: "Contact us to discuss how we can help you.",
  },
};
