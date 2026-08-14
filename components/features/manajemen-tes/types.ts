// components/features/manajemen-tes/types.ts

export type TesStatus = "Aktif" | "Draft";

export type ArahItem = "positif" | "negatif";

export type LikertValue = 0 | 1 | 2 | 3 | 4 | 5;

// Pertanyaan sekarang bisa punya section (dimensi), mis. "Depresi"
export type PertanyaanItem = {
  id: string;
  teks: string;
  arah: ArahItem;
  section?: string;
  urutan?: number;
  image?: string;
  imageUrl?: string;
};

export type LikertOption = {
  id: string;
  label: string;
  value: LikertValue;
};

// Kategori global (berbasis persentase total skor)
export type DiagnosisKategori = {
  id: string;
  nama: string;
  minPersen: number;
  maxPersen: number;
  deskripsi?: string;
  result?: string;
};



// Kategori khusus per dimensi (berbasis skor absolut)
export type SectionKategori = {
  id: string;
  nama: string;     // mis. "Normal"
  minSkor: number;
  maxSkor: number;
  deskripsi?: string;
};

export type SectionKategoriMap = {
  [sectionName: string]: SectionKategori[];
};

export type TesItem = {
  id: number;
  nama: string;
  jumlah: number;
  status: TesStatus;
  deskripsi: string;
  penjelasanHasil: string;
  jenis?: string;
  coverUrl?: string;
  pertanyaan: PertanyaanItem[];
  likert: LikertOption[];
  kategori: DiagnosisKategori[];
  sectionKategori?: SectionKategoriMap; // opsional, hanya tes model DASS
};

// payload create (tanpa id)
export type TesCreatePayload = Omit<TesItem, "id">;
