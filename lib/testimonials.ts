export type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number; // 1-5
  gender?: "male" | "female";
  source?: string;
};

export const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "ZuLvya R.",
    role: "Ulasan Google Maps",
    content:
      "Konseling di sini nyaman banget. Psikolognya ramah dan komunikatif. Untuk biayanya juga masih tergolong aman, tidak menguras dompet.",
    rating: 5,
    gender: "female",
    source: "Google Maps",
  },
  {
    id: 2,
    name: "Gilang M. F.",
    role: "Ulasan Google Maps",
    content:
      "Tempatnya enak, santai, nyaman, dan bersih. Pendampingannya pun enak dan asik.",
    rating: 5,
    gender: "male",
    source: "Google Maps",
  },
  {
    id: 3,
    name: "Aditya P.",
    role: "Ulasan Google Maps",
    content:
      "Tempatnya nyaman, sangat berkualitas untuk konsultasi terkait diri sendiri, dan ditangani oleh ahlinya.",
    rating: 5,
    gender: "male",
    source: "Google Maps",
  },
  {
    id: 4,
    name: "Nur Avia A. J.",
    role: "Ulasan Google Maps",
    content:
      "Nyaman dan helpful sekali. Bintang 5 untuk pelayanannya. Psikolognya juga sangat membantu.",
    rating: 5,
    gender: "female",
    source: "Google Maps",
  },
  {
    id: 5,
    name: "Familla A.",
    role: "Ulasan Google Maps",
    content:
      "Terima kasih Oase Jiwa, tempat konsultasi dan konseling kesehatan jiwa yang nyaman.",
    rating: 5,
    gender: "female",
    source: "Google Maps",
  },
  {
    id: 6,
    name: "Yesha A.",
    role: "Ulasan Google Maps",
    content: "Ramah banget, informatif, dan membantu.",
    rating: 5,
    gender: "female",
    source: "Google Maps",
  },
];