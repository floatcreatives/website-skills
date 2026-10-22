// Replace with your service/location areas.
// These appear in the delivery/service areas carousel.

export interface DeliveryArea {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export const deliveryAreas: DeliveryArea[] = [
  {
    title: "Service Area One",
    description: "Describe your first service area. What neighborhoods, cities, or regions do you cover?",
    image: "/images/placeholder.svg",
    tags: ["Tag1", "Tag2", "Tag3"],
  },
  {
    title: "Service Area Two",
    description: "Describe your second service area.",
    image: "/images/placeholder.svg",
    tags: ["Tag1", "Tag2"],
  },
  {
    title: "Service Area Three",
    description: "Describe your third service area.",
    image: "/images/placeholder.svg",
    tags: ["Tag1", "Tag2"],
  },
];
