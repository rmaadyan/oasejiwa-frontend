"use client";

import { ChevronDown, ChevronUp, Eye, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { LayananItem } from "./types";
import { getImageUrl } from "@/lib/utils/getImageUrl";

type Props = {
  data: LayananItem[];
  pageSize: number;
  totalItems: number;
  currentPage: number;
  onPreview: (item: LayananItem) => void;
  onEdit: (item: LayananItem) => void;
  onDelete: (item: LayananItem) => void;
  onSeeAll: () => void;
  onPageSizeChange: (pageSize: number) => void;
  // 🟢 PROPS BARU UNTUK MODE URUTAN MANUAL
  manualMode?: boolean;
  onReorder?: (newOrder: LayananItem[]) => void;
};

// jenis dihapus dari sort
type SortKey = "nama" | "status" | "harga";
type SortDir = "asc" | "desc";

export default function LayananTable({
  data,
  pageSize,
  totalItems,
  currentPage,
  onPreview,
  onEdit,
  onDelete,
  onSeeAll,
  onPageSizeChange,
  manualMode = false,
  onReorder,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const handleSort = (key: SortKey) => {
    if (manualMode) return; // 🟢 nonaktifkan sort kolom saat mode urutan manual
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevKey;
      }
      setSortDir("asc");
      return key;
    });
  };

  const sortedData = useMemo(() => {
    if (manualMode) return data; // 🟢 tampilkan sesuai urutan asli (bisa di-drag)

    const list = [...data];

    list.sort((a, b) => {
      let va: string | number;
      let vb: string | number;

      if (sortKey === "nama") {
        va = a.nama.toLowerCase();
        vb = b.nama.toLowerCase();
      } else if (sortKey === "status") {
        va = (a.status || "").toLowerCase();
        vb = (b.status || "").toLowerCase();
      } else {
        va = a.harga;
        vb = b.harga;
      }

      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, sortKey, sortDir, manualMode]);

  const renderSortIcon = (key: SortKey) => {
    if (manualMode) return null;
    if (sortKey !== key) {
      return <span className="ml-1 text-[10px] text-gray-300">↕</span>;
    }
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="ml-1 text-gray-500" />
    ) : (
      <ChevronDown size={12} className="ml-1 text-gray-500" />
    );
  };

  // 🟢 DRAG & DROP HANDLERS
  const handleDragStart = (index: number) => {
    if (!manualMode) return;
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!manualMode || dragIndex === null) return;
    e.preventDefault();
    if (index !== overIndex) setOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (!manualMode || dragIndex === null || !onReorder) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    if (dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...sortedData];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const gridCols = manualMode
    ? "grid-cols-[40px_50px_2fr_1fr_1fr_100px]"
    : "grid-cols-[50px_2fr_1fr_1fr_100px]";

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
<<<<<<< Updated upstream
      {/* Header: 5 kolom (No + 3 field + Aksi) */}
      <div className="grid grid-cols-[50px_2fr_1fr_1fr_100px] px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-400 border-b border-dashed border-gray-200">
        <div>No</div>

        <button
          type="button"
          className="flex items-center text-left cursor-pointer"
          onClick={() => handleSort("nama")}
        >
          <span>Layanan</span>
          {renderSortIcon("nama")}
        </button>

        <button
          type="button"
          className="flex items-center text-left cursor-pointer"
          onClick={() => handleSort("harga")}
        >
          <span>Investasi</span>
          {renderSortIcon("harga")}
        </button>

        <button
          type="button"
          className="flex items-center text-left cursor-pointer"
          onClick={() => handleSort("status")}
        >
          <span>Status</span>
          {renderSortIcon("status")}
        </button>

        <div className="text-right">Aksi</div>
      </div>

      {/* Isi tabel */}
      <div className="space-y-3 mt-3">
        {sortedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Belum ada layanan</p>
            <p className="text-sm text-gray-400 mt-1">Silakan tambahkan layanan baru</p>
          </div>
        ) : (
          sortedData.map((item, index) => {
            // Ambil path gambar dari berbagai kemungkinan properti backend
            const rawImagePath =
              item.coverUrl ||
              (item as any).imageUrl ||
              (item as any).image ||
              (item as any).iconUrl;

            // Olah URL gambar menggunakan helper getImageUrl
            const formattedImageSrc = getImageUrl(rawImagePath);

            return (
              <div
                key={item.id}
                className="group grid grid-cols-[50px_2fr_1fr_1fr_100px] items-center rounded-2xl border border-gray-100 bg-white px-6 py-4 transition-all duration-300 hover:shadow-lg hover:border-soft-bg hover:-translate-y-0.5"
              >
                <div className="text-sm font-medium text-gray-400 group-hover:text-primary">
                  {startIndex + index}
                </div>

                <div className="flex items-center gap-4 pr-4">
                  {/* Image / Icon Placeholder */}
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all flex items-center justify-center">
                    {rawImagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formattedImageSrc}
                        alt={item.nama}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Jika file fisik gambar di backend terhapus / gagal dimuat
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.parentElement) {
                            e.currentTarget.parentElement.innerHTML = `
                              <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 font-bold text-[10px]">
                                OJ
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                        <span className="text-[10px] font-bold">OJ</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {item.nama}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="truncate max-w-[200px]">{item.jenis}</span>
                      {item.kategori && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide border border-gray-100">
                            {item.kategori}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm font-semibold text-primary">
                  Rp {(item.harga || 0).toLocaleString("id-ID")}
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide border ${
                      item.status === "Aktif"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        item.status === "Aktif" ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {item.status || "Draft"}
                  </span>
                </div>

                <div className="flex justify-end gap-2 text-gray-400 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors cursor-pointer"
                    aria-label="Edit"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
                    aria-label="View"
                    onClick={() => onPreview(item)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label="Delete"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {startIndex} to {endIndex} of {totalItems} Results
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-1 text-sm cursor-pointer disabled:opacity-50"
            type="button"
            onClick={onSeeAll}
            disabled={totalItems === 0}
          >
            See all
          </button>
          <select
            className="rounded-md border px-3 py-1 text-sm cursor-pointer"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) || 5)}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
=======
      {/* 🟢 PEMBUNGKUS SCROLL HORIZONTAL UNTUK TAMPILAN HP */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[650px]">
          {/* Header Tabel */}
          <div className={`grid ${gridCols} px-6 py-4 text-xs uppercase tracking-wider font-semibold text-gray-400 border-b border-dashed border-gray-200`}>
            {manualMode && <div />}
            <div>No</div>

            <button
              type="button"
              className={`flex items-center text-left ${manualMode ? "cursor-default opacity-50" : "cursor-pointer"}`}
              onClick={() => handleSort("nama")}
            >
              <span>Layanan</span>
              {renderSortIcon("nama")}
            </button>

            <button
              type="button"
              className={`flex items-center text-left ${manualMode ? "cursor-default opacity-50" : "cursor-pointer"}`}
              onClick={() => handleSort("harga")}
            >
              <span>Investasi</span>
              {renderSortIcon("harga")}
            </button>

            <button
              type="button"
              className={`flex items-center text-left ${manualMode ? "cursor-default opacity-50" : "cursor-pointer"}`}
              onClick={() => handleSort("status")}
            >
              <span>Status</span>
              {renderSortIcon("status")}
            </button>

            <div className="text-right">Aksi</div>
          </div>

          {/* Isi Tabel */}
          <div className="space-y-3 mt-3">
            {sortedData.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada layanan</p>
                <p className="text-sm text-gray-400 mt-1">
                  Silakan tambahkan layanan baru
                </p>
              </div>
            ) : (
              sortedData.map((item, index) => {
                const rawImagePath =
                  item.coverUrl ||
                  (item as any).imageUrl ||
                  (item as any).image ||
                  (item as any).iconUrl;

                const formattedImageSrc = getImageUrl(rawImagePath);
                const isDragging = manualMode && dragIndex === index;
                const isOver = manualMode && overIndex === index && dragIndex !== index;

                return (
                  <div
                    key={item.id}
                    draggable={manualMode}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={handleDragEnd}
                    className={`group grid ${gridCols} items-center rounded-2xl border bg-white px-6 py-4 transition-all duration-200 ${
                      manualMode
                        ? "border-gray-100 hover:border-primary/40"
                        : "border-gray-100 hover:shadow-lg hover:border-soft-bg hover:-translate-y-0.5"
                    } ${isDragging ? "opacity-40" : ""} ${
                      isOver ? "ring-2 ring-primary/50 border-primary/50" : ""
                    }`}
                  >
                    {manualMode && (
                      <div
                        className="flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing"
                        title="Tahan lalu geser untuk mengubah urutan"
                      >
                        <GripVertical size={18} />
                      </div>
                    )}

                    <div className="text-sm font-medium text-gray-400 group-hover:text-primary">
                      {startIndex + index}
                    </div>

                    <div className="flex items-center gap-4 pr-4">
                      {/* Image / Icon Placeholder */}
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-100 group-hover:ring-primary/20 transition-all flex items-center justify-center">
                        {rawImagePath ? (
                          <img
                            src={formattedImageSrc}
                            alt={item.nama}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                              if (e.currentTarget.parentElement) {
                                e.currentTarget.parentElement.innerHTML = `
                                  <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 font-bold text-[10px]">
                                    OJ
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
                            <span className="text-[10px] font-bold">OJ</span>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-base font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {item.nama}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-500">
                          <span className="truncate max-w-[200px]">
                            {item.jenis}
                          </span>
                          {item.kategori && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide border border-gray-100">
                                {item.kategori}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-primary">
                      Rp {(item.harga || 0).toLocaleString("id-ID")}
                    </div>

                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide border ${
                          item.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === "Aktif"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {item.status || "Draft"}
                      </span>
                    </div>

                    <div className="flex justify-end gap-2 text-gray-400 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Edit"
                        onClick={() => onEdit(item)}
                        disabled={manualMode}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="View"
                        onClick={() => onPreview(item)}
                        disabled={manualMode}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Delete"
                        onClick={() => onDelete(item)}
                        disabled={manualMode}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Footer Pagination — disembunyikan saat mode urutan manual aktif */}
      {!manualMode && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
          <span>
            Showing {startIndex} to {endIndex} of {totalItems} Results
          </span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border px-3 py-1 text-sm cursor-pointer disabled:opacity-50 hover:bg-slate-50"
              type="button"
              onClick={onSeeAll}
              disabled={totalItems === 0}
            >
              See all
            </button>
            <select
              className="rounded-md border px-3 py-1 text-sm cursor-pointer"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value) || 5)}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
>>>>>>> Stashed changes
        </div>
      )}
    </div>
  );
}
