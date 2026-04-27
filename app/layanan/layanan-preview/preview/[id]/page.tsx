"use client";

import type { LayananItem } from "@/components/features/manajemen-layanan/types";
import { getLayananById } from "@/lib/api/layanan";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewLayananPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [layanan, setLayanan] = useState<LayananItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const data = await getLayananById(id);
        setLayanan(data);
      } catch (err) {
        console.error(err);
        setLayanan(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLayanan();
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
            onClick={() => router.push("/admin/manajemen-layanan")}
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

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          {/* ── COVER IMAGE ── */}
          {layanan.coverUrl ? (
            <div className="relative w-full overflow-hidden" style={{ height: "420px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={layanan.coverUrl}
                alt={layanan.nama}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              {/* badge jenis layanan */}
              <span className="absolute bottom-5 left-6 rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-600 shadow">
                {layanan.jenis}
              </span>
            </div>
          ) : (
            <div
              className="flex w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200"
              style={{ height: "420px" }}
            >
              <span className="text-sm text-slate-400">Ilustrasi layanan</span>
            </div>
          )}

          {/* ── KONTEN ── */}
          <div className="grid gap-8 px-6 py-6 md:grid-cols-[2fr,1.2fr] md:px-8 md:py-8">
            {/* kiri: info utama */}
            <div className="space-y-5">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-[28px] font-bold text-secondary-heading">
                  {layanan.nama}
                </h1>
                <p className="text-xs text-slate-500">
                  Durasi {layanan.durasiMenit} menit • Kategori{" "}
                  <span className="font-medium text-slate-700">{layanan.kategori}</span>
                </p>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                <p className="whitespace-pre-line">{layanan.deskripsi}</p>
                {layanan.deskripsiPanjang && (
                  <p className="whitespace-pre-line">{layanan.deskripsiPanjang}</p>
                )}
              </div>
            </div>

            {/* kanan: aside harga & booking */}
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
                    <p className="mt-2 font-semibold text-red-700">Catatan</p>
                    <p className="whitespace-pre-line">{layanan.catatan}</p>
                  </>
                )}
              </div>

              <button 
              onClick={()=> router.push(`/booking/psychologists?service=${layanan.id}`)}
              className="w-full rounded-full bg-[#1f3b5b] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60"
              >
                Booking Sesi
              </button>

              <p className="text-[11px] text-slate-400">
                Jadwal akan dikonfirmasi kembali oleh admin setelah kamu melakukan permintaan booking.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}