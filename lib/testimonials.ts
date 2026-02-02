export type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number; // 1-5
};

export const testimonials: TestimonialItem[] = [
  {
    id: 1,
    name: "Bang Upin",
    role: "Pedagang Asongan",
    content:
      "Saya merasa lebih tenang dan lebih paham langkah yang harus saya ambil setelah konsultasi. Pelayanannya ramah dan profesional.",
    rating: 4,
  },
  {
    id: 2,
    name: "Ibuk Sukijan",
    role: "Ibu Rumah Tangga",
    content:
      "Sesi konseling membantu saya mengelola emosi dan komunikasi di rumah. Penjelasannya jelas dan tidak menghakimi.",
    rating: 5,
  },
  {
    id: 3,
    name: "Mpok Ina",
    role: "Karyawan Swasta",
    content:
      "Pendekatannya personal, saya merasa didengar. Setelah beberapa sesi, kecemasan saya jauh lebih terkontrol.",
    rating: 4,
  },
];
