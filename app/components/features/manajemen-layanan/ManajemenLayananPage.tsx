// components/features/manajemen-layanan/ManajemenLayananPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { LayananItem } from "./types";
import { INITIAL_LAYANAN } from "./dataDummy";
import LayananForm from "./LayananForm";
import LayananTable from "./LayananTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const STORAGE_KEY = "layanan-list";

export default function ManajemenLayananPage() {
  const router = useRouter();

  const [items, setItems] = useState<LayananItem[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<LayananItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [search, setSearch] = useState("");

  // load awal dari localStorage atau INITIAL_LAYANAN
  useEffect(() => {
    try {
      if (typeof window === "undefined") {
        setItems(INITIAL_LAYANAN);
        return;
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: LayananItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
          return;
        }
      }
      setItems(INITIAL_LAYANAN);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "Gagal memuat data layanan dari penyimpanan lokal. Data dummy digunakan.",
      );
      setItems(INITIAL_LAYANAN);
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

  // PREVIEW: arahkan ke halaman preview/[id]
  const handlePreview = (item: LayananItem) => {
    router.push(`/manajemen-layanan/preview/${item.id}`);
  };

  const handleEdit = (item: LayananItem) => {
    setFormMode("edit");
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (item: LayananItem) => {
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

  const handleTambah = () => {
    setFormMode("create");
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSubmitLocal = (layanan: LayananItem) => {
    setItems((prev) => {
      const exist = prev.some((l) => l.id === layanan.id);
      let next: LayananItem[];
      if (exist) {
        next = prev.map((l) => (l.id === layanan.id ? layanan : l));
      } else {
        next = [...prev, layanan];
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <>
      {/* Modal konfirmasi delete */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Hapus layanan?"
        description="Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {/* Modal form tambah/edit */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-start justify-center bg-black/30 py-10">
          <div className="w-full max-w-3xl px-4">
            <LayananForm
              mode={formMode}
              initialData={editingItem}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
              onSubmitLocal={handleSubmitLocal}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#f5f7fb] px-6 py-6">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Header + search bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1f3b5b]">
                Manajemen Layanan
              </h1>
            </div>
            <div className="flex flex-col gap-1 md:flex-row md:items-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Cari layanan..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-9 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handleTambah}
                className="flex items-center gap-2 rounded-full bg-[#1f3b5b] px-5 py-2 text-sm font-medium text-white hover:bg-[#16314d]"
              >
                +Tambah
              </button>
            </div>
          </div>

          {errorMsg && (
            <Alert variant="warning">
              <AlertTitle>Perhatian</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

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
        </div>
      </div>
    </>
  );
}
