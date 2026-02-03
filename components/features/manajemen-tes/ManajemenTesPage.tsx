// components/features/manajemen-tes/ManajemenTesPage.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import TesTable from "./TesTable";
import { INITIAL_DATA } from "./dataDummy";
import type { TesItem } from "./types";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STORAGE_KEY = "tes-list";
const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function ManajemenTesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dataTes, setDataTes] = useState<TesItem[]>(INITIAL_DATA);

  const [pageSize, setPageSize] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // baca data dari localStorage saat pertama kali load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed: TesItem[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setDataTes(parsed);
      }
    } catch {
      // jika error parse, biarkan pakai INITIAL_DATA
    }
  }, []);

  // filter by search
  const filteredData = useMemo(
    () =>
      dataTes.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase()),
      ),
    [dataTes, search],
  );

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageSize, currentPage]);

  const handleSeeAll = () => {
    setPageSize(totalItems || 1);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    if (!PAGE_SIZE_OPTIONS.includes(size)) return;
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

    setDataTes((prev) => {
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

      <div className="min-h-screen bg-[#f5f7fb] px-10 py-8">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1f3b5b]">
            Manajemen Tes
          </h1>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari tes"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => router.push("/manajemen-tes/tambah")}
              className="flex items-center gap-2 rounded-full bg-[#1f3b5b] px-5 py-2 text-sm font-medium text-white hover:bg-blue-900"
            >
              + Tambah Tes
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4">
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* TABLE */}
        <TesTable
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
      </div>
    </>
  );
}
