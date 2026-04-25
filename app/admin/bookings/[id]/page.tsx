"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button, Modal, ImageModal } from "@/components/admin/ui";
import { ToastProvider, useToast } from "@/components/admin/ui/Toast";

// Mock booking data
const bookingData = {
  id: "BKG-001",
  status: "dp_validated", // pending_dp, dp_validated, dp_rejected, pending_full, fully_paid, full_rejected
  rejectReason: "", // Filled when rejected
  client: {
    name: "Andi Pratama",
    avatar: "/assets/about-us.jpg",
    gender: "Laki-laki",
    age: 28,
    whatsapp: "+6281234567890",
    email: "andi.pratama@email.com",
  },
  session: {
    psychologist: {
      name: "Dr. Sarah Wijaya",
      photo: "/assets/about-us.jpg",
      specialization: "Psikolog Klinis",
    },
    service: "Konseling Individual",
    schedule: "Senin, 28 Januari 2026 - 09:00 WIB",
    duration: "60 menit",
    roomNumber: "Ruang Konseling 2A",
  },
  payment: {
    total: 350000,
    dpAmount: 175000, // 50% DP
    remainingAmount: 175000, // Sisa pembayaran
    method: "Transfer Bank BCA",
    // DP Payment
    dpProofImage: "/assets/about-us.jpg",
    dpStatus: "validated", // pending, validated, rejected
    dpRejectReason: "",
    // Full Payment
    fullProofImage: "/assets/about-us.jpg",
    fullStatus: "pending", // pending, validated, rejected, not_uploaded
    fullRejectReason: "",
  },
  // Assessment form data (from consultation form)
  assessment: {
    sectionB: {
      title: "Bagian B: Riwayat Kesehatan Mental",
      items: [
        { label: "Pernah berkonsultasi dengan profesional kesehatan mental?", value: "Ya" },
        { label: "Jika ya, kapan terakhir kali?", value: "6 bulan yang lalu" },
        { label: "Apakah sedang mengonsumsi obat-obatan?", value: "Tidak" },
        { label: "Riwayat diagnosis kesehatan mental", value: "Gangguan Kecemasan (Anxiety Disorder)" },
      ],
    },
    sectionC: {
      title: "Bagian C: Keluhan Utama",
      items: [
        { label: "Keluhan utama saat ini", value: "Saya merasa cemas berlebihan setiap akan menghadapi meeting penting di kantor. Tidur saya juga terganggu, sering terbangun di malam hari." },
        { label: "Sejak kapan keluhan dirasakan?", value: "Sekitar 3 bulan terakhir" },
        { label: "Apa yang sudah dilakukan untuk mengatasi?", value: "Mencoba meditasi dan olahraga rutin, namun masih sering kambuh" },
        { label: "Tingkat gangguan dalam aktivitas sehari-hari (1-10)", value: "7" },
      ],
    },
    sectionD: {
      title: "Bagian D: Harapan dari Konseling",
      items: [
        { label: "Tujuan mengikuti konseling", value: "Ingin belajar cara mengelola kecemasan dengan lebih baik dan meningkatkan kualitas tidur" },
        { label: "Harapan setelah konseling", value: "Dapat lebih tenang menghadapi situasi yang memicu kecemasan" },
        { label: "Preferensi metode konseling", value: "Tatap muka langsung" },
      ],
    },
    sectionE: {
      title: "Bagian E: Informasi Tambahan",
      items: [
        { label: "Apakah ada informasi lain yang ingin disampaikan?", value: "Saya berharap sesi bisa dilakukan di waktu sore hari karena saya bekerja" },
        { label: "Kontak darurat", value: "Ibu - Siti Rahayu (+6281987654321)" },
      ],
    },
  },
  timeline: [
    {
      id: 1,
      event: "Booking dibuat",
      time: "28 Jan 2026, 08:00",
      isLatest: false,
    },
    {
      id: 2,
      event: "Bukti pembayaran DP diupload",
      time: "28 Jan 2026, 08:15",
      isLatest: false,
    },
    {
      id: 3,
      event: "Pembayaran DP divalidasi",
      time: "28 Jan 2026, 09:30",
      isLatest: true,
    },
  ],
  adminNotes: "",
};

function BookingDetailContent({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const [booking, setBooking] = useState(bookingData);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes);
  const [showDpImageModal, setShowDpImageModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [showRejectDpModal, setShowRejectDpModal] = useState(false);
  const [showRejectFullModal, setShowRejectFullModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  
  // Assessment accordion state
  const [expandedSections, setExpandedSections] = useState<string[]>(["sectionC"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const expandAllSections = () => {
    setExpandedSections(["sectionB", "sectionC", "sectionD", "sectionE"]);
  };

  const collapseAllSections = () => {
    setExpandedSections([]);
  };

  const handlePrintForm = () => {
    window.print();
    showToast("Mencetak formulir...", "info");
  };

  const handleContactClient = () => {
    const whatsappNumber = booking.client.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  // DP Payment Handlers
  const handleAcceptDpPayment = () => {
    setBooking((prev) => ({
      ...prev,
      payment: { ...prev.payment, dpStatus: "validated" },
      status: "dp_validated",
    }));
    showToast("Pembayaran DP berhasil divalidasi!", "success");
  };

  const handleRejectDpPayment = () => {
    setBooking((prev) => ({
      ...prev,
      payment: { ...prev.payment, dpStatus: "rejected", dpRejectReason: rejectReason },
      status: "dp_rejected",
      rejectReason: rejectReason,
    }));
    setShowRejectDpModal(false);
    setRejectReason("");
    showToast("Pembayaran DP ditolak", "error");
  };

  // Full Payment Handlers
  const handleAcceptFullPayment = () => {
    setBooking((prev) => ({
      ...prev,
      payment: { ...prev.payment, fullStatus: "validated" },
      status: "fully_paid",
    }));
    showToast("Pembayaran Lunas berhasil divalidasi!", "success");
  };

  const handleRejectFullPayment = () => {
    setBooking((prev) => ({
      ...prev,
      payment: { ...prev.payment, fullStatus: "rejected", fullRejectReason: rejectReason },
      status: "full_rejected",
    }));
    setShowRejectFullModal(false);
    setRejectReason("");
    showToast("Pembayaran Lunas ditolak", "error");
  };

  const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" }> = {
    pending_dp: { label: "Menunggu Validasi DP", variant: "warning" },
    dp_validated: { label: "DP Tervalidasi", variant: "info" },
    dp_rejected: { label: "DP Ditolak", variant: "danger" },
    pending_full: { label: "Menunggu Pelunasan", variant: "warning" },
    fully_paid: { label: "Lunas", variant: "success" },
    full_rejected: { label: "Pelunasan Ditolak", variant: "danger" },
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#4B4B4B] mb-4 animate-fadeIn">
          <Link href="/admin/bookings" className="hover:text-[#2B5379]">
            Manajemen Booking
          </Link>
          <span>/</span>
          <span className="text-[#234463]">{params.id}</span>
        </div>

        {/* Status-Specific Header Banner - Fully Paid */}
        {booking.status === "fully_paid" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pembayaran Lunas</h2>
                  <p className="text-white/80 text-sm">Sesi siap dilaksanakan sesuai jadwal</p>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-white/80 text-xs">Ruang Konseling</p>
                <p className="font-medium">{booking.session.roomNumber || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status-Specific Header Banner - DP Validated */}
        {booking.status === "dp_validated" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">DP Tervalidasi</h2>
                  <p className="text-white/80 text-sm">Menunggu pelunasan pembayaran</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl">
                <div>
                  <p className="text-white/80 text-xs">Sisa Pembayaran</p>
                  <p className="font-bold text-lg">Rp {booking.payment.remainingAmount.toLocaleString("id-ID")}</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="text-white/80 text-xs">Ruang Konseling</p>
                  <p className="font-medium">{booking.session.roomNumber || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status-Specific Header Banner - DP Rejected */}
        {booking.status === "dp_rejected" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pembayaran DP Ditolak</h2>
                  <p className="text-white/80 text-sm">Klien perlu mengupload ulang bukti pembayaran</p>
                </div>
              </div>
              {booking.payment.dpRejectReason && (
                <div className="bg-white/10 p-3 rounded-xl flex-1 max-w-md">
                  <p className="text-white/80 text-xs mb-1">Alasan Penolakan:</p>
                  <p className="text-sm">{booking.payment.dpRejectReason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status-Specific Header Banner - Full Payment Rejected */}
        {booking.status === "full_rejected" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Pelunasan Ditolak</h2>
                  <p className="text-white/80 text-sm">Klien perlu mengupload ulang bukti pelunasan</p>
                </div>
              </div>
              {booking.payment.fullRejectReason && (
                <div className="bg-white/10 p-3 rounded-xl flex-1 max-w-md">
                  <p className="text-white/80 text-xs mb-1">Alasan Penolakan:</p>
                  <p className="text-sm">{booking.payment.fullRejectReason}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status-Specific Header Banner - Pending DP */}
        {booking.status === "pending_dp" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Menunggu Validasi DP</h2>
                  <p className="text-white/80 text-sm">Silakan verifikasi bukti pembayaran DP</p>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-white/80 text-xs">Nominal DP</p>
                <p className="font-bold text-lg">Rp {booking.payment.dpAmount.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status-Specific Header Banner - Pending Full Payment */}
        {booking.status === "pending_full" && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-2xl text-white animate-fadeIn">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Menunggu Validasi Pelunasan</h2>
                  <p className="text-white/80 text-sm">Silakan verifikasi bukti pelunasan</p>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                <p className="text-white/80 text-xs">Sisa Pembayaran</p>
                <p className="font-bold text-lg">Rp {booking.payment.remainingAmount.toLocaleString("id-ID")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 animate-fadeIn">
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-bold text-[#234463]">
              Detail Booking #{params.id}
            </h1>
            <Badge
              variant={statusMap[booking.status]?.variant || "warning"}
              dot
              pulse={booking.status === "pending_dp" || booking.status === "pending_full"}
              className="text-base px-4 py-2"
            >
              {statusMap[booking.status]?.label || "Menunggu"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {(booking.status === "dp_validated" || booking.status === "fully_paid") && (
              <>
                <Button 
                  variant="primary" 
                  onClick={handlePrintForm}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                  }
                >
                  Cetak Hasil Form
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContactClient}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                  }
                >
                  Hubungi Klien
                </Button>
              </>
            )}
            {(booking.status === "pending_dp" || booking.status === "pending_full") && (
              <Button variant="outline" onClick={handleContactClient} icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              }>
                Hubungi Klien
              </Button>
            )}
            <Button variant="danger" onClick={() => setShowCancelModal(true)} icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }>
              Batalkan
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Data */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-1">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">Data Klien</h2>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={booking.client.avatar}
                    alt={booking.client.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#4B4B4B]">Nama Lengkap</p>
                    <p className="font-medium text-[#234463]">{booking.client.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4B4B4B]">Jenis Kelamin & Usia</p>
                    <p className="font-medium text-[#234463]">
                      {booking.client.gender}, {booking.client.age} tahun
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4B4B4B]">WhatsApp</p>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#234463]">{booking.client.whatsapp}</p>
                      <a
                        href={`https://wa.me/${booking.client.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#22C55E] text-white text-sm rounded-lg hover:bg-[#16A34A] hover:animate-bounce-subtle transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        Chat
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-[#4B4B4B]">Email</p>
                    <p className="font-medium text-[#234463]">{booking.client.email}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Session Details */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-2">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">Detail Sesi</h2>
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                  <Image
                    src={booking.session.psychologist.photo}
                    alt={booking.session.psychologist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#234463]">{booking.session.psychologist.name}</p>
                  <p className="text-sm text-[#4B4B4B]">{booking.session.psychologist.specialization}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#4B4B4B]">Layanan</p>
                  <p className="font-medium text-[#234463]">{booking.session.service}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4B4B4B]">Jadwal</p>
                  <p className="font-medium text-[#234463]">{booking.session.schedule}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4B4B4B]">Durasi</p>
                  <p className="font-medium text-[#234463]">{booking.session.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4B4B4B]">Ruang Konseling</p>
                  <p className="font-medium text-[#234463]">{booking.session.roomNumber}</p>
                </div>
              </div>
            </Card>

            {/* Admin Notes */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-3">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">Catatan Admin</h2>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Tambahkan catatan..."
                className="w-full h-32 px-4 py-3 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] resize-none"
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-[#4B4B4B]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="animate-pulse">Autosaved</span>
              </div>
            </Card>

            {/* Assessment Accordion */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#234463]">Ringkasan Assessment</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAllSections}
                    className="text-sm text-[#2B5379] hover:underline"
                  >
                    Buka Semua
                  </button>
                  <span className="text-[#D6E6F2]">|</span>
                  <button
                    onClick={collapseAllSections}
                    className="text-sm text-[#2B5379] hover:underline"
                  >
                    Tutup Semua
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Section B */}
                <div className="border border-[#D6E6F2] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("sectionB")}
                    className="w-full flex items-center justify-between p-4 bg-[#F5F9FC] hover:bg-[#E8F6FF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#2B5379] text-white rounded-lg flex items-center justify-center text-sm font-bold">B</span>
                      <span className="font-medium text-[#234463]">{booking.assessment.sectionB.title}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-[#4B4B4B] transition-transform ${expandedSections.includes("sectionB") ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.includes("sectionB") && (
                    <div className="p-4 space-y-4 border-t border-[#D6E6F2]">
                      {booking.assessment.sectionB.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-[#4B4B4B]">{item.label}</p>
                          <p className="font-medium text-[#234463]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section C - Keluhan Utama (default expanded) */}
                <div className="border-2 border-[#2B5379]/30 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("sectionC")}
                    className="w-full flex items-center justify-between p-4 bg-[#E8F6FF] hover:bg-[#D6E6F2] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#2B5379] text-white rounded-lg flex items-center justify-center text-sm font-bold">C</span>
                      <span className="font-medium text-[#234463]">{booking.assessment.sectionC.title}</span>
                      <Badge variant="primary" className="text-xs">Penting</Badge>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-[#4B4B4B] transition-transform ${expandedSections.includes("sectionC") ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.includes("sectionC") && (
                    <div className="p-4 space-y-4 border-t border-[#2B5379]/30">
                      {booking.assessment.sectionC.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-[#4B4B4B]">{item.label}</p>
                          <p className="font-medium text-[#234463] whitespace-pre-wrap">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section D */}
                <div className="border border-[#D6E6F2] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("sectionD")}
                    className="w-full flex items-center justify-between p-4 bg-[#F5F9FC] hover:bg-[#E8F6FF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#2B5379] text-white rounded-lg flex items-center justify-center text-sm font-bold">D</span>
                      <span className="font-medium text-[#234463]">{booking.assessment.sectionD.title}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-[#4B4B4B] transition-transform ${expandedSections.includes("sectionD") ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.includes("sectionD") && (
                    <div className="p-4 space-y-4 border-t border-[#D6E6F2]">
                      {booking.assessment.sectionD.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-[#4B4B4B]">{item.label}</p>
                          <p className="font-medium text-[#234463]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section E */}
                <div className="border border-[#D6E6F2] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection("sectionE")}
                    className="w-full flex items-center justify-between p-4 bg-[#F5F9FC] hover:bg-[#E8F6FF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-[#2B5379] text-white rounded-lg flex items-center justify-center text-sm font-bold">E</span>
                      <span className="font-medium text-[#234463]">{booking.assessment.sectionE.title}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-[#4B4B4B] transition-transform ${expandedSections.includes("sectionE") ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections.includes("sectionE") && (
                    <div className="p-4 space-y-4 border-t border-[#D6E6F2]">
                      {booking.assessment.sectionE.items.map((item, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-[#4B4B4B]">{item.label}</p>
                          <p className="font-medium text-[#234463]">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-2">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">Ringkasan Pembayaran</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#4B4B4B]">Total Biaya</span>
                  <span className="font-bold text-[#234463]">Rp {booking.payment.total.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4B4B4B]">DP (50%)</span>
                  <span className="font-medium text-[#234463]">Rp {booking.payment.dpAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#4B4B4B]">Sisa Pelunasan</span>
                  <span className="font-medium text-[#234463]">Rp {booking.payment.remainingAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="border-t border-[#D6E6F2] pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#4B4B4B]">Metode Pembayaran</span>
                    <span className="font-medium text-[#234463]">{booking.payment.method}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* DP Payment Verification */}
            <Card
              className={`p-6 animate-fadeIn opacity-0 stagger-2 ${
                booking.payment.dpStatus === "pending" ? "border-2 border-[#F59E0B]/50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#234463]">Pembayaran DP</h2>
                {booking.payment.dpStatus === "validated" && (
                  <Badge variant="success">Tervalidasi</Badge>
                )}
                {booking.payment.dpStatus === "pending" && (
                  <Badge variant="warning" dot pulse>Menunggu</Badge>
                )}
                {booking.payment.dpStatus === "rejected" && (
                  <Badge variant="danger">Ditolak</Badge>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#4B4B4B]">Nominal DP</p>
                  <p className="text-xl font-bold text-[#234463]">
                    Rp {booking.payment.dpAmount.toLocaleString("id-ID")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#4B4B4B] mb-2">Bukti Pembayaran DP</p>
                  <div
                    onClick={() => setShowDpImageModal(true)}
                    className="relative w-full h-40 rounded-xl overflow-hidden cursor-pointer group"
                  >
                    <Image
                      src={booking.payment.dpProofImage}
                      alt="Bukti Pembayaran DP"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {booking.payment.dpStatus === "pending" && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-[#D6E6F2]">
                    <Button
                      variant="success"
                      fullWidth
                      onClick={handleAcceptDpPayment}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      }
                    >
                      Validasi DP
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => setShowRejectDpModal(true)}
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      }
                    >
                      Tolak DP
                    </Button>
                  </div>
                )}

                {booking.payment.dpStatus === "rejected" && booking.payment.dpRejectReason && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 font-medium mb-1">Alasan Penolakan:</p>
                    <p className="text-sm text-red-700">{booking.payment.dpRejectReason}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Full Payment Verification - Only show if DP is validated */}
            {booking.payment.dpStatus === "validated" && (
              <Card
                className={`p-6 animate-fadeIn opacity-0 stagger-3 ${
                  booking.payment.fullStatus === "pending" ? "border-2 border-[#F59E0B]/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#234463]">Pelunasan</h2>
                  {booking.payment.fullStatus === "validated" && (
                    <Badge variant="success">Lunas</Badge>
                  )}
                  {booking.payment.fullStatus === "pending" && (
                    <Badge variant="warning" dot pulse>Menunggu</Badge>
                  )}
                  {booking.payment.fullStatus === "rejected" && (
                    <Badge variant="danger">Ditolak</Badge>
                  )}
                  {booking.payment.fullStatus === "not_uploaded" && (
                    <Badge variant="info">Belum Upload</Badge>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#4B4B4B]">Sisa Pembayaran</p>
                    <p className="text-xl font-bold text-[#234463]">
                      Rp {booking.payment.remainingAmount.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {booking.payment.fullStatus !== "not_uploaded" && (
                    <div>
                      <p className="text-sm text-[#4B4B4B] mb-2">Bukti Pelunasan</p>
                      <div
                        onClick={() => setShowFullImageModal(true)}
                        className="relative w-full h-40 rounded-xl overflow-hidden cursor-pointer group"
                      >
                        <Image
                          src={booking.payment.fullProofImage}
                          alt="Bukti Pelunasan"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {booking.payment.fullStatus === "not_uploaded" && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">Klien belum mengupload bukti pelunasan</p>
                    </div>
                  )}

                  {booking.payment.fullStatus === "pending" && (
                    <div className="flex flex-col gap-3 pt-4 border-t border-[#D6E6F2]">
                      <Button
                        variant="success"
                        fullWidth
                        onClick={handleAcceptFullPayment}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        }
                      >
                        Validasi Pelunasan
                      </Button>
                      <Button
                        variant="danger"
                        fullWidth
                        onClick={() => setShowRejectFullModal(true)}
                        icon={
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        }
                      >
                        Tolak Pelunasan
                      </Button>
                    </div>
                  )}

                  {booking.payment.fullStatus === "rejected" && booking.payment.fullRejectReason && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600 font-medium mb-1">Alasan Penolakan:</p>
                      <p className="text-sm text-red-700">{booking.payment.fullRejectReason}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Activity Timeline */}
            <Card className="p-6 animate-fadeIn opacity-0 stagger-3">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">Timeline Aktivitas</h2>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-[#D6E6F2]" />
                
                <div className="space-y-4">
                  {booking.timeline.map((item, index) => (
                    <div
                      key={item.id}
                      className={`relative flex gap-4 pl-6 animate-fadeIn opacity-0`}
                      style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                    >
                      {/* Dot */}
                      <div
                        className={`
                          absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white
                          ${item.isLatest ? "bg-[#2B5379] animate-glow" : "bg-[#D6E6F2]"}
                        `}
                      />
                      
                      <div>
                        <p className={`font-medium ${item.isLatest ? "text-[#234463]" : "text-[#4B4B4B]"}`}>
                          {item.event}
                        </p>
                        <p className="text-sm text-[#4B4B4B]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Modal - DP */}
      <ImageModal
        isOpen={showDpImageModal}
        onClose={() => setShowDpImageModal(false)}
        imageSrc={booking.payment.dpProofImage}
        alt="Bukti Pembayaran DP"
      />

      {/* Image Modal - Full Payment */}
      <ImageModal
        isOpen={showFullImageModal}
        onClose={() => setShowFullImageModal(false)}
        imageSrc={booking.payment.fullProofImage}
        alt="Bukti Pelunasan"
      />

      {/* Reject DP Modal */}
      <Modal
        isOpen={showRejectDpModal}
        onClose={() => setShowRejectDpModal(false)}
        title="Tolak Pembayaran DP"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin menolak pembayaran DP ini? Mohon berikan alasan penolakan.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Alasan penolakan..."
            className="w-full h-24 px-4 py-3 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] resize-none"
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowRejectDpModal(false)} fullWidth>
              Batal
            </Button>
            <Button variant="danger" onClick={handleRejectDpPayment} fullWidth>
              Tolak DP
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Full Payment Modal */}
      <Modal
        isOpen={showRejectFullModal}
        onClose={() => setShowRejectFullModal(false)}
        title="Tolak Pelunasan"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin menolak pelunasan ini? Mohon berikan alasan penolakan.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Alasan penolakan..."
            className="w-full h-24 px-4 py-3 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] resize-none"
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowRejectFullModal(false)} fullWidth>
              Batal
            </Button>
            <Button variant="danger" onClick={handleRejectFullPayment} fullWidth>
              Tolak Pelunasan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Cancel Booking Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Booking"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setShowCancelModal(false)} fullWidth>
              Tidak
            </Button>
            <Button variant="danger" onClick={() => {
              setShowCancelModal(false);
              showToast("Booking berhasil dibatalkan", "error");
            }} fullWidth>
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  return (
    <ToastProvider>
      <BookingDetailContent params={params} />
    </ToastProvider>
  );
}
