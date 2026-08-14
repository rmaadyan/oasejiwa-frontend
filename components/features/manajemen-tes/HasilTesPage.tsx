// components/features/manajemen-tes/HasilTesPage.tsx
"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/Alert";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { DiagnosisKategori, SectionKategoriMap } from "./types";
import { calculateDass21Result } from "@/lib/utils/dass21-calculator";
import { downloadDass21Pdf } from "@/lib/utils/dass21-pdf-generator";

const RESULT_KEY = "tes-last-result";

type SectionScore = {
  section: string;
  total: number;
  maks: number;
};

type HasilStored = {
  tesId: number;
  namaTes: string;
  total: number;
  maks: number;
  persen: number;
  kategoriNama: string;
  kategoriList: DiagnosisKategori[];
  sections?: SectionScore[];
  sectionKategori?: SectionKategoriMap;
};

type DataPeserta = {
  nama: string;
  umur: string;
  jenisKelamin: string;
};

export default function HasilTesPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [hasil, setHasil] = useState<HasilStored | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataPeserta, setDataPeserta] = useState<DataPeserta>({
    nama: "",
    umur: "",
    jenisKelamin: "",
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(RESULT_KEY);
    if (raw) {
      try {
        const parsed: HasilStored = JSON.parse(raw);
        if (parsed && parsed.tesId === id) {
          setHasil(parsed);
        }
      } catch {
        // ignore
      }
    }
    setLoading(false);
  }, [id]);

  const handleInputChange = (field: keyof DataPeserta, value: string) => {
    setDataPeserta((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const generatePDF = async () => {
    const isFormValid =
      dataPeserta.nama.trim() &&
      dataPeserta.umur.trim() &&
      dataPeserta.jenisKelamin.trim();

    setFormError(null);
    setPdfError(null);

    if (!isFormValid) {
      setFormError("Harap isi nama, umur, dan jenis kelamin terlebih dahulu.");
      return;
    }

    setIsDownloading(true);
    try {
      if (hasil && (hasil as any).answers) {
        const dassRes = calculateDass21Result((hasil as any).answers);
        downloadDass21Pdf({
          userName: dataPeserta.nama,
          date: new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          testName: hasil.namaTes,
          result: dassRes,
        });
        setIsDownloading(false);
        return;
      }

      const element = document.getElementById("hasil-tes-content");
      if (!element) {
        setPdfError("Elemen hasil tes tidak ditemukan.");
        setIsDownloading(false);
        return;
      }

      const cloneElement = element.cloneNode(true) as HTMLElement;

      const tempWrapper = document.createElement("div");
      tempWrapper.style.position = "absolute";
      tempWrapper.style.left = "-9999px";
      tempWrapper.style.top = "-9999px";
      tempWrapper.style.backgroundColor = "#ffffff";
      tempWrapper.style.padding = "0";
      tempWrapper.style.width = "900px";
      tempWrapper.appendChild(cloneElement);
      document.body.appendChild(tempWrapper);

      const allElements = cloneElement.querySelectorAll<HTMLElement>("*");
      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        const bg = computed.backgroundColor;
        const col = computed.color;
        const border = computed.borderColor;

        if (bg && bg !== "rgba(0, 0, 0, 0)") el.style.backgroundColor = bg;
        if (col && col !== "rgba(0, 0, 0, 0)") el.style.color = col;
        if (border && border !== "rgba(0, 0, 0, 0)") el.style.borderColor = border;
      });

      const styleTags = cloneElement.querySelectorAll("style");
      styleTags.forEach((tag) => tag.remove());

      const canvas = await html2canvas(cloneElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        allowTaint: true,
        useCORS: true,
        logging: false,
        width: 900,
        ignoreElements: (el) =>
          el.tagName === "SCRIPT" || el.tagName === "NOSCRIPT",
        onclone: (clonedDoc) => {
          const imgs = clonedDoc.querySelectorAll("img");
          imgs.forEach((img) => {
            if (!img.getAttribute("crossorigin")) {
              img.setAttribute("crossorigin", "anonymous");
            }
          });
        },
      });

      document.body.removeChild(tempWrapper);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 7;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Calculate how tall the image would be in mm when scaled to fit content width
      const scaledImgHeightMm = (canvas.height * contentWidth) / canvas.width;

      // Calculate the canvas pixel height that corresponds to one PDF page
      const pageCanvasHeight = Math.floor(
        (contentHeight / scaledImgHeightMm) * canvas.height
      );

      const totalPages = Math.ceil(canvas.height / pageCanvasHeight);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate the slice of the source canvas for this page
        const sourceY = page * pageCanvasHeight;
        const sourceH = Math.min(pageCanvasHeight, canvas.height - sourceY);

        // Create a temporary canvas for this page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceH;
        const pageCtx = pageCanvas.getContext("2d");
        if (!pageCtx) continue;

        // Fill with white background, then draw the slice
        pageCtx.fillStyle = "#ffffff";
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceH,
          0, 0, canvas.width, sourceH
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        const sliceHeightMm = (sourceH * contentWidth) / canvas.width;

        pdf.addImage(
          pageImgData,
          "PNG",
          margin,
          margin,
          contentWidth,
          sliceHeightMm
        );
      }

      const safeNamaTes =
        hasil?.namaTes.replace(/[\\/:*?"<>|]/g, "_") ?? "Tes";
      const safeNama = dataPeserta.nama.replace(/[\\/:*?"<>|]/g, "_");
      const fileName = `Hasil-${safeNamaTes}-${safeNama}.pdf`;

      pdf.save(fileName);
    } catch (err) {
      console.error("PDF Error:", err);
      setPdfError(
        err instanceof Error
          ? `Gagal membuat PDF: ${err.message}`
          : "Gagal membuat PDF karena kesalahan yang tidak diketahui."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-600 shadow">
          Memuat hasil...
        </div>
      </div>
    );
  }

  if (!hasil) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-xl bg-white px-6 py-4 text-sm text-gray-700 shadow">
          Hasil tes tidak ditemukan.
          <button
            onClick={() => router.push("/")}
            className="ml-3 rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {(formError || pdfError) && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center">
          <div className="w-full max-w-md px-4">
            <Alert
              variant={pdfError ? "destructive" : "warning"}
              className="pointer-events-auto shadow-lg shadow-black/10"
            >
              <AlertTitle>
                {pdfError ? "Gagal membuat PDF" : "Form belum lengkap"}
              </AlertTitle>
              <AlertDescription>{pdfError ?? formError}</AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
        <div className="mx-auto max-w-5xl">
          {/* Form data peserta */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-800">
              Data Peserta
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={dataPeserta.nama}
                  onChange={(e) => handleInputChange("nama", e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Umur
                </label>
                <input
                  type="number"
                  value={dataPeserta.umur}
                  onChange={(e) => handleInputChange("umur", e.target.value)}
                  placeholder="Umur"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700">
                  Jenis Kelamin
                </label>
                <select
                  value={dataPeserta.jenisKelamin}
                  onChange={(e) =>
                    handleInputChange("jenisKelamin", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Pilih --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Konten untuk PDF */}
          <div
            id="hasil-tes-content"
            className="rounded-xl bg-white p-8 shadow-sm"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {/* HEADER DENGAN LOGO */}
            <div className="mb-5 flex items-start justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                  <img
                    src="\assets\oasejiwalogo.png"
                    alt="Logo Oase Jiwa"
                    crossOrigin="anonymous"
                    className="h-12 w-12 object-contain"
                    style={{ display: "block" }}
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#1964ae]">
                    Oase Jiwa
                  </h1>
                  <p className="text-[11px] text-gray-600">
                    Kenali Dirimu, Pulihkan Jiwamu
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] text-gray-600">
                <p className="font-semibold text-[#1964ae]">
                  Biro Psikologi Oase Jiwa
                </p>
                <p>Perumahan d' soeta residence D no.1</p>
                <p>Desa Tegalgondo, Kec. Karangploso, Kab. Malang</p>
              </div>
            </div>

            {/* DATA PESERTA */}
            <div className="mb-4 border-b border-gray-200 pb-3">
              <p className="mb-2 text-xs font-semibold text-[#1964ae]">
                Data Peserta
              </p>
              <div className="space-y-1 text-xs text-gray-800">
                <div className="flex gap-2">
                  <span className="w-20 font-semibold text-[#1f3b5b]">
                    Tanggal
                  </span>
                  <span>:</span>
                  <span>
                    {new Date().toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    (
                    {new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    )
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 font-semibold text-[#1f3b5b]">
                    Nama
                  </span>
                  <span>:</span>
                  <span>{dataPeserta.nama || "-"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 font-semibold text-[#1f3b5b]">
                    Gender
                  </span>
                  <span>:</span>
                  <span>{dataPeserta.jenisKelamin || "-"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-20 font-semibold text-[#1f3b5b]">
                    Umur
                  </span>
                  <span>:</span>
                  <span>
                    {dataPeserta.umur ? `${dataPeserta.umur} tahun` : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* RINGKASAN HASIL */}
            <div className="mb-5 rounded-lg bg-green-50 px-4 py-3 border border-purple-100">
              <p className="mb-1 text-center text-sm font-semibold text-gray-800">
                {hasil.namaTes}
              </p>
              <p className="text-center text-sm font-bold text-red-700">
                {hasil.kategoriNama}
              </p>
              <p className="mt-1 text-center text-xs text-gray-700">
                Skor total = {hasil.total} / {hasil.maks}
              </p>
            </div>

            {/* SKOR PER DIMENSI DALAM TABEL */}
            {hasil.sections && hasil.sections.length > 0 && (
              <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
                <div className="bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white grid grid-cols-[1.2fr_0.5fr_2fr]">
                  <div>Dimensi</div>
                  <div>Skor</div>
                  <div>Rujukan</div>
                </div>

                {hasil.sections.map((s, idx) => {
                  const kategoriDimensi =
                    hasil.sectionKategori?.[s.section] ?? [];
                  const rujukanText =
                    kategoriDimensi.length === 0
                      ? "-"
                      : kategoriDimensi
                        .map((k, kIdx) => {
                          const isLast =
                            kIdx === kategoriDimensi.length - 1;
                          return isLast
                            ? `≥ ${k.minSkor} = ${k.nama}`
                            : `${k.minSkor}-${k.maxSkor} = ${k.nama}`;
                        })
                        .join("; ");

                  return (
                    <div
                      key={s.section}
                      className={`grid grid-cols-[1.2fr_0.5fr_2fr] px-5 py-3 text-sm border-t border-gray-200 ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                    >
                      <div className="font-semibold text-gray-800">
                        {s.section}
                      </div>
                      <div className="text-gray-800">
                        {s.total} / {s.maks}
                      </div>
                      <div className="text-gray-700">{rujukanText}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABEL KATEGORI GLOBAL */}
            {hasil.kategoriList && hasil.kategoriList.length > 0 && (
              <div className="mb-7 overflow-hidden rounded-lg border border-gray-300">
                <div
                  className="grid gap-0 bg-[#1f3b5b] px-5 py-3 text-sm font-bold text-white"
                  style={{ gridTemplateColumns: "1.2fr 0.5fr 2fr" }}
                >
                  <div className="text-left">Kategori</div>
                  <div className="text-left">Skor</div>
                  <div className="text-left">Keterangan</div>
                </div>

                {hasil.kategoriList.map((k, idx) => {
                  const minSkor = Math.round(
                    (k.minPersen / 100) * hasil.maks
                  );
                  const maxSkor = Math.round(
                    (k.maxPersen / 100) * hasil.maks
                  );
                  const isMatched =
                    hasil.total >= minSkor && hasil.total <= maxSkor;

                  return (
                    <div
                      key={k.id}
                      className={`grid gap-0 border-t border-gray-300 px-5 py-3 text-sm ${isMatched
                        ? "bg-green-100 font-semibold"
                        : idx % 2 === 0
                          ? "bg-gray-50"
                          : "bg-white"
                        }`}
                      style={{ gridTemplateColumns: "1.2fr 0.5fr 2fr" }}
                    >
                      <div className="text-left text-gray-800">{k.nama}</div>
                      <div className="text-left text-gray-700">
                        {minSkor} - {maxSkor}
                      </div>
                      <div className="text-left text-gray-600">
                        {k.deskripsi || "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CATATAN PENTING */}
            <div className="mt-6 rounded-lg border border-[#f8b4b4] bg-[#fff5f5] px-5 py-4 text-xs leading-relaxed text-[#7f1d1d]">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f97373] text-[11px] font-bold text-white">
                  !
                </span>
                <p className="text-sm font-semibold text-[#991b1b]">
                  Penting untuk diperhatikan!
                </p>
              </div>
              <ul className="ml-4 list-disc space-y-1.5">
                <li>
                  Alat tes yang terdapat di halaman web ini hanya sebagai deteksi awal
                  dan tidak dapat digunakan sebagai acuan diagnosis penyakit yang
                  Anda alami.
                </li>
                <li>
                  Hasil tes hanya diketahui oleh pengguna (tanpa disimpan di database,
                  bersifat privat).
                </li>
                <li>
                  Hasil dari jawaban tes hanya memberikan gambaran umum kondisi mental
                  saat ini dan akan memberikan rujukan atau saran untuk kesehatan
                  mental Anda.
                </li>
                <li>
                  Alat tes yang terdapat di halaman ini dibuat berdasarkan studi
                  nasional dan internasional yang sering dipakai pada praktik klinis
                  psikiater dan psikolog yang sudah diuji validitas dan reliabilitasnya.
                </li>
                <li>
                  Sangat dianjurkan untuk meminta saran pada profesional
                  psikiater/psikolog untuk melakukan pemeriksaan lanjutan jika
                  diperlukan.
                </li>
              </ul>
            </div>

            {/* FOOTER */}
            <div className="mt-6 flex items-end justify-between border-t border-gray-300 pt-4 text-xs text-gray-600">
              <div>
                <p>Dokumen ini digenerate secara otomatis.</p>
                <p>
                  {new Date().toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p>____________________</p>
                <p className="mt-2">Administrasi Oase Jiwa</p>
              </div>
            </div>
          </div>

          {/* Tombol aksi */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={() => router.push("/tes")}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-blue-50 cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={generatePDF}
              disabled={isDownloading}
              className="rounded-full bg-[#1f3b5b] px-6 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60 cursor-pointer"
            >
              {isDownloading ? "Mengunduh..." : "Download Hasil PDF"}
            </button>
            <button
              onClick={() => {
                const token =
                  typeof window !== "undefined"
                    ? localStorage.getItem("auth_token") ||
                      localStorage.getItem("token") ||
                      localStorage.getItem("accessToken")
                    : null;
                const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                if (!token && !user) {
                  router.push(`/auth/signin?redirect=${encodeURIComponent("/booking/psychologists")}`);
                } else {
                  router.push("/booking/psychologists");
                }
              }}
              className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
            >
              Booking Psikolog
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
