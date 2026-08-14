import jsPDF from "jspdf";
import { Dass21Result } from "./dass21-calculator";

export interface Dass21PdfData {
  userName: string;
  userEmail?: string;
  date: string;
  testName: string;
  result: Dass21Result;
}

function loadImageAsBase64(url: string, maxWidth = 256, maxHeight = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject("SSR");
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed canvas context"));
      }
    };
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

export async function downloadDass21Pdf(data: Dass21PdfData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 12;

  const docNumber = `DOC/DASS21/${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

  // --- OFFICIAL OASE JIWA DOCUMENT KOP / HEADER ---
  // Try loading official Oase Jiwa logo image asset
  let logoBase64: string | null = null;
  try {
    logoBase64 = await loadImageAsBase64("/assets/logo/logo.png");
  } catch {
    try {
      logoBase64 = await loadImageAsBase64("/assets/oasejiwalogo.png");
    } catch {
      logoBase64 = null;
    }
  }

  // Left: Official Logo & Brand Title
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", margin, y, 16, 16);
    doc.setTextColor(31, 59, 91);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OASE JIWA", margin + 19, y + 7);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("BIRO PSIKOLOGI", margin + 19, y + 12);
  } else {
    doc.setFillColor(31, 59, 91); // #1f3b5b
    doc.roundedRect(margin, y, 14, 14, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("OJ", margin + 3.5, y + 9.5);

    doc.setTextColor(31, 59, 91);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("OASE JIWA", margin + 18, y + 7);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("BIRO PSIKOLOGI", margin + 18, y + 12);
  }

  // Right: Document Title & Metadata
  doc.setTextColor(31, 59, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("LAPORAN HASIL SKRINING DASS-21", pageWidth - margin, y + 5, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Layanan Evaluasi & Skrining Kesehatan Mental Biro Psikologi Oase Jiwa", pageWidth - margin, y + 9.5, { align: "right" });
  doc.text(`No. Dokumen: ${docNumber}  |  Tanggal: ${data.date}`, pageWidth - margin, y + 13.5, { align: "right" });

  // Official Kop Line Dividers
  doc.setDrawColor(31, 59, 91);
  doc.setLineWidth(0.8);
  doc.line(margin, y + 18.5, pageWidth - margin, y + 18.5);

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(margin, y + 20, pageWidth - margin, y + 20);

  y = 35;

  // --- INFORMASI PESERTA ---
  doc.setDrawColor(220, 226, 235);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 3, 3, "FD");

  doc.setTextColor(31, 59, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("INFORMASI PESERTA & INSTRUMEN TES", margin + 5, y + 6);

  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(`Nama Peserta   : ${data.userName || "Pengguna Oase Jiwa"}`, margin + 5, y + 13);
  doc.text(`Email           : ${data.userEmail || "Terverifikasi pada Akun User"}`, margin + 5, y + 19);
  doc.text(`Instrumen Tes   : ${data.testName}`, pageWidth / 2 + 5, y + 13);
  doc.text(`Kategori Global : ${data.result.overallCategory}`, pageWidth / 2 + 5, y + 19);

  y += 30;

  // --- TABEL DIMENSI DASS-21 ---
  doc.setFillColor(31, 59, 91);
  doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("DIMENSI", margin + 5, y + 5.5);
  doc.text("SKOR MENTAH", margin + 65, y + 5.5);
  doc.text("KATEGORI TINGKAT KEPARAHAN", margin + 115, y + 5.5);

  y += 8;

  const dimensions = [
    { label: "Depresi (Depression)", data: data.result.depression },
    { label: "Kecemasan (Anxiety)", data: data.result.anxiety },
    { label: "Stres (Stress)", data: data.result.stress },
  ];

  dimensions.forEach((dim, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 252);
      doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
    } else {
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
    }
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y + 10, pageWidth - margin, y + 10);

    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text(dim.label, margin + 5, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.text(`${dim.data.score} / ${dim.data.maxScore}`, margin + 65, y + 6.5);

    if (dim.data.category === "Normal") doc.setTextColor(16, 128, 67);
    else if (dim.data.category === "Ringan") doc.setTextColor(180, 110, 4);
    else if (dim.data.category === "Sedang") doc.setTextColor(217, 119, 6);
    else doc.setTextColor(220, 38, 38);

    doc.setFont("helvetica", "bold");
    doc.text(dim.data.category, margin + 115, y + 6.5);

    y += 10;
  });

  y += 6;

  // --- VISUALISASI HORIZONTAL BAR CHART ---
  doc.setTextColor(31, 59, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("VISUALISASI SKOR DIMENSI", margin, y);

  y += 4;
  doc.setDrawColor(220, 226, 235);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 32, 3, 3, "FD");

  let barY = y + 6;
  dimensions.forEach((dim) => {
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(dim.label.split(" ")[0], margin + 5, barY + 4);

    // Track Background
    const trackX = margin + 35;
    const trackWidth = 110;
    doc.setFillColor(235, 240, 248);
    doc.roundedRect(trackX, barY, trackWidth, 4.5, 1.5, 1.5, "F");

    // Fill Bar
    const fillWidth = Math.max(2, (dim.data.score / 21) * trackWidth);
    if (dim.data.category === "Normal") doc.setFillColor(34, 197, 94);
    else if (dim.data.category === "Ringan") doc.setFillColor(234, 179, 8);
    else if (dim.data.category === "Sedang") doc.setFillColor(249, 115, 22);
    else doc.setFillColor(239, 68, 68);

    doc.roundedRect(trackX, barY, fillWidth, 4.5, 1.5, 1.5, "F");

    // Value label
    doc.setFont("helvetica", "normal");
    doc.text(`${dim.data.score}/21`, trackX + trackWidth + 4, barY + 4);

    barY += 8.5;
  });

  y += 36;

  // --- INTERPRETASI & HASIL ---
  doc.setTextColor(31, 59, 91);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text("INTERPRETASI HASIL SKRINING", margin, y);

  y += 4;
  const interpLines = doc.splitTextToSize(data.result.interpretation, pageWidth - margin * 2 - 10);
  const interpBoxHeight = Math.max(26, interpLines.length * 4.5 + 8);

  doc.setDrawColor(220, 226, 235);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, pageWidth - margin * 2, interpBoxHeight, 3, 3, "FD");

  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(interpLines, margin + 5, y + 6);

  y += interpBoxHeight + 5;

  // --- REKOMENDASI & BOOKING KONSULTASI ---
  doc.setFillColor(240, 247, 255);
  doc.setDrawColor(186, 216, 250);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 3, 3, "FD");

  doc.setTextColor(30, 64, 120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("REKOMENDASI & TINDAK LANJUT KONSULTASI", margin + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text("• Berdasarkan hasil skrining, Anda disarankan melakukan sesi konsultasi lanjutan dengan Psikolog Oase Jiwa.", margin + 5, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 100, 174);
  doc.text("• Link Booking Konsultasi: https://oasejiwa.id/booking", margin + 5, y + 17);

  y += 26;

  // --- DISCLAIMER BOX MERAH MUDA (MATCHING REKAM MEDIS) ---
  const discLines = doc.splitTextToSize(data.result.disclaimer, pageWidth - margin * 2 - 10);
  const discBoxHeight = Math.max(22, discLines.length * 4 + 10);

  doc.setFillColor(255, 245, 245); // #fff5f5
  doc.setDrawColor(248, 180, 180); // #f8b4b4
  doc.roundedRect(margin, y, pageWidth - margin * 2, discBoxHeight, 3, 3, "FD");

  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("! CATATAN PENTING & DISCLAIMER MEDIS", margin + 5, y + 6);

  doc.setTextColor(127, 29, 29);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(discLines, margin + 5, y + 12);

  y += discBoxHeight + 6;

  // --- FOOTER ---
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, pageWidth - margin, y);

  y += 4;
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(7);
  doc.text("Dokumen ini bersifat RAHASIA dan digenerate secara otomatis oleh Sistem Layanan Psikologi Oase Jiwa.", margin, y);
  doc.text("Oase Jiwa © 2026 — Kenali Dirimu, Pulihkan Jiwamu.", pageWidth - margin - 60, y);

  doc.save(`Laporan-DASS21-${(data.userName || "User").replace(/\s+/g, "_")}.pdf`);
}
