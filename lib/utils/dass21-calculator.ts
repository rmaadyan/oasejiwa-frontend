import { DASS21_QUESTIONS, Dass21Dimension } from "../data/dass21-questions";

export interface Dass21DimensionScore {
  dimension: Dass21Dimension;
  score: number; // raw sum of 7 items (0-21)
  maxScore: number; // 21
  category: string; // "Normal" | "Ringan" | "Sedang" | "Parah" | "Sangat Parah"
  description: string;
}

export interface Dass21Result {
  depression: Dass21DimensionScore;
  anxiety: Dass21DimensionScore;
  stress: Dass21DimensionScore;
  overallCategory: string;
  interpretation: string;
  disclaimer: string;
  totalScore: number;
  maxTotalScore: number;
}

export function getDepressionCategory(score: number): { category: string; description: string } {
  if (score <= 4) return { category: "Normal", description: "Tingkat gejala depresi berada pada rentang normal." };
  if (score <= 6) return { category: "Ringan", description: "Terdapat indikasi gejala depresi ringan." };
  if (score <= 10) return { category: "Sedang", description: "Terdapat gejala depresi tingkat sedang yang perlu mendapat perhatian." };
  if (score <= 13) return { category: "Parah", description: "Terdapat gejala depresi parah yang mengganggu kesejahteraan." };
  return { category: "Sangat Parah", description: "Terdapat indikasi gejala depresi sangat parah yang membutuhkan penanganan profesional." };
}

export function getAnxietyCategory(score: number): { category: string; description: string } {
  if (score <= 3) return { category: "Normal", description: "Tingkat kecemasan berada pada rentang normal." };
  if (score <= 5) return { category: "Ringan", description: "Terdapat indikasi gejala kecemasan ringan." };
  if (score <= 7) return { category: "Sedang", description: "Terdapat gejala kecemasan tingkat sedang." };
  if (score <= 9) return { category: "Parah", description: "Terdapat gejala kecemasan parah yang signifikan." };
  return { category: "Sangat Parah", description: "Terdapat indikasi kecemasan sangat parah yang memerlukan evaluasi klinis." };
}

export function getStressCategory(score: number): { category: string; description: string } {
  if (score <= 7) return { category: "Normal", description: "Tingkat stres berada pada rentang normal." };
  if (score <= 9) return { category: "Ringan", description: "Terdapat indikasi tingkat stres ringan." };
  if (score <= 12) return { category: "Sedang", description: "Terdapat tingkat stres sedang akibat tekanan harian." };
  if (score <= 16) return { category: "Parah", description: "Terdapat tingkat stres parah yang dapat memicu kelelahan emosional." };
  return { category: "Sangat Parah", description: "Terdapat tingkat stres sangat parah yang memerlukan pengelolaan segera." };
}

export function calculateDass21Result(answers: Record<number | string, number>): Dass21Result {
  let depScore = 0;
  let anxScore = 0;
  let strScore = 0;

  DASS21_QUESTIONS.forEach((q) => {
    const val = Number(answers[q.id] ?? answers[String(q.id)] ?? 0);
    if (q.dimension === "Depression") depScore += val;
    if (q.dimension === "Anxiety") anxScore += val;
    if (q.dimension === "Stress") strScore += val;
  });

  const depRes = getDepressionCategory(depScore);
  const anxRes = getAnxietyCategory(anxScore);
  const strRes = getStressCategory(strScore);

  const overallScore = depScore + anxScore + strScore;
  
  let overallCategory = "Normal";
  if (depRes.category === "Sangat Parah" || anxRes.category === "Sangat Parah" || strRes.category === "Sangat Parah") {
    overallCategory = "Sangat Parah";
  } else if (depRes.category === "Parah" || anxRes.category === "Parah" || strRes.category === "Parah") {
    overallCategory = "Parah";
  } else if (depRes.category === "Sedang" || anxRes.category === "Sedang" || strRes.category === "Sedang") {
    overallCategory = "Sedang";
  } else if (depRes.category === "Ringan" || anxRes.category === "Ringan" || strRes.category === "Ringan") {
    overallCategory = "Ringan";
  }

  const interpretation = `Berdasarkan pengisian instrumen DASS-21 selama 1 minggu terakhir:
- Depresi: Skor ${depScore}/21 (${depRes.category}) — ${depRes.description}
- Kecemasan (Anxiety): Skor ${anxScore}/21 (${anxRes.category}) — ${anxRes.description}
- Stres: Skor ${strScore}/21 (${strRes.category}) — ${strRes.description}`;

  const disclaimer = "Hasil ini merupakan hasil skrining awal dan bukan diagnosis klinis. Untuk memperoleh hasil yang lebih akurat, pengguna disarankan melakukan konsultasi dengan Psikolog Oase Jiwa.";

  return {
    depression: {
      dimension: "Depression",
      score: depScore,
      maxScore: 21,
      category: depRes.category,
      description: depRes.description,
    },
    anxiety: {
      dimension: "Anxiety",
      score: anxScore,
      maxScore: 21,
      category: anxRes.category,
      description: anxRes.description,
    },
    stress: {
      dimension: "Stress",
      score: strScore,
      maxScore: 21,
      category: strRes.category,
      description: strRes.description,
    },
    overallCategory,
    interpretation,
    disclaimer,
    totalScore: overallScore,
    maxTotalScore: 63,
  };
}
