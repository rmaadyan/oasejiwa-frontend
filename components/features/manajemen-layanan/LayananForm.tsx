"use client";

import { useEffect, useState } from "react";
import type {
  KategoriLayanan,
  LayananItem,
  StatusLayanan,
} from "./types";

type Props = {
  mode: "create" | "edit";
  initialData?: LayananItem | null;
  onCancel: () => void;
  onSubmitLocal: (layanan: LayananItem) => void;
};

export default function LayananForm({
  mode,
  initialData,
  onCancel,
  onSubmitLocal,
}: Props) {
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [kategori, setKategori] = useState<KategoriLayanan>("Non Paket");
  const [deskripsi, setDeskripsi] = useState("");
  const [catatan, setCatatan] = useState(""); // <- baru
  const [durasi, setDurasi] = useState("");
  const [harga, setHarga] = useState("");
  const [status, setStatus] = useState<StatusLayanan>("Aktif");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isAktif = status === "Aktif";

  useEffect(() => {
    if (!initialData) return;
    setNama(initialData.nama);
    setJenis(initialData.jenis ?? "");
    setKategori(initialData.kategori ?? "Non Paket");
    setDeskripsi(initialData.deskripsi);
    setCatatan(initialData.catatan ?? ""); // <- baru
    setDurasi(String(initialData.durasiMenit));
    setHarga(String(initialData.harga));
    setStatus(initialData.status);
    setCoverPreview(initialData.coverUrl ?? null);
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCoverPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!nama.trim()) {
      setErrorMsg("Nama layanan wajib diisi.");
      return;
    }
    if (!jenis.trim()) {
      setErrorMsg("Jenis layanan wajib diisi.");
      return;
    }
    if (!harga.trim()) {
      setErrorMsg("Harga wajib diisi.");
      return;
    }

    const item: LayananItem = {
      id: initialData?.id ?? Date.now(),
      nama: nama.trim(),
      jenis: jenis.trim(),
      kategori,
      deskripsi: deskripsi.trim(),
      catatan: catatan.trim() || undefined, // <- baru
      durasiMenit: durasi ? Number(durasi) : 0,
      harga: Number(harga),
      status,
      coverUrl: coverPreview ?? initialData?.coverUrl,
    };

    onSubmitLocal(item);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 rounded-2xl bg-[#f5f7fb] p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Manajemen Layanan
          </p>
          <h2 className="text-lg font-semibold text-secondary-heading">
            {mode === "create" ? "Tambah Layanan" : "Edit Layanan"}
          </h2>
        </div>
      </div>

      {/* Alert error */}
      {errorMsg && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {errorMsg}
        </div>
      )}

      {/* Card utama form */}
      <div className="grid gap-4 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
        {/* Nama layanan */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Nama Layanan<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mis. Konsultasi Individu"
          />
        </div>

        {/* Jenis layanan */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Jenis Layanan<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            value={jenis}
            onChange={(e) => setJenis(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mis. Seminar, Konseling, Psikotes"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Kategori
          </label>
          <select
            value={kategori}
            onChange={(e) =>
              setKategori(e.target.value as KategoriLayanan)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Non Paket">Non Paket</option>
            <option value="Paket">Paket</option>
          </select>
        </div>

        {/* Durasi */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Durasi (menit)
          </label>
          <input
            type="number"
            min={0}
            value={durasi}
            onChange={(e) => setDurasi(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="60"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Harga<span className="text-red-500"> *</span>
          </label>
          <input
            type="number"
            min={0}
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="150000"
          />
        </div>

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Deskripsi
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Deskripsi singkat layanan..."
          />
        </div>

        {/* Catatan */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Catatan (opsional)
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mis. catatan untuk klien, hal yang perlu dipersiapkan sebelum sesi, dsb."
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Status
          </label>
          <div className="flex items-center gap-3 rounded-xl bg-[#f5f7fb] px-3 py-2">
            <button
              type="button"
              onClick={() =>
                setStatus((prev) => (prev === "Aktif" ? "Draft" : "Aktif"))
              }
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isAktif ? "bg-emerald-500" : "bg-yellow-400"
                }`}
              aria-pressed={isAktif}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isAktif ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
            <span
              className={`text-xs font-semibold ${isAktif ? "text-emerald-600" : "text-yellow-600"
                }`}
            >
              {isAktif ? "Aktif" : "Draft"}
            </span>
          </div>
        </div>

        {/* Cover */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Cover Layanan
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-xs text-gray-700"
          />
          {coverPreview && (
            <div className="mt-2 h-24 w-40 overflow-hidden rounded-lg border border-gray-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverPreview}
                alt="Preview cover"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          {mode === "create" ? "Simpan Layanan" : "Update Layanan"}
        </button>
      </div>
    </form>
  );
}
