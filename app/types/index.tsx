export interface Service {
  id: number;
  name: string;
  duration?: string;
  description: string;
  price: string | { basic?: string; advice?: string; mmpi?: string };
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface BundlePackage {
  id: number;
  name: string;
  sessions: string;
  price: string;
  discount: string;
}
