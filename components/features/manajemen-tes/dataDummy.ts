import {
  TesItem,
  LikertOption,
  DiagnosisKategori,
  PertanyaanItem,
} from "./types";

export const DEFAULT_LIKERT: LikertOption[] = [
  { id: "sts", label: "Sangat Tidak Setuju", value: 1 },
  { id: "ts", label: "Tidak Setuju", value: 2 },
  { id: "r", label: "Ragu-ragu", value: 3 },
  { id: "s", label: "Setuju", value: 4 },
  { id: "ss", label: "Sangat Setuju", value: 5 },
];

export const DEFAULT_KATEGORI: DiagnosisKategori[] = [
  {
    id: "sr",
    nama: "Sangat Rendah",
    minPersen: 0,
    maxPersen: 20,
    deskripsi:
      "Tidak ada intervensi khusus, tetap pertahankan keseimbangan hidup.",
  },
  {
    id: "r",
    nama: "Rendah",
    minPersen: 21,
    maxPersen: 40,
    deskripsi:
      "Perhatikan gejala awal dan lakukan aktivitas yang menenangkan.",
  },
  {
    id: "c",
    nama: "Cukup",
    minPersen: 41,
    maxPersen: 60,
    deskripsi:
      "Disarankan meningkatkan coping seperti relaksasi, olahraga, dan manajemen waktu.",
  },
  {
    id: "t",
    nama: "Tinggi",
    minPersen: 61,
    maxPersen: 80,
    deskripsi:
      "Pertimbangkan konseling psikologis untuk dukungan lebih lanjut.",
  },
  {
    id: "st",
    nama: "Sangat Tinggi",
    minPersen: 81,
    maxPersen: 100,
    deskripsi: "Disarankan intervensi intensif ke psikolog/psikiater.",
  },
];

const SAMPLE_PERTANYAAN: PertanyaanItem[] = [
  {
    id: "1",
    teks: "Saya merasa tidak mampu mengendalikan hal-hal penting dalam hidup saya.",
    arah: "positif",
  },
  {
    id: "2",
    teks: "Saya merasa tenang dan mudah rileks.",
    arah: "negatif",
  },
  {
    id: "3",
    teks: "Saya merasa tertekan dan stres.",
    arah: "positif",
  },
];

export const INITIAL_DATA: TesItem[] = [
  {
    id: 1,
    nama: "Perceived Stress Scale (PSS)",
    jumlah: SAMPLE_PERTANYAAN.length,
    status: "Aktif",
    deskripsi:
      "Skala untuk mengukur tingkat stres yang dirasakan dalam beberapa minggu terakhir.",
    penjelasanHasil:
      "Penjelasan hasil tes berdasarkan skor total yang diperoleh.",
    pertanyaan: SAMPLE_PERTANYAAN,
    likert: DEFAULT_LIKERT,
    kategori: DEFAULT_KATEGORI,
  },
];
