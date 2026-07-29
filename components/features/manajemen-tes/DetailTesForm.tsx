"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/Alert";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  DiagnosisKategori,
  LikertOption,
  LikertValue,
  PertanyaanItem,
  SectionKategori,
  SectionKategoriMap,
  TesStatus,
} from "./types";
import { uploadGambar } from "@/lib/api/tes";

export type TesDetail = {
  id?: number;
  nama: string;
  deskripsi: string;
  penjelasanHasil: string;
  jenis?: string;
  status: TesStatus;
  coverUrl?: string;
  likert: LikertOption[];
  kategori: DiagnosisKategori[];
  pertanyaan: PertanyaanItem[];
  sectionKategori?: SectionKategoriMap;
};

type Props = {
  initial?: TesDetail | null;
  onSave: (tes: TesDetail) => void;
  onCancel: () => void;
};

const DEFAULT_LIKERT: LikertOption[] = [
  { id: "1", label: "Sangat Tidak Sesuai", value: 1 },
  { id: "2", label: "Tidak Sesuai", value: 2 },
  { id: "3", label: "Cukup Sesuai", value: 3 },
  { id: "4", label: "Sesuai", value: 4 },
  { id: "5", label: "Sangat Sesuai", value: 5 },
];

const DEFAULT_KATEGORI: DiagnosisKategori[] = [
  {
    id: "k1",
    nama: "Normal",
    minPersen: 0,
    maxPersen: 33,
    deskripsi: "Tidak ada indikasi masalah yang bermakna. Pertahankan pola hidup sehat dan mekanisme koping yang sudah baik.",
  },
  {
    id: "k2",
    nama: "Sedang",
    minPersen: 34,
    maxPersen: 66,
    deskripsi: "Perlu meningkatkan keterampilan manajemen stres, relaksasi, dan dukungan sosial.",
  },
  {
    id: "k3",
    nama: "Tinggi",
    minPersen: 67,
    maxPersen: 100,
    deskripsi: "Disarankan konsultasi dengan profesional (psikolog/psikiater) untuk asesmen lebih lanjut.",
  },
];

export default function DetailTesForm({ initial, onSave, onCancel }: Props) {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [penjelasanHasil, setPenjelasanHasil] = useState("");
  const [status, setStatus] = useState<TesStatus>("Draft");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [likert, setLikert] = useState<LikertOption[]>(DEFAULT_LIKERT);
  const [kategori, setKategori] = useState<DiagnosisKategori[]>(DEFAULT_KATEGORI);
  const [pertanyaan, setPertanyaan] = useState<PertanyaanItem[]>([]);
  const [sectionKategori, setSectionKategori] = useState<SectionKategoriMap>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initial) {
      setNama(initial.nama);
      setDeskripsi(initial.deskripsi);
      setPenjelasanHasil(initial.penjelasanHasil);
      setStatus(initial.status);
      setCoverUrl(initial.coverUrl ?? "");
      setLikert(initial.likert?.length ? initial.likert : DEFAULT_LIKERT);
      setKategori(initial.kategori?.length ? initial.kategori : DEFAULT_KATEGORI);
      setPertanyaan(initial.pertanyaan ?? []);
      setSectionKategori(initial.sectionKategori ?? {});
    }
  }, [initial]);

  const handleUploadGambar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setUploadError(null);
      const url = await uploadGambar(file);
      setCoverUrl(url);
    } catch (err) {
      setUploadError("Gagal upload gambar. Coba lagi.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nama.trim() || !deskripsi.trim()) {
      setFormError("Nama tes dan deskripsi wajib diisi sebelum menyimpan.");
      return;
    }

    const cleanedLikert = likert
      .filter((l) => l.label.trim() !== "")
      .map((l, idx) => ({ ...l, id: l.id || String(idx + 1) }));

    const cleanedKategori = kategori.filter(
      (k) => k.nama.trim() !== "" && k.minPersen <= k.maxPersen,
    );

    const cleanedPertanyaan = pertanyaan.filter((p) => p.teks.trim() !== "");

    onSave({
      id: initial?.id,
      nama,
      deskripsi,
      penjelasanHasil,
      status,
      coverUrl: coverUrl || undefined,
      likert: cleanedLikert,
      kategori: cleanedKategori,
      pertanyaan: cleanedPertanyaan,
      sectionKategori,
    });
  };

  // CRUD Pertanyaan
  const tambahPertanyaan = () => {
    setPertanyaan((prev) => [
      ...prev,
      { id: Date.now().toString(), teks: "", arah: "positif", section: "" },
    ]);
  };

  const ubahPertanyaan = (id: string, field: keyof PertanyaanItem, value: string) => {
    setPertanyaan((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, [field]: field === "arah" ? (value as "positif" | "negatif") : value }
          : p,
      ),
    );
  };

  const hapusPertanyaan = (id: string) => {
    setPertanyaan((prev) => prev.filter((p) => p.id !== id));
  };

  // CRUD Likert
  const tambahLikert = () => {
    setLikert((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: "",
        value: ((prev[prev.length - 1]?.value ?? 0) + 1) as LikertValue,
      },
    ]);
  };

  const ubahLikert = (id: string, field: "label" | "value", value: string) => {
    setLikert((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, [field]: field === "value" ? (Number(value) || 0) as LikertValue : value }
          : l,
      ),
    );
  };

  const hapusLikert = (id: string) => {
    setLikert((prev) => prev.filter((l) => l.id !== id));
  };

  // CRUD Kategori global
  const ubahKategori = (id: string, field: keyof DiagnosisKategori, value: string) => {
    setKategori((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              [field]: field === "minPersen" || field === "maxPersen"
                ? Number(value) || 0
                : value,
            }
          : k,
      ),
    );
  };

  const tambahKategori = () => {
    setKategori((prev) => [
      ...prev,
      { id: Date.now().toString(), nama: `Kategori ${prev.length + 1}`, minPersen: 0, maxPersen: 100, deskripsi: "" },
    ]);
  };

  const hapusKategori = (id: string) => {
    setKategori((prev) => prev.filter((k) => k.id !== id));
  };

  // CRUD Kategori per section
  const tambahSectionKategori = (sectionName: string) => {
    const key = sectionName.trim();
    if (!key) return;
    setSectionKategori((prev) => {
      const existing = prev[key] ?? [];
      const now: SectionKategori = {
        id: Date.now().toString(),
        nama: `Level ${existing.length + 1}`,
        minSkor: 0,
        maxSkor: 0,
        deskripsi: "",
      };
      return { ...prev, [key]: [...existing, now] };
    });
  };

  const ubahSectionKategori = (sectionName: string, id: string, field: keyof SectionKategori, value: string) => {
    setSectionKategori((prev) => {
      const list = prev[sectionName] ?? [];
      const updated = list.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "minSkor" || field === "maxSkor" ? Number(value) || 0 : value }
          : item,
      );
      return { ...prev, [sectionName]: updated };
    });
  };

  const hapusSectionKategoriItem = (sectionName: string, id: string) => {
    setSectionKategori((prev) => {
      const list = prev[sectionName] ?? [];
      const updated = list.filter((item) => item.id !== id);
      const next = { ...prev };
      if (updated.length === 0) {
        delete next[sectionName];
      } else {
        next[sectionName] = updated;
      }
      return next;
    });
  };

  const isAktif = status === "Aktif";

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4 rounded-2xl bg-[#f5f7fb] p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#004593]">
            Manajemen Tes
          </p>
          <h2 className="text-lg font-semibold text-[#1f3b5b]">
            {initial ? "Edit Tes" : "Buat Tes Baru"}
          </h2>
        </div>
      </div>

      {/* Alert form error */}
      {formError && (
        <Alert variant="destructive">
          <AlertTitle>Form tidak valid</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}

      {/* Nama & Deskripsi */}
      <div className="grid gap-3 rounded-xl bg-white p-4 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Nama Tes<span className="text-red-500"> *</span>
          </label>
          <input
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Mis. DASS-42"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Deskripsi<span className="text-red-500"> *</span>
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Pengertian singkat tes, mis. tes depresi, kecemasan, dan stres."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-gray-700">
            Deskripsi Update<span className="text-red-500"> *</span>
          </label>
          <textarea
            value={penjelasanHasil}
            onChange={(e) => setPenjelasanHasil(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Notes Update Tes."
          />
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-800">Cover Tes</p>
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="h-24 w-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>

          {/* Upload */}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadGambar}
                disabled={uploading}
              />
              {uploading ? "Mengupload..." : "Pilih Gambar"}
            </label>

            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl("")}
                className="text-xs text-red-500 hover:underline text-left"
              >
                Hapus gambar
              </button>
            )}

            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}

            <p className="text-[11px] text-gray-400">
              Format: JPG, PNG, WEBP. Maks 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Pertanyaan */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Pertanyaan</p>
          <button
            type="button"
            onClick={tambahPertanyaan}
            className="flex h-7 items-center rounded-full border border-gray-300 px-3 text-[11px] text-gray-700 hover:bg-gray-50"
          >
            + Pertanyaan
          </button>
        </div>
        <div className="space-y-3">
          {pertanyaan.map((p, idx) => (
            <div key={p.id} className="rounded-xl border border-gray-200 bg-[#fafbff] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800">Pertanyaan {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => hapusPertanyaan(p.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <textarea
                value={p.teks}
                onChange={(e) => ubahPertanyaan(p.id, "teks", e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-gray-800"
                placeholder="Teks pertanyaan"
              />
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Arah skor</span>
                  <select
                    value={p.arah}
                    onChange={(e) => ubahPertanyaan(p.id, "arah", e.target.value)}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-800"
                  >
                    <option value="positif">Positif</option>
                    <option value="negatif">Negatif</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Section</span>
                  <input
                    value={p.section ?? ""}
                    onChange={(e) => ubahPertanyaan(p.id, "section", e.target.value)}
                    className="w-32 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-800"
                    placeholder="Mis. Depresi"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skala Likert */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Skala Likert</p>
          <button
            type="button"
            onClick={tambahLikert}
            className="flex h-7 items-center rounded-full border border-gray-300 px-3 text-[11px] text-gray-700 hover:bg-gray-50"
          >
            + Skala
          </button>
        </div>
        <div className="space-y-2">
          {likert.map((l, idx) => (
            <div key={l.id} className="rounded-xl border border-gray-200 bg-[#fafbff] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-800">Skala {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => hapusLikert(l.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr),80px] items-center gap-3">
                <input
                  value={l.label}
                  onChange={(e) => ubahLikert(l.id, "label", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-800"
                  placeholder={`Label ${idx + 1} (mis. Sangat Setuju)`}
                />
                <input
                  type="number"
                  value={l.value}
                  onChange={(e) => ubahLikert(l.id, "value", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-800 text-center"
                  min={0}
                  max={10}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kategori Diagnosis (global) */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Kategori Diagnosis (global)</p>
          <button
            type="button"
            onClick={tambahKategori}
            className="flex h-7 items-center rounded-full border border-gray-300 px-3 text-[11px] text-gray-700 hover:bg-gray-50"
          >
            + Kategori
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {kategori.map((k) => (
            <div key={k.id} className="space-y-2 rounded-xl border border-gray-200 bg-[#f5f7fb] p-3">
              <div className="flex items-center justify-between gap-2">
                <input
                  value={k.nama}
                  onChange={(e) => ubahKategori(k.id, "nama", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                  placeholder="Nama kategori"
                />
                <button
                  type="button"
                  onClick={() => hapusKategori(k.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-800">
                <span>Min %</span>
                <input
                  type="number" min={0} max={100} value={k.minPersen}
                  onChange={(e) => ubahKategori(k.id, "minPersen", e.target.value)}
                  className="w-16 rounded-md border border-gray-300 px-2 py-1"
                />
                <span>Max %</span>
                <input
                  type="number" min={0} max={100} value={k.maxPersen}
                  onChange={(e) => ubahKategori(k.id, "maxPersen", e.target.value)}
                  className="w-16 rounded-md border border-gray-300 px-2 py-1"
                />
              </div>
              <textarea
                rows={2} value={k.deskripsi ?? ""}
                onChange={(e) => ubahKategori(k.id, "deskripsi", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                placeholder="Rujukan / deskripsi kategori ini"
              />
              <textarea
                rows={3} value={k.result ?? ""}
                onChange={(e) => ubahKategori(k.id, "result", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                placeholder="Deskripsi Hasil untuk kategori ini"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Kategori per Dimensi (opsional) */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-800">Kategori per Dimensi (opsional)</p>
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-700">Tambah kategori untuk section:</span>
          <input
            type="text"
            placeholder="Mis. Depresi"
            className="w-40 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-800"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                if (value) {
                  tambahSectionKategori(value);
                  (e.target as HTMLInputElement).value = "";
                }
              }
            }}
          />
          <span className="text-[11px] text-gray-500">
            Tekan Enter untuk menambah dimensi (Depresi, Cemas, Stres, dll).
          </span>
        </div>
        {Object.keys(sectionKategori).length === 0 ? (
          <p className="text-[11px] text-gray-500">
            Belum ada kategori per dimensi. Bagian ini bisa dikosongkan jika tidak diperlukan.
          </p>
        ) : (
          <div className="mt-2 space-y-4">
            {Object.entries(sectionKategori).map(([sectionName, list]) => (
              <div key={sectionName} className="rounded-xl border border-gray-200 bg-[#f5f7fb] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-800">Dimensi: {sectionName}</span>
                </div>
                {list.length === 0 ? (
                  <p className="text-[11px] text-gray-500">Belum ada kategori untuk dimensi ini.</p>
                ) : (
                  <div className="space-y-2">
                    {list.map((k) => (
                      <div key={k.id} className="grid grid-cols-[minmax(0,1.3fr),70px,70px,minmax(0,1.7fr),32px] items-start gap-2 rounded-lg border border-gray-200 bg-white p-2">
                        <input
                          value={k.nama}
                          onChange={(e) => ubahSectionKategori(sectionName, k.id, "nama", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                          placeholder="Nama level (mis. Normal)"
                        />
                        <input
                          type="number" value={k.minSkor}
                          onChange={(e) => ubahSectionKategori(sectionName, k.id, "minSkor", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                          placeholder="Min"
                        />
                        <input
                          type="number" value={k.maxSkor}
                          onChange={(e) => ubahSectionKategori(sectionName, k.id, "maxSkor", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                          placeholder="Max"
                        />
                        <input
                          value={k.deskripsi ?? ""}
                          onChange={(e) => ubahSectionKategori(sectionName, k.id, "deskripsi", e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-800"
                          placeholder="Deskripsi singkat (opsional)"
                        />
                        <button
                          type="button"
                          onClick={() => hapusSectionKategoriItem(sectionName, k.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 flex items-center justify-end gap-3">
        <div className="mr-auto ml-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStatus(isAktif ? "Draft" : "Aktif")}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isAktif ? "bg-emerald-500" : "bg-yellow-400"}`}
            aria-pressed={isAktif}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isAktif ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className={`text-xs font-semibold ${isAktif ? "text-emerald-600" : "text-yellow-600"}`}>
            {isAktif ? "Aktif" : "Draft"}
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-full bg-[#1f3b5b] px-6 py-2 text-sm font-semibold text-white hover:bg-[#16314d]"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}