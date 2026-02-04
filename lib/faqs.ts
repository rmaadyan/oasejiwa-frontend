export type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "Apakah saya harus memiliki gangguan mental untuk berkonsultasi dengan psikolog?",
    answer:
      "Tidak. Konsultasi dengan psikolog tidak hanya untuk individu dengan gangguan mental, tetapi juga bagi siapa saja yang ingin mengembangkan diri, meningkatkan kesejahteraan emosional, atau menghadapi tantangan hidup seperti stres, kesulitan dalam hubungan, atau masalah di tempat kerja.",
  },
  {
    id: 2,
    question: "Bagaimana proses konsultasi psikologi berlangsung?",
    answer:
      "Sesi pertama biasanya melibatkan asesmen awal, di mana saya akan mendengarkan permasalahan Anda, memahami kebutuhan Anda, dan menentukan pendekatan terapi yang sesuai. Sesi selanjutnya disesuaikan dengan perkembangan dan kebutuhan Anda.",
  },
  {
    id: 3,
    question: "Berapa lama sesi konsultasi biasanya berlangsung?",
    answer:
      "Setiap sesi konsultasi berlangsung sekitar 45–60 menit, tergantung pada kebutuhan dan kompleksitas permasalahan yang dibahas.",
  },
  {
    id: 4,
    question: "Apakah saya bisa melakukan sesi konsultasi secara online?",
    answer:
      "Ya, saya menyediakan layanan konsultasi secara tatap muka maupun online untuk memberikan fleksibilitas bagi klien yang tidak dapat hadir langsung ke tempat praktik.",
  },
  {
    id: 5,
    question: "Berapa biaya layanan yang ditawarkan?",
    answer:
      "Biaya layanan bervariasi tergantung pada jenis layanan yang diambil. Anda dapat menghubungi saya untuk informasi lebih lanjut mengenai tarif dan metode pembayaran.",
  },
];
