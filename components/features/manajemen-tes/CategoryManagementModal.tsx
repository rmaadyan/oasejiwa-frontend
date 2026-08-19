"use client";

import { useEffect, useState } from "react";
import {
  getTesCategories,
  getAllTesCategories,
  createTesCategory,
  updateTesCategory,
  deleteTesCategory,
} from "@/lib/api/tes";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";

export interface CategoryItem {
  id: number;
  nama: string;
  deskripsi?: string | null;
  status: string;
  urutan: number;
}

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export default function CategoryManagementModal({
  isOpen,
  onClose,
  onUpdated,
}: CategoryManagementModalProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [editId, setEditId] = useState<number | null>(null);
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [urutan, setUrutan] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTesCategories();
      setCategories(data || []);
    } catch (err: any) {
      console.error("Gagal memuat kategori:", err);
      setError("Gagal memuat daftar kategori tes.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNama("");
    setDeskripsi("");
    setStatus("Aktif");
    setUrutan(categories.length + 1);
  };

  const handleEdit = (cat: CategoryItem) => {
    setEditId(cat.id);
    setNama(cat.nama);
    setDeskripsi(cat.deskripsi || "");
    setStatus(cat.status || "Aktif");
    setUrutan(cat.urutan || 1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      await deleteTesCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (onUpdated) onUpdated();
    } catch (err: any) {
      alert("Gagal menghapus kategori: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editId) {
        await updateTesCategory(editId, { nama, deskripsi, status, urutan: Number(urutan) });
      } else {
        await createTesCategory({ nama, deskripsi, status, urutan: Number(urutan) });
      }
      resetForm();
      await fetchCategories();
      if (onUpdated) onUpdated();
    } catch (err: any) {
      console.error("Gagal menyimpan kategori:", err);
      setError("Gagal menyimpan kategori: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 font-[var(--font-poppins)]">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#234463]">Manajemen Kategori Tes</h2>
            <p className="text-xs text-slate-500">
              Kelola kategori/section yang tampil pada halaman Tes Psikologi User
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <Alert variant="warning">
            <AlertTitle>Perhatian</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Tambah/Edit Kategori */}
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <h3 className="text-sm font-semibold text-[#234463]">
            {editId ? "Edit Kategori" : "Tambah Kategori Baru"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Kategori <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Kecemasan, Depresi, Tes IQ"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234463]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urutan Tampil
              </label>
              <input
                type="number"
                value={urutan}
                onChange={(e) => setUrutan(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234463]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Kategori
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={2}
              placeholder="Deskripsi singkat mengenai jenis/kategori tes ini"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#234463]"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-700">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition"
                >
                  Batal Edit
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-semibold bg-[#234463] text-white hover:bg-[#1c3650] rounded-lg transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : editId ? "Update Kategori" : "Tambah Kategori"}
              </button>
            </div>
          </div>
        </form>

        {/* Tabel Kategori */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Daftar Kategori Tes</h3>
          {loading ? (
            <p className="text-xs text-slate-500 py-4 text-center">Memuat kategori...</p>
          ) : categories.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">Belum ada kategori tes.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <tr>
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3">Nama Kategori</th>
                    <th className="p-3">Deskripsi</th>
                    <th className="p-3 w-20 text-center">Urutan</th>
                    <th className="p-3 w-24 text-center">Status</th>
                    <th className="p-3 w-28 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat, idx) => (
                    <tr key={cat.id} className="hover:bg-slate-50">
                      <td className="p-3 text-center text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-semibold text-[#234463]">{cat.nama}</td>
                      <td className="p-3 text-slate-600">{cat.deskripsi || "-"}</td>
                      <td className="p-3 text-center text-slate-600">{cat.urutan}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cat.status === "Aktif"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
