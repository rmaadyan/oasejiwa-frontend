"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ArrowUpDown, Check, X, ArrowUp, ArrowDown, User, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  getAllPsychologistsAdmin,
  updatePsychologistsOrder,
  deletePsychologist,
} from "@/lib/api/psychologist";
import { getImageUrl } from "@/lib/utils/getImageUrl";

export interface PsikologAdminItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  sipp?: string;
  str?: string;
  avatarUrl?: string | null;
  status?: string;
  displayOrder?: number;
  specializations?: string[];
}

export default function ManajemenPsikologPage() {
  const router = useRouter();

  const [items, setItems] = useState<PsikologAdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // 🟢 STATE MODE URUTAN MANUAL (Sama persis seperti Manajemen Layanan)
  const [manualMode, setManualMode] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<PsikologAdminItem[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await getAllPsychologistsAdmin();
      const rawData = res?.data || [];
      // Urutkan berdasarkan displayOrder
      const sorted = [...rawData].sort(
        (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      );
      setItems(sorted);
    } catch (err) {
      setErrorMsg("Gagal memuat data psikolog. Pastikan backend sedang berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.sipp && item.sipp.toLowerCase().includes(q))
    );
  }, [items, search]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pageSize, currentPage]);

  // 🟢 AKTIFKAN / BATALKAN MODE URUTAN MANUAL
  const handleToggleManualMode = () => {
    if (!manualMode) {
      setSearch("");
      setCurrentPage(1);
      setOriginalOrder([...items]); // Simpan urutan awal untuk fallback Batal
      setOrderChanged(false);
      setManualMode(true);
    } else {
      // Batal: kembalikan ke urutan awal tanpa fetch ulang
      setItems(originalOrder);
      setOrderChanged(false);
      setManualMode(false);
    }
  };

  // 🟢 GESER URUTAN (NAIK / TURUN)
  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Tetapkan ulang urutan
    const withUrutan = newItems.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    setItems(withUrutan);
    setOrderChanged(true);
  };

  // 🟢 SIMPAN URUTAN KE SERVER & UPDATE INSTAN
  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      setErrorMsg(null);
      const orderedIds = items.map((p) => p.id);
      
      await updatePsychologistsOrder(orderedIds);
      
      setOrderChanged(false);
      setManualMode(false);
      await fetchData(); // Langsung perbarui data lokal
    } catch (err) {
      setErrorMsg("Gagal menyimpan urutan psikolog. Silakan coba lagi.");
      console.error(err);
    } finally {
      setSavingOrder(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePsychologist(deleteId);
      await fetchData();
    } catch (err) {
      setErrorMsg("Gagal menghapus data psikolog.");
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus Psikolog?"
        description="Apakah Anda yakin ingin menghapus psikolog ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-[#E8F6FF]/30 px-6 py-6 font-poppins">
        <div className="mx-auto max-w-7xl space-y-6">
          {errorMsg && (
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <div>
            <h1 className="text-2xl md:text-[28px] font-bold text-[#1E293B] mb-1">
              Manajemen Psikolog
            </h1>
            <p className="text-sm text-slate-500">
              Kelola data psikolog, status aktif, dan urutan tampil di halaman publik
            </p>
          </div>

          {/* KARTU DAFTAR & AKSI */}
          <div className="bg-white rounded-[22px] p-6 shadow-md border border-slate-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1E3A5F]">
                  Daftar Psikolog
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {manualMode
                    ? "Gunakan tombol panah untuk memindahkan urutan tampil psikolog di website publik."
                    : "Kelola profil dan jadwal psikolog terdaftar."}
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                {!manualMode && (
                  <div className="relative w-full max-w-xs">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setCurrentPage(1);
                        setSearch(e.target.value);
                      }}
                      placeholder="Cari nama atau SIPP..."
                      className="w-full px-4 py-2.5 bg-[#E8F6FF]/50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}

                {/* 🟢 TOMBOL ATUR URUTAN & SIMPAN */}
                {manualMode ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleManualMode}
                      disabled={savingOrder}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <X size={15} />
                      <span>Batal</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveOrder}
                      disabled={!orderChanged || savingOrder}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      <Check size={15} />
                      <span>{savingOrder ? "Menyimpan..." : "Simpan Urutan"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleManualMode}
                    disabled={items.length < 2}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#234463]/30 text-xs font-semibold text-[#234463] hover:bg-blue-50 transition disabled:opacity-40 cursor-pointer"
                  >
                    <ArrowUpDown size={15} />
                    <span>Atur Urutan</span>
                  </button>
                )}
              </div>
            </div>

            {/* TABEL DATA */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#234463]"></div>
                <span className="ml-3 text-xs text-slate-500 font-medium">Memuat data...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-slate-200 text-[#1E3A5F] font-bold">
                    <tr>
                      <th className="p-3.5 w-14 text-center">No</th>
                      <th className="p-3.5">Foto</th>
                      <th className="p-3.5">Nama Psikolog</th>
                      <th className="p-3.5">No. SIPP</th>
                      <th className="p-3.5">No. STR</th>
                      <th className="p-3.5">Status</th>
                      {manualMode ? (
                        <th className="p-3.5 text-center w-28">Pindah Urutan</th>
                      ) : (
                        <th className="p-3.5 text-center w-20">Aksi</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(manualMode ? items : pagedItems).map((p, idx) => (
                      <tr key={p.id} className="hover:bg-blue-50/40 transition">
                        <td className="p-3.5 text-center font-semibold text-slate-500">
                          {manualMode ? idx + 1 : (currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="p-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                            {p.avatarUrl ? (
                              <img
                                src={getImageUrl(p.avatarUrl)}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={18} className="text-slate-400" />
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-[#1E3A5F]">{p.name}</td>
                        <td className="p-3.5 font-mono text-slate-600">{p.sipp || "-"}</td>
                        <td className="p-3.5 font-mono text-slate-600">{p.str || "-"}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-semibold text-[11px]">
                            {p.status || "Aktif"}
                          </span>
                        </td>

                        {manualMode ? (
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => moveItem(idx, "up")}
                                disabled={idx === 0}
                                className="p-1.5 bg-slate-100 hover:bg-blue-100 text-[#234463] rounded-lg disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveItem(idx, "down")}
                                disabled={idx === items.length - 1}
                                className="p-1.5 bg-slate-100 hover:bg-blue-100 text-[#234463] rounded-lg disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                          </td>
                        ) : (
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => setDeleteId(p.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}