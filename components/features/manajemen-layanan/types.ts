export type StatusLayanan = "Aktif" | "Draft";
export type KategoriLayanan = "Paket" | "Non Paket";

export type LayananItem = {
  id: number;
  nama: string;
  jenis: string; 
  kategori: KategoriLayanan; 
  deskripsi: string;         
  catatan?: string;
  deskripsiPanjang?: string; 
  durasiMenit: number;
  harga: number;
  status: StatusLayanan;
  coverUrl?: string;
  urutan?: number; // 🟢 posisi urutan tampil (untuk fitur drag & drop admin)
};