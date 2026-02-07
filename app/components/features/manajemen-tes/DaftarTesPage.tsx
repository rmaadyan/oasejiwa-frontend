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

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageSize, currentPage]);

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

      <div className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Manajemen Tes
              </h1>
              <p className="text-sm text-slate-600">
                Kelola daftar tes, lakukan edit, preview, atau hapus.
              </p>
            </div>
            <button
              onClick={() => router.push("/manajemen-tes/tambah")}
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Tambah Tes
            </button>
          </div>

          {errorMsg && (
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {/* Tabel + pagination */}
          <TesTable
            data={pagedItems}
            pageSize={pageSize}
            totalItems={items.length}
            currentPage={currentPage}
            onPreview={handlePreview}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSeeAll={handleSeeAll}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </>
  );
}
