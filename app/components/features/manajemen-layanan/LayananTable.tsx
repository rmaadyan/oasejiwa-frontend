// components/features/manajemen-layanan/LayananTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Pencil, Eye, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { LayananItem } from "./types";

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
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("nama");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

  const handleSort = (key: SortKey) => {
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
    const list = [...data];

    list.sort((a, b) => {
      let va: string | number;
      let vb: string | number;

      if (sortKey === "nama") {
        va = a.nama.toLowerCase();
        vb = b.nama.toLowerCase();
      } else if (sortKey === "status") {
        va = a.status.toLowerCase();
        vb = b.status.toLowerCase();
      } else {
        va = a.harga;
        vb = b.harga;
      }

      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, sortKey, sortDir]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <span className="ml-1 text-[10px] text-gray-300">↕</span>;
    }
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="ml-1 text-gray-500" />
    ) : (
      <ChevronDown size={12} className="ml-1 text-gray-500" />
    );
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      {/* Header: 5 kolom (No + 3 field + Aksi) */}
      <div className="grid grid-cols-5 px-6 py-3 text-sm font-medium text-gray-500">
        <div>No</div>

        <button
          type="button"
          className="flex items-center text-left"
          onClick={() => handleSort("nama")}
        >
          <span>Nama Layanan</span>
          {renderSortIcon("nama")}
        </button>

        <button
          type="button"
          className="flex items-center text-left"
          onClick={() => handleSort("harga")}
        >
          <span>Harga (Rp)</span>
          {renderSortIcon("harga")}
        </button>

        <button
          type="button"
          className="flex items-center text-left"
          onClick={() => handleSort("status")}
        >
          <span>Status</span>
          {renderSortIcon("status")}
        </button>

        <div className="text-right">Aksi</div>
      </div>

      {/* Isi tabel: 5 kolom */}
      <div className="space-y-3">
        {sortedData.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            Data tidak ditemukan
          </div>
        ) : (
          sortedData.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-5 items-center rounded-xl border bg-white px-6 py-4 shadow-sm"
            >
              <div className="text-sm text-gray-400">
                {startIndex + index}
              </div>

              <div className="text-sm font-medium text-gray-700">
                {item.nama}
              </div>

              <div className="text-sm text-gray-700">
                {item.harga.toLocaleString("id-ID")}
              </div>

              <div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === "Aktif"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="flex justify-end gap-3 text-gray-500">
                <button
                  className="hover:text-blue-600"
                  aria-label="Edit"
                  onClick={() => onEdit(item)}
                >
                  <Pencil size={18} />
                </button>
                <button
                  className="hover:text-gray-800"
                  aria-label="View"
                  onClick={() => onPreview(item)}
                >
                  <Eye size={18} />
                </button>
                <button
                  className="hover:text-red-600"
                  aria-label="Delete"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>
          Showing {startIndex} to {endIndex} of {totalItems} Results
        </span>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border px-3 py-1 text-sm"
            type="button"
            onClick={onSeeAll}
            disabled={totalItems === 0}
          >
            See all
          </button>
          <select
            className="rounded-md border px-3 py-1 text-sm"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value) || 5)}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
