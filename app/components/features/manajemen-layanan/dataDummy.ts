import type { LayananItem } from "./types";

export const INITIAL_LAYANAN: LayananItem[] = [
  {
    id: 1,
    nama: "Konsultasi Individu",
    jenis: "Konseling",              // jenis layanan
    kategori: "Non Paket",          // kategori
    deskripsi: "Sesi konsultasi tatap muka dengan psikolog.",
    catatan: "Durasi per sesi adalah 60 menit.",
    durasiMenit: 60,
    harga: 150000,
    status: "Aktif",
  },
  {
    id: 2,
    nama: "Mental Health Check Up",
    jenis: "Psikotes",
    kategori: "Non Paket",
    deskripsi: "Screening awal kondisi kesehatan mental.",
    durasiMenit: 45,
    harga: 150000,
    status: "Aktif",
  },
  {
    id: 3,
    nama: "Kesiapan Sekolah",
    jenis: "Psikotes",
    kategori: "Non Paket",
    deskripsi: "Penilaian kesiapan anak memasuki sekolah.",
    durasiMenit: 45,
    harga: 150000,
    status: "Aktif",
  },
  {
    id: 4,
    nama: "Psikoedukasi",
    jenis: "Seminar",
    kategori: "Paket",
    deskripsi: "Seminar psikoedukasi untuk kelompok.",
    durasiMenit: 120,
    harga: 150000,
    status: "Draft",
  },
  {
    id: 5,
    nama: "3x Sesi Konseling",
    jenis: "Konseling",
    kategori: "Paket",
    deskripsi: "Paket 3 sesi konseling individu.",
    catatan: "Diskon 10% untuk paket ini.",
    durasiMenit: 3 * 60,
    harga: 150000,
    status: "Draft",
  },
];
