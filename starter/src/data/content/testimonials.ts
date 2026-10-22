// Replace with your customer reviews.
// Each review needs: quote, name, role, avatar (image path), rating (1-5).

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Add your customer reviews here — they appear in the testimonial slider on the homepage.",
    name: "Customer Name",
    role: "Google Reviewer",
    avatar: "/images/placeholder.svg",
    rating: 5,
  },
];
