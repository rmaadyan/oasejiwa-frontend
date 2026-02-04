import {
  Service,
  Psychologist,
  PsychologistProfile,
  TimeSlot,
  DateOption,
  PaymentMethod,
  BookingSummary,
  PaymentData,
} from "@/components/features/booking";

// Services Data
export const bookingServices: Service[] = [
  {
    id: "1",
    title: "Konseling Individu",
    description:
      "Sesi konseling one-on-one dengan psikolog untuk membahas masalah pribadi Anda secara mendalam.",
    price: 200000,
    image: "/assets/services/individual.jpg",
    duration: "60 menit",
  },
  {
    id: "2",
    title: "Konseling Pasangan",
    description:
      "Konseling untuk pasangan yang ingin memperbaiki komunikasi dan hubungan mereka.",
    price: 350000,
    image: "/assets/services/couple.jpg",
    duration: "90 menit",
  },
  {
    id: "3",
    title: "Konseling Keluarga",
    description:
      "Sesi konseling untuk seluruh anggota keluarga guna menyelesaikan konflik dan meningkatkan keharmonisan.",
    price: 400000,
    image: "/assets/services/family.jpg",
    duration: "90 menit",
  },
  {
    id: "4",
    title: "Asesmen Psikologi",
    description:
      "Tes dan evaluasi psikologis untuk memahami kondisi mental dan kepribadian Anda.",
    price: 500000,
    image: "/assets/services/assessment.jpg",
    duration: "120 menit",
  },
  {
    id: "5",
    title: "Terapi CBT",
    description:
      "Cognitive Behavioral Therapy untuk mengatasi kecemasan, depresi, dan pola pikir negatif.",
    price: 250000,
    image: "/assets/services/cbt.jpg",
    duration: "60 menit",
  },
  {
    id: "6",
    title: "Konseling Anak & Remaja",
    description:
      "Konseling khusus untuk anak-anak dan remaja dengan pendekatan yang sesuai usia.",
    price: 200000,
    image: "/assets/services/child.jpg",
    duration: "45 menit",
  },
];

// Psychologists Data
export const psychologists: Psychologist[] = [
  {
    id: "1",
    name: "Dr. Sarah Wijaya, M.Psi",
    role: "Psikolog Klinis",
    specializations: ["Depresi", "Kecemasan", "Trauma"],
    experience: "8 tahun",
    rating: 4.9,
    reviews: 128,
    price: 200000,
    avatar: "/assets/psychologists/sarah.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Dr. Budi Santoso, M.Psi",
    role: "Psikolog Klinis Dewasa",
    specializations: ["Stres Kerja", "Burnout", "Hubungan"],
    experience: "10 tahun",
    rating: 4.8,
    reviews: 95,
    price: 250000,
    avatar: "/assets/psychologists/budi.jpg",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Maya Putri, M.Psi",
    role: "Psikolog Anak & Remaja",
    specializations: ["ADHD", "Autism", "Parenting"],
    experience: "6 tahun",
    rating: 4.9,
    reviews: 87,
    price: 200000,
    avatar: "/assets/psychologists/maya.jpg",
    available: true,
  },
  {
    id: "4",
    name: "Dr. Ahmad Rizki, M.Psi",
    role: "Psikolog Keluarga",
    specializations: ["Konflik Keluarga", "Pernikahan", "Komunikasi"],
    experience: "12 tahun",
    rating: 4.7,
    reviews: 156,
    price: 300000,
    avatar: "/assets/psychologists/ahmad.jpg",
    available: false,
  },
  {
    id: "5",
    name: "Dr. Lisa Permata, M.Psi",
    role: "Psikolog Klinis",
    specializations: ["Eating Disorder", "Body Image", "Self-Esteem"],
    experience: "5 tahun",
    rating: 4.8,
    reviews: 62,
    price: 200000,
    avatar: "/assets/psychologists/lisa.jpg",
    available: true,
  },
];

export const specializations = [
  "Semua",
  "Depresi",
  "Kecemasan",
  "Trauma",
  "Stres Kerja",
  "Hubungan",
  "ADHD",
  "Parenting",
];

// Schedule Data
export const psychologistProfile: PsychologistProfile = {
  id: "1",
  name: "Andi Zainuddin Japeri, M. Psi, Psikolog",
  avatar: "/assets/psychologists/sarah.jpg",
  education: [
    "Sarjana Psikologi, Universitas Indonesia",
    "Magister Profesi Psikologi, Universitas Gadjah Mada",
  ],
  licenseNumber: "1234567890",
  specialization: "Klinis Dewasa",
  bio: "Seorang psikolog klinis berpengalaman dengan fokus pada kesehatan mental dewasa. Memiliki pendekatan yang hangat dan empatik dalam membantu klien mengatasi berbagai tantangan emosional dan psikologis. Berpengalaman menangani kasus depresi, kecemasan, trauma, dan masalah hubungan interpersonal.",
  expertise: [
    "Konseling Psikologi",
    "Psikoterapi",
    "Asesmen Psikologi",
    "Intervensi Psikologi",
  ],
  caseExperience: [
    "Depresi",
    "Kecemasan",
    "Trauma",
    "Disabilitas Intelektual",
    "Permasalahan Kepercayaan Diri",
    "Permasalahan Keluarga",
    "Permasalahan Komunikasi Anak",
    "Permasalahan Harga Diri",
    "Permasalahan Bully",
  ],
};

export const timeSlots: TimeSlot[] = [
  { id: "09:00", time: "09.00 WIB", available: true },
  { id: "10:00", time: "10.00 WIB", available: true },
  { id: "11:00", time: "11.00 WIB", available: true },
  { id: "13:00", time: "13.00 WIB", available: true },
  { id: "14:00", time: "14.00 WIB", available: true },
  { id: "15:00", time: "15.00 WIB", available: true },
  { id: "16:00", time: "16.00 WIB", available: false },
  { id: "19:00", time: "19.00 WIB", available: true },
  { id: "20:00", time: "20.00 WIB", available: true },
];

// Generate dates for the next 14 days
export const generateDates = (): DateOption[] => {
  const dates: DateOption[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: `date-${i}`,
      date: date,
      dayName: date.toLocaleDateString("id-ID", { weekday: "long" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("id-ID", { month: "short" }),
      fullDate: date.toISOString().split("T")[0],
      isToday: i === 0,
    });
  }
  return dates;
};

// Payment Methods Data
export const paymentMethods: PaymentMethod[] = [
  {
    id: "bca",
    name: "BCA Virtual Account",
    logo: "/assets/payments/bca.png",
    category: "bank",
  },
  {
    id: "bni",
    name: "BNI Virtual Account",
    logo: "/assets/payments/bni.png",
    category: "bank",
  },
  {
    id: "mandiri",
    name: "Mandiri Virtual Account",
    logo: "/assets/payments/mandiri.png",
    category: "bank",
  },
  {
    id: "bri",
    name: "BRI Virtual Account",
    logo: "/assets/payments/bri.png",
    category: "bank",
  },
  {
    id: "gopay",
    name: "GoPay",
    logo: "/assets/payments/gopay.png",
    category: "ewallet",
  },
  {
    id: "ovo",
    name: "OVO",
    logo: "/assets/payments/ovo.png",
    category: "ewallet",
  },
  {
    id: "dana",
    name: "DANA",
    logo: "/assets/payments/dana.png",
    category: "ewallet",
  },
  {
    id: "shopeepay",
    name: "ShopeePay",
    logo: "/assets/payments/shopeepay.png",
    category: "ewallet",
  },
];

// Booking Summary (mock)
export const bookingSummary: BookingSummary = {
  service: "Konseling Individu",
  psychologist: "Dr. Sarah Wijaya, M.Psi",
  date: "Senin, 15 Januari 2025",
  time: "10:00 WIB",
  duration: "60 menit",
  price: 200000,
};

// Payment Data (mock)
export const paymentData: PaymentData = {
  orderId: "OJ-20250115-001",
  virtualAccount: "8800123456789012",
  bank: "BCA",
  amount: 200000,
  expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  service: "Konseling Individu",
  psychologist: "Dr. Sarah Wijaya, M.Psi",
  date: "Senin, 15 Januari 2025",
  time: "10:00 WIB",
};
