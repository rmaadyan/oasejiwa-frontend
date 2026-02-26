// components/features/manajemen-tes/DaftarTesPage.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TesItem } from "./types";
import { INITIAL_DATA } from "./dataDummy";
import TesTable from "./TesTable";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STORAGE_KEY = "tes-list";
const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function DaftarTesPage() {
  const router = useRouter();
  const [items, setItems] = useState<TesItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: TesItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          return;
        }
      }
      setItems(INITIAL_DATA);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal memuat data tes dari penyimpanan lokal.");
      setItems(INITIAL_DATA);
    }
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      item.nama.toLowerCase().includes(q),
    );
  }, [items, search]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, pageSize, currentPage]);

  const handleSeeAll = () => {
    setPageSize(totalItems || 1);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePreview = (item: TesItem) => {
    router.push(`/manajemen-tes/preview/${item.id}`);
  };

  const handleEdit = (item: TesItem) => {
    router.push(`/manajemen-tes/edit/${item.id}`);
  };

  const handleDelete = (item: TesItem) => {
    setErrorMsg(null);
    setDeleteId(item.id);
  };

  const confirmDelete = () => {
    if (deleteId === null) return;
    const id = deleteId;

    setItems((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    setDeleteId(null);
  };

  return (
    <>
      {/* Modal konfirmasi delete */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus tes?"
        description="Apakah Anda yakin ingin menghapus tes ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-[#E8F6FF]/30 px-6 py-6 font-[var(--font-poppins)]">
        <div className="mx-auto max-w-7xl space-y-6">
          {errorMsg && (
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {/* Page Title */}
          <div className="animate-fade-in-up">
            <h1 className="text-[32px] md:text-[40px] font-semibold text-[#234463] mb-2">
              Manajemen Tes
            </h1>
            <p className="text-[16px] text-[#4B4B4B]">
              Kelola daftar tes, lakukan edit, preview, atau hapus.
            </p>
          </div>

          {/* Statistik Ringkas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-[#234463]/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-[12px] font-semibold text-[#4B4B4B] uppercase tracking-wider mb-2">Total Tes</p>
                <p className="text-[32px] font-bold text-[#234463]">{items.length}</p>
              </div>
              <div className="h-14 w-14 bg-[#234463] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>

            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-emerald-500/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-[12px] font-semibold text-[#4B4B4B] uppercase tracking-wider mb-2">Tes Aktif</p>
                <p className="text-[32px] font-bold text-emerald-600">{items.filter(i => i.status === 'Aktif').length}</p>
              </div>
              <div className="h-14 w-14 bg-emerald-600 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="bg-[#E8F6FF] p-6 rounded-[22px] shadow-md border border-gray-300/10 flex items-center justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
              <div>
                <p className="text-[12px] font-semibold text-[#4B4B4B] uppercase tracking-wider mb-2">Draft</p>
                <p className="text-[32px] font-bold text-gray-600">{items.filter(i => i.status === 'Draft' || !i.status).length}</p>
              </div>
              <div className="h-14 w-14 bg-gray-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-6 shadow-md border border-[#234463]/10 animate-fade-in-up animation-delay-400">
            {/* Header + search bar */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-[24px] md:text-[28px] font-semibold text-[#234463]">
                  Daftar Tes
                </h2>
                <p className="text-[14px] text-[#4B4B4B] mt-1">Kelola semua tes psikologi Anda di sini</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative w-full max-w-xs group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4B4B4B] group-focus-within:text-[#234463] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setCurrentPage(1);
                      setSearch(e.target.value);
                    }}
                    placeholder="Cari tes..."
                    className="w-full pl-12 pr-4 py-3 bg-[#E8F6FF]/50 border border-[#234463]/20 rounded-xl text-[14px] text-[#234463] placeholder:text-[#4B4B4B]/60 focus:outline-none focus:ring-2 focus:ring-[#234463]/30 focus:border-[#234463] focus:bg-[#E8F6FF] transition-all"
                  />
                </div>
                <button
                  onClick={() => router.push("/manajemen-tes/tambah")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#234463] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#2B5379] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Tes
                </button>
              </div>
            </div>

            {/* Tabel + pagination */}
            <TesTable
              data={pagedItems}
              pageSize={pageSize}
              totalItems={filteredItems.length}
              currentPage={currentPage}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSeeAll={handleSeeAll}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
