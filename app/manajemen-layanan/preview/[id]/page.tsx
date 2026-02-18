"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { INITIAL_LAYANAN } from "@/components/features/manajemen-layanan/dataDummy";
import { ChevronLeft } from "lucide-react";

const STORAGE_KEY = "layanan-list";

export default function PreviewLayananPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [layanan, setLayanan] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let list: LayananItem[] = INITIAL_LAYANAN;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: LayananItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        // fallback INITIAL_LAYANAN
      }
    }

    const found = list.find((l) => l.id === id) ?? null;
    setLayanan(found);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat layanan...
        </div>
      </div>
    );
  }

  if (!layanan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-700 shadow">
          Layanan tidak ditemukan.
          <button
            onClick={() => router.push("/manajemen-layanan")}
            className="ml-3 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        {/* breadcrumb / back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
            <ChevronLeft size={16} />
          </span>
          <span>Kembali ke daftar layanan</span>
        </button>

        {/* card utama */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          {/* gambar / hero */}
          {layanan.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={layanan.coverUrl}
              alt={layanan.nama}
              className="h-64 w-full object-cover md:h-80"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-slate-100 md:h-80">
              <span className="text-sm text-slate-400">Ilustrasi layanan</span>
            </div>
          )}

          {/* isi */}
          <div className="grid gap-8 px-6 py-6 md:grid-cols-[2fr,1.2fr] md:px-8 md:py-8">
            {/* kiri: judul + deskripsi */}
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
                  {layanan.jenis}
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {layanan.nama}
                </h1>
                <p className="text-xs text-slate-500">
                  Durasi {layanan.durasiMenit} menit • Kategori{" "}
                  <span className="font-medium text-slate-700">
                    {layanan.kategori}
                  </span>
                </p>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <p className="whitespace-pre-line">{layanan.deskripsi}</p>
                {layanan.deskripsiPanjang && (
                  <p className="whitespace-pre-line">
                    {layanan.deskripsiPanjang}
                  </p>
                )}
              </div>
            </div>

            {/* kanan: panel harga / booking */}
            <aside className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 shadow-sm md:px-5 md:py-5">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Investasi layanan
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  Rp {layanan.harga.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-slate-600">
                <p>Yang akan kamu dapatkan:</p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Sesi tatap muka</li>
                  <li>Ringkasan hasil dan rekomendasi lanjutan</li>
                  <li>Privasi dan kerahasiaan klien terjaga</li>
                </ul>

                {layanan.catatan && (
                  <>
                    <p className="mt-2 font-semibold text-red-700">
                      Catatan
                    </p>
                    <p className="whitespace-pre-line">
                      {layanan.catatan}
                    </p>
                  </>
                )}
              </div>

              <button
                className="w-full rounded-full bg-[#1f3b5b] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
                onClick={() => router.push("/booking/services")}
              >
                Booking Sesi
              </button>

              <p className="text-[11px] text-slate-400">
                Jadwal akan dikonfirmasi kembali oleh admin setelah kamu
                melakukan permintaan booking.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
