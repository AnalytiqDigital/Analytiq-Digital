export interface Testimonial {
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
  photoUrl?: string;
}

// Intentionally empty — manually-verified client testimonials should be
// added via the admin dashboard (/admin/testimonials) once collected and
// approved. Nothing here is fabricated or placeholder text presented as
// real feedback.
export const testimonials: Testimonial[] = [];
