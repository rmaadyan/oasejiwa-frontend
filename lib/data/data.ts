import { BundlePackage, FAQ, Service, Testimonial } from "@/types";

export const services: Service[] = [
  {
    id: 1,
    name: "Konsultasi Psikologi",
    duration: "30 Menit",
    description: "Punya pertanyaan seputar kesehatan mental, hubungan, atau masalah sehari-hari? Dapatkan jawaban dan panduan dari psikolog profesional.",
    price: "Rp 150.000"
  },
  {
    id: 2,
    name: "Mental Health Check-Up",
    duration: "-",
    description: "Cek kondisi kesehatan mental Anda seperti tingkat stres dan emosi. Hasil lengkap dengan gambaran umum dan rekomendasi langkah selanjutnya.",
    price: "Rp 150.000"
  },
  {
    id: 3,
    name: "Konseling Individu",
    duration: "60 Menit",
    description: "Pendampingan bertahap untuk menggali masalah lebih dalam, kelola emosi, dan ubah pola pikir menjadi lebih positif bersama psikolog.",
    price: "Rp 200.000"
  },
  {
    id: 4,
    name: "Konseling Pasangan (Pra-Nikah)",
    duration: "60 Menit",
    description: "Persiapkan pernikahan yang harmonis. Perkuat komunikasi, pahami perbedaan, dan hadapi masa depan bersama dengan lebih siap.",
    price: "Rp 499.000"
  },
  {
    id: 5,
    name: "Konseling Pasangan (Keluarga)",
    duration: "60 Menit",
    description: "Atasi konflik keluarga, perbaiki komunikasi, dan bangun hubungan yang lebih sehat antar anggota keluarga.",
    price: "Rp 499.000"
  },
  {
    id: 6,
    name: "Paket Kesiapan Sekolah",
    duration: "-",
    description: "Supaya anak lebih percaya diri saat memulai sekolah, layanan ini membantu menilai kemampuan dasar anak. Mulai dari motorik, bahasa, emosi, hingga kognitif.",
    price: "Rp 250.000"
  },
  {
    id: 7,
    name: "Paket Kesulitan Belajar",
    duration: "-",
    description: "Membantu mengidentifikasi hambatan belajar seperti kesulitan konsentrasi, calistung, motivasi belajar, atau penyesuaian di sekolah melalui asesmen psikologis.",
    price: "Rp 299.000"
  },
  {
    id: 8,
    name: "Tes Inteligensi (IQ)",
    duration: "-",
    description: "Kenali potensi diri anda lebih mendalam. Tes inteligensi ini membantu mengukur kecerdasan, memahami gaya belajar, serta menjadi panduan untuk mengembangkan diri.",
    price: "Rp 249.000"
  },
  {
    id: 9,
    name: "Evaluasi Kepribadian",
    duration: "-",
    description: "Mengenal diri adalah langkah awal menuju hidup yang lebih bahagia. Tes kepribadian membantu memahami karakter, cara berpikir, hingga gaya berinteraksi.",
    price: { basic: "Rp 400.000", advice: "Rp 600.000", mmpi: "Rp 350.000" }
  },
  {
    id: 10,
    name: "Tes Bakat dan Minat",
    duration: "-",
    description: "Bingung memilih jurusan, sekolah atau karir? Tes bakat dan minat membantu mengenali potensi diri sekaligus bidang yang paling sesuai dengan kemampuan dan karakteristik Anda.",
    price: "Rp 299.000"
  },
  {
    id: 11,
    name: "Tes CPMI",
    duration: "-",
    description: "Layanan pemeriksaan psikologis bagi Calon Pekerja Migran Indonesia untuk menilai kesiapan mental, kepribadian, stabilitas emosi, dan kemampuan penyesuaian diri.",
    price: "Rp 300.000"
  },
  {
    id: 12,
    name: "Terapi CBT",
    duration: "-",
    description: "Layanan ini membantu mengubah pola pikir negatif menjadi lebih sehat dan adaptif. Dengan pendampingan psikolog profesional, anda belajar cara mengelola stres, kecemasan, maupun emosi.",
    price: "Rp 300.000"
  },
  {
    id: 13,
    name: "Psikoedukasi (Seminar)",
    duration: "60 Menit",
    description: "Kegiatan edukatif berbentuk seminar, kelas, atau sesi berbagi yang membahas isu-isu psikologis secara umum dan relevan dengan kehidupan sehari-hari.",
    price: "Rp 600.000"
  }
];

export const bundlePackages: BundlePackage[] = [
  {
    id: 1,
    name: "Bundling Konseling",
    sessions: "3x sesi",
    price: "Rp 500.000",
    discount: "Hemat 16,7%"
  },
  {
    id: 2,
    name: "Bundling Sesi Psikoterapi",
    sessions: "5x sesi",
    price: "Rp 1.200.000",
    discount: "Hemat 20%"
  },
  {
    id: 3,
    name: "Bundling Sesi Konseling Pasangan",
    sessions: "3x sesi",
    price: "Rp 1.150.000",
    discount: "Hemat 23,3%"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Iseng Ujan",
    role: "Mahasiswa",
    content: "Pelayanannya sangat baik dan profesional. Saya merasa lebih tenang setelah konsultasi di Oase Jiwa.",
    rating: 5,
    gender: "male"
  },
  {
    id: 2,
    name: "Rizki Sadigih",
    role: "Karyawan Swasta",
    content: "Psikolog di Oase Jiwa sangat membantu saya mengatasi kecemasan. Highly recommended!",
    rating: 5,
    gender: "male"
  },
  {
    id: 3,
    name: "Vyona Haz",
    role: "Ibu Rumah Tangga",
    content: "Terima kasih Oase Jiwa telah membantu keluarga saya menemukan solusi terbaik untuk masalah kami.",
    rating: 5,
    gender: "female"
  }
];

export const faqs: FAQ[] = [
  {
    id: 1,
    question: "Apakah saya harus memiliki gangguan mental untuk berkonsultasi dengan psikolog?",
    answer: "Tidak. Konsultasi dengan psikolog tidak hanya untuk individu dengan gangguan mental, tetapi juga bagi siapa saja yang ingin mengembangkan diri, meningkatkan kesejahteraan emosional, atau menghadapi tantangan hidup seperti stres, kesulitan dalam hubungan, atau masalah di tempat kerja."
  },
  {
    id: 2,
    question: "Bagaimana proses konsultasi psikologi berlangsung?",
    answer: "Sesi pertama biasanya melibatkan asesmen awal, di mana saya akan mendengarkan permasalahan Anda, memahami kebutuhan Anda, dan menentukan pendekatan terapi yang sesuai. Sesi selanjutnya disesuaikan dengan perkembangan dan kebutuhan Anda."
  },
  {
    id: 3,
    question: "Berapa lama sesi konsultasi biasanya berlangsung?",
    answer: "Setiap sesi konsultasi berlangsung sekitar 45–60 menit, tergantung pada kebutuhan dan kompleksitas permasalahan yang dibahas."
  },
  {
    id: 4,
    question: "Apakah saya bisa melakukan sesi konsultasi secara online?",
    answer: "Ya, saya menyediakan layanan konsultasi secara tatap muka maupun online untuk memberikan fleksibilitas bagi klien yang tidak dapat hadir langsung ke tempat praktik."
  },
  {
    id: 5,
    question: "Berapa biaya layanan yang ditawarkan?",
    answer: "Biaya layanan bervariasi tergantung pada jenis layanan yang diambil. Anda dapat menghubungi saya untuk informasi lebih lanjut mengenai tarif dan metode pembayaran."
  }
];
