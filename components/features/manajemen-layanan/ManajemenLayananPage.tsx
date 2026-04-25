"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import LayananForm from "./LayananForm";
import LayananTable from "./LayananTable";
import type { LayananItem } from "./types";
import { getAllLayanan, createLayanan, updateLayanan, deleteLayanan } from "@/lib/api/layanan";

export default function ManajemenLayananPage() {
  const router = useRouter();

  const [items, setItems] = useState<LayananItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<LayananItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await getAllLayanan();
      setItems(data);
    } catch (err) {
      setErrorMsg("Gagal memuat data layanan. Pastikan backend sedang berjalan.");
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
    return items.filter((item) => item.nama.toLowerCase().includes(q));
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

  const handleSeeAll = () => { setPageSize(totalItems || 1); setCurrentPage(1); };
  const handlePageSizeChange = (size: number) => { setPageSize(size); setCurrentPage(1); };
  const handlePreview = (item: LayananItem) => router.push(`/admin/manajemen-layanan/preview/${item.id}`);
  const handleEdit = (item: LayananItem) => { setFormMode("edit"); setEditingItem(item); setShowForm(true); };
  const handleDelete = (item: LayananItem) => { setErrorMsg(null); setDeleteId(item.id); };
  const handleTambah = () => { setFormMode("create"); setEditingItem(null); setShowForm(true); };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteLayanan(String(deleteId));
      await fetchData();
    } catch (err) {
      setErrorMsg("Gagal menghapus layanan.");
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const handleSubmitLocal = async (layanan: LayananItem) => {
    try {
      setErrorMsg(null);
      if (formMode === "create") {
        await createLayanan(layanan);
      } else {
        await updateLayanan(String(layanan.id), layanan);
      }
      await fetchData();
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      setErrorMsg("Gagal menyimpan layanan. Silakan coba lagi.");
      console.error(err);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus layanan?"
        description="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 py-10">
          <div className="w-full max-w-3xl px-4">
            <LayananForm
              mode={formMode}
              initialData={editingItem}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              onSubmitLocal={handleSubmitLocal}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-white to-[#E8F6FF]/30 px-6 py-6 font-[var(--font-poppins)]">
        <div className="mx-auto max-w-7xl space-y-6">
          {errorMsg && (
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-[28px] font-bold text-secondary-heading mb-2">Manajemen Layanan</h1>
            <p className="text-sm text-body-text mt-1">Kelola dan pantau semua layanan konsultasi Anda</p>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-secondary-heading/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-xs font-semibold text-body-text uppercase tracking-wider mb-2">Total Layanan</p>
                <p className="text-2xl md:text-[28px] font-bold text-secondary-heading">{items.length}</p>
              </div>
              <div className="h-14 w-14 bg-secondary-heading rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
            </div>
            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-emerald-500/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-xs font-semibold text-body-text uppercase tracking-wider mb-2">Layanan Aktif</p>
                <p className="text-2xl md:text-[28px] font-bold text-emerald-600">{items.filter(i => i.status === "Aktif").length}</p>
              </div>
              <div className="h-14 w-14 bg-emerald-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-gray-300/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-xs font-semibold text-body-text uppercase tracking-wider mb-2">Draft</p>
                <p className="text-2xl md:text-[28px] font-bold text-gray-600">{items.filter(i => i.status === "Draft" || !i.status).length}</p>
              </div>
              <div className="h-14 w-14 bg-gray-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-6 shadow-md border border-secondary-heading/10 animate-fade-in-up animation-delay-400">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-secondary-heading">Daftar Layanan</h2>
                <p className="text-sm text-body-text mt-1">Kelola semua layanan konsultasi Anda di sini</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full max-w-xs group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-body-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text" value={search}
                    onChange={(e) => { setCurrentPage(1); setSearch(e.target.value); }}
                    placeholder="Cari layanan..."
                    className="w-full pl-12 pr-4 py-3 bg-[#E8F6FF]/50 border border-secondary-heading/20 rounded-xl text-sm text-secondary-heading placeholder:text-body-text/60 focus:outline-none focus:ring-2 focus:ring-secondary-heading/30 focus:border-secondary-heading focus:bg-[#E8F6FF] transition-all"
                  />
                </div>
                <button
                  onClick={handleTambah}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Layanan
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-heading"></div>
                <span className="ml-3 text-body-text">Memuat data...</span>
              </div>
            ) : (
              <LayananTable
                data={pagedItems}
                pageSize={pageSize}
                totalItems={totalItems}
                currentPage={currentPage}
                onPreview={handlePreview}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSeeAll={handleSeeAll}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}