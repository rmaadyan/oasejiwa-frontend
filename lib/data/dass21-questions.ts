// Official DASS-21 Specification File

export type Dass21Dimension = "Stress" | "Anxiety" | "Depression";

export interface Dass21Question {
  id: number;
  teks: string;
  dimension: Dass21Dimension;
}

export const DASS21_SCALE_OPTIONS = [
  {
    value: 0,
    label: "0 = Tidak sesuai dengan saya sama sekali, atau tidak pernah.",
    shortLabel: "Tidak Sesuai / Tidak Pernah",
  },
  {
    value: 1,
    label: "1 = Sesuai dengan saya sampai tingkat tertentu, atau kadang-kadang.",
    shortLabel: "Kadang-kadang",
  },
  {
    value: 2,
    label: "2 = Sesuai dengan saya sampai batas yang dapat dipertimbangkan, atau lumayan sering.",
    shortLabel: "Lumayan Sering",
  },
  {
    value: 3,
    label: "3 = Sangat sesuai dengan saya, atau sering sekali.",
    shortLabel: "Sering Sekali",
  },
];

export const DASS21_QUESTIONS: Dass21Question[] = [
  {
    id: 1,
    teks: "Saya merasa sulit untuk beristirahat.",
    dimension: "Stress",
  },
  {
    id: 2,
    teks: "Saya merasa rongga mulut saya kering.",
    dimension: "Anxiety",
  },
  {
    id: 3,
    teks: "Saya sama sekali tidak dapat merasakan perasaan positif (contoh: merasa gembira, bangga, dsb).",
    dimension: "Depression",
  },
  {
    id: 4,
    teks: "Saya merasa kesulitan bernafas (misalnya seringkali terengah-engah atau tidak dapat bernapas padahal tidak melakukan aktivitas fisik sebelumnya).",
    dimension: "Anxiety",
  },
  {
    id: 5,
    teks: "Saya merasa sulit berinisiatif melakukan sesuatu.",
    dimension: "Depression",
  },
  {
    id: 6,
    teks: "Saya cenderung menunjukkan reaksi berlebihan terhadap suatu situasi.",
    dimension: "Stress",
  },
  {
    id: 7,
    teks: "Saya merasa gemetar (misalnya pada tangan).",
    dimension: "Anxiety",
  },
  {
    id: 8,
    teks: "Saya merasa energi saya terkuras karena terlalu cemas.",
    dimension: "Stress",
  },
  {
    id: 9,
    teks: "Saya merasa khawatir dengan situasi dimana saya mungkin menjadi panik dan mempermalukan diri sendiri.",
    dimension: "Anxiety",
  },
  {
    id: 10,
    teks: "Saya merasa tidak ada lagi yang bisa saya harapkan.",
    dimension: "Depression",
  },
  {
    id: 11,
    teks: "Saya merasa gelisah.",
    dimension: "Stress",
  },
  {
    id: 12,
    teks: "Saya merasa sulit untuk merasa tenang.",
    dimension: "Stress",
  },
  {
    id: 13,
    teks: "Saya merasa sedih dan tertekan.",
    dimension: "Depression",
  },
  {
    id: 14,
    teks: "Saya sulit untuk bersabar dalam menghadapi gangguan yang terjadi ketika sedang melakukan sesuatu.",
    dimension: "Stress",
  },
  {
    id: 15,
    teks: "Saya merasa hampir panik.",
    dimension: "Anxiety",
  },
  {
    id: 16,
    teks: "Saya tidak bisa merasa antusias terhadap hal apapun.",
    dimension: "Depression",
  },
  {
    id: 17,
    teks: "Saya merasa diri saya tidak berharga.",
    dimension: "Depression",
  },
  {
    id: 18,
    teks: "Perasaan saya mudah tergugah atau tersentuh.",
    dimension: "Stress",
  },
  {
    id: 19,
    teks: "Saya menyadari kondisi jantung saya (seperti meningkatnya atau melemahnya detak jantung) meskipun sedang tidak melakukan aktivitas fisik.",
    dimension: "Anxiety",
  },
  {
    id: 20,
    teks: "Saya merasa ketakutan tanpa alasan yang jelas.",
    dimension: "Anxiety",
  },
  {
    id: 21,
    teks: "Saya merasa hidup ini tidak berarti.",
    dimension: "Depression",
  },
];
