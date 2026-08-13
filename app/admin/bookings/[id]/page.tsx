"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Badge, Button, Modal, ImageModal } from "@/components/admin/ui";
import { ToastProvider, useToast } from "@/components/admin/ui/Toast";
import {
  getAdminBookingDetail,
  approveBooking,
  rejectBooking,
  confirmFullPayment,
} from "@/lib/api/booking";

// ─── HELPER UNTUK URL GAMBAR BACKEND DENGAN .ENV ─────────────────────────────
// ─── HELPER UNTUK URL GAMBAR BACKEND DENGAN SANITIZER ─────────────────────────────
const getImageUrl = (path?: string | null): string => {
  if (!path) return "";

  // 🟢 1. Jika data lama di DB tersimpan dengan 'localhost', paksa ganti ke domain HTTPS produksi
  if (path.includes("localhost")) {
    return path.replace(/http:\/\/localhost:\d+/, "https://api.oasejiwa.id");
  }

  // 🟢 2. Jika sudah berupa HTTPS utuh atau Base64, kembalikan langsung
  if (path.startsWith("https://") || path.startsWith("data:image/")) {
    return path;
  }

  // 🟢 3. Jika HTTP biasa, ubah ke HTTPS agar tidak kena Mixed Content Warning
  if (path.startsWith("http://")) {
    return path.replace("http://", "https://");
  }

  // 🟢 4. Jika relative path (/uploads/...), gabungkan dengan domain API produksi
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://api.oasejiwa.id";

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${backendUrl}${cleanPath}`;
};
// ─── Konstanta Status Backend ──────────────────────────────────────────────────
const statusUIMap: Record<
  string,
  { label: string; variant: "success" | "warning" | "danger" | "info" }
> = {
  PENDING_DP: { label: "Menunggu Upload Bukti DP", variant: "warning" },
  WAITING_APPROVAL: { label: "Menunggu Validasi Admin", variant: "warning" },
  APPROVED: { label: "DP Tervalidasi – Tunggu Lunas", variant: "info" },
  FULLY_PAID: { label: "Lunas", variant: "success" },
  REJECTED: { label: "Ditolak", variant: "danger" },
  COMPLETED: { label: "Selesai", variant: "success" },
  CANCELLED: { label: "Dibatalkan", variant: "danger" },
};

const defaultBooking = {
  id: 0,
  bookingCode: "",
  status: "PENDING_DP" as string,
  rejectionReason: null as string | null,
  notes: null as string | null,
  scheduledDate: "",
  scheduledTime: "",
  totalPrice: 0,
  dpAmount: 0,
  remainingAmount: 0,
  approvedAt: null as string | null,
  user: { id: "", email: "", fullName: "-", phone: null as string | null },
  psychologist: {
    id: 0,
    fullName: "-",
    avatarUrl: null as string | null,
    sipp: null as string | null,
  },
  service: { id: 0, nama: "-", jenis: "-", harga: 0 },
  payments: [] as {
    id: number;
    type: "DOWN_PAYMENT" | "FULL_PAYMENT";
    amount: number;
    method: string;
    status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
    proofImageUrl?: string | null;
    orderId: string;
    expiredAt: string | null;
    createdAt: string;
  }[],
  consultationForm: null as {
    id: number;
    keluhanUtama?: string;
    riwayatKesehatan?: string;
    harapanKonseling?: string;
    informasiTambahan?: string;
    [key: string]: any;
  } | null,
  consentForm: null as Record<string, any> | null,
};

type BookingData = typeof defaultBooking;

function mapApiToBooking(data: any): BookingData {
  return {
    id: data.id,
    bookingCode: data.bookingCode ?? String(data.id),
    status: data.status ?? "PENDING_DP",
    rejectionReason: data.rejectionReason ?? null,
    notes: data.notes ?? null,
    scheduledDate: data.scheduledDate ?? "",
    scheduledTime: data.scheduledTime ?? "",
    totalPrice: data.totalPrice ?? 0,
    dpAmount: data.dpAmount ?? 0,
    remainingAmount: data.remainingAmount ?? 0,
    approvedAt: data.approvedAt ?? null,
    user: {
      id: data.user?.id ?? "",
      email: data.user?.email ?? "",
      fullName: data.user?.userProfile?.fullName ?? "-",
      phone: data.user?.userProfile?.phone ?? null,
    },
    psychologist: {
      id: data.psychologist?.id ?? 0,
      fullName: data.psychologist?.fullName ?? "-",
      avatarUrl: data.psychologist?.avatarUrl ?? null,
      sipp: data.psychologist?.sipp ?? null,
    },
    service: {
      id: data.service?.id ?? 0,
      nama: data.service?.nama ?? "-",
      jenis: data.service?.jenis ?? "-",
      harga: data.service?.harga ?? data.totalPrice ?? 0,
    },
    payments: (data.payments ?? []).map((p: any) => ({
      id: p.id,
      type: p.type,
      amount: p.amount,
      method: p.method ?? "-",
      status: p.status,
      // 🟢 FIX: Memastikan gambar mengambil baik dari paymentProofUrl maupun proofImageUrl
      proofImageUrl: p.paymentProofUrl ?? p.proofImageUrl ?? null,
      orderId: p.orderId ?? "",
      expiredAt: p.expiredAt ?? null,
      createdAt: p.createdAt ?? "",
    })),
    consultationForm: data.consultationForm ?? null,
    consentForm: data.consentForm ?? null,
  };
}

function getPayment(
  payments: BookingData["payments"],
  type: "DOWN_PAYMENT" | "FULL_PAYMENT",
) {
  return payments.find((p) => p.type === type) ?? null;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function rupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

// ─── Inner content (Client Component) ─────────────────────────────────────────

function BookingDetailContent({ id }: { id: string }) {
  const { showToast } = useToast();

  const [booking, setBooking] = useState<BookingData>(defaultBooking);
  const [isLoading, setIsLoading] = useState(true);

  const [showDpImageModal, setShowDpImageModal] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmFullModal, setShowConfirmFullModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [expandedSections, setExpandedSections] = useState<string[]>([
    "keluhanUtama",
  ]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const res = await getAdminBookingDetail(id);
        const mapped = mapApiToBooking(res?.data ?? res);
        setBooking(mapped);
      } catch (e: any) {
        showToast(e.message || "Gagal mengambil detail booking", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const toggleSection = (key: string) =>
    setExpandedSections((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    );

  const handleContactClient = () => {
    if (booking.user.phone) {
      const phone = booking.user.phone.replace(/[^0-9]/g, "");
      const intlPhone = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
      window.open(`https://wa.me/${intlPhone}`, "_blank");
    } else {
      showToast("Nomor telepon klien tidak tersedia", "error");
    }
  };

  const handleApproveDP = async () => {
    try {
      await approveBooking(booking.id);
      setBooking((prev) => ({ ...prev, status: "APPROVED" }));
      showToast("Pembayaran DP berhasil divalidasi!", "success");
    } catch (e: any) {
      showToast(e.message || "Gagal menyetujui DP", "error");
    }
  };

  const handleRejectDP = async () => {
    if (!rejectReason.trim()) {
      showToast("Alasan penolakan harus diisi", "error");
      return;
    }
    try {
      await rejectBooking(booking.id, rejectReason);
      setBooking((prev) => ({
        ...prev,
        status: "REJECTED",
        rejectionReason: rejectReason,
      }));
      setShowRejectModal(false);
      setRejectReason("");
      showToast("Booking ditolak", "error");
    } catch (e: any) {
      showToast(e.message || "Gagal menolak booking", "error");
    }
  };

  const handleConfirmFullPayment = async () => {
    try {
      await confirmFullPayment(booking.id);
      setBooking((prev) => ({ ...prev, status: "FULLY_PAID" }));
      setShowConfirmFullModal(false);
      showToast("Pelunasan berhasil dikonfirmasi!", "success");
    } catch (e: any) {
      showToast(e.message || "Gagal konfirmasi pelunasan", "error");
    }
  };

  const handleCancelBooking = async () => {
    try {
      await rejectBooking(booking.id, "Dibatalkan oleh admin");
      setBooking((prev) => ({
        ...prev,
        status: "REJECTED",
        rejectionReason: "Dibatalkan oleh admin",
      }));
      setShowCancelModal(false);
      showToast("Booking berhasil dibatalkan", "error");
    } catch (e: any) {
      showToast(e.message || "Gagal membatalkan booking", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F9FC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B5379]" />
      </div>
    );
  }

  const dpPayment = getPayment(booking.payments, "DOWN_PAYMENT");
  const fullPayment = getPayment(booking.payments, "FULL_PAYMENT");
  const statusUI = statusUIMap[booking.status] ?? {
    label: booking.status,
    variant: "warning" as const,
  };

  const canApproveReject = booking.status === "WAITING_APPROVAL";
  const canCancel = !["REJECTED", "COMPLETED", "CANCELLED"].includes(
    booking.status,
  );

  const scheduleStr =
    booking.scheduledDate && booking.scheduledTime
      ? `${formatDate(booking.scheduledDate)}, ${booking.scheduledTime} WIB`
      : "-";

  return (
    <div className="min-h-screen bg-[#F5F9FC] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#4B4B4B] mb-4">
          <Link href="/admin/bookings" className="hover:text-[#2B5379]">
            Manajemen Booking
          </Link>
          <span>/</span>
          <span className="text-[#234463]">{booking.bookingCode}</span>
        </div>

        {/* Status Banner */}
        {booking.status === "WAITING_APPROVAL" && (
          <StatusBanner
            gradient="from-[#F59E0B] to-[#D97706]"
            icon={<ClockIcon pulse />}
            title="Menunggu Validasi Admin"
            subtitle="User telah mengupload bukti DP – silakan verifikasi"
            right={
              <InfoChip
                label="Nominal DP"
                value={rupiah(booking.dpAmount)}
                bold
              />
            }
          />
        )}
        {booking.status === "APPROVED" && (
          <StatusBanner
            gradient="from-[#3B82F6] to-[#2563EB]"
            icon={<MoneyIcon />}
            title="DP Tervalidasi"
            subtitle="Menunggu pembayaran pelunasan dari user"
            right={
              <InfoChip
                label="Sisa Pelunasan"
                value={rupiah(booking.remainingAmount)}
                bold
              />
            }
          />
        )}
        {booking.status === "FULLY_PAID" && (
          <StatusBanner
            gradient="from-[#22C55E] to-[#16A34A]"
            icon={<CheckIcon />}
            title="Pembayaran Lunas"
            subtitle="Sesi siap dilaksanakan sesuai jadwal"
          />
        )}
        {booking.status === "COMPLETED" && (
          <StatusBanner
            gradient="from-[#22C55E] to-[#16A34A]"
            icon={<CheckIcon />}
            title="Sesi Selesai"
            subtitle="Konseling telah dilaksanakan"
          />
        )}
        {(booking.status === "REJECTED" || booking.status === "CANCELLED") && (
          <StatusBanner
            gradient="from-[#EF4444] to-[#DC2626]"
            icon={<XIcon />}
            title={
              booking.status === "REJECTED"
                ? "Booking Ditolak"
                : "Booking Dibatalkan"
            }
            subtitle="Jadwal psikolog telah dibuka kembali"
            right={
              booking.rejectionReason ? (
                <div className="bg-white/10 p-3 rounded-xl flex-1 max-w-md">
                  <p className="text-white/80 text-xs mb-1">Alasan:</p>
                  <p className="text-sm">{booking.rejectionReason}</p>
                </div>
              ) : null
            }
          />
        )}
        {booking.status === "PENDING_DP" && (
          <StatusBanner
            gradient="from-[#6B7280] to-[#4B5563]"
            icon={<ClockIcon />}
            title="Menunggu Bukti DP"
            subtitle="User belum mengupload bukti pembayaran DP"
            right={
              <InfoChip
                label="Nominal DP"
                value={rupiah(booking.dpAmount)}
                bold
              />
            }
          />
        )}

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-[28px] font-bold text-[#234463]">
              Detail Booking #{booking.bookingCode}
            </h1>
            <Badge
              variant={statusUI.variant}
              dot
              pulse={canApproveReject}
              className="text-base px-4 py-2"
            >
              {statusUI.label}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={handleContactClient}
              icon={<WhatsAppIcon />}
            >
              Hubungi Klien
            </Button>
            {canCancel && (
              <Button
                variant="danger"
                onClick={() => setShowCancelModal(true)}
                icon={<XIcon small />}
              >
                Batalkan
              </Button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">
                Data Klien
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D6E6F2] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[#2B5379]">
                    {booking.user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoField label="Email" value={booking.user.email} />
                  <InfoField label="Nama " value={String(booking.user.fullName)} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">
                Detail Sesi
              </h2>
              <div className="flex items-start gap-4 mb-6">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#D6E6F2] flex-shrink-0 flex items-center justify-center">
                  {booking.psychologist.avatarUrl ? (
  <img
    src={getImageUrl(booking.psychologist.avatarUrl)}
    alt={booking.psychologist.fullName}
    className="w-full h-full object-cover"
  />
) : (
  <span className="text-xl font-bold text-[#2B5379]">
    {booking.psychologist.fullName.charAt(0)}
  </span>
)}
                </div>
                <div>
                  <p className="font-semibold text-[#234463]">
                    {booking.psychologist.fullName}
                  </p>
                  {booking.psychologist.sipp && (
                    <p className="text-sm text-[#4B4B4B]">
                      SIPP: {booking.psychologist.sipp}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Layanan" value={booking.service.nama} />
                <InfoField label="Jenis" value={booking.service.jenis} />
                <InfoField label="Jadwal" value={scheduleStr} />
                {booking.approvedAt && (
                  <InfoField
                    label="Disetujui pada"
                    value={formatDate(booking.approvedAt)}
                  />
                )}
              </div>
              {booking.notes && (
                <div className="mt-4 p-3 bg-[#F5F9FC] rounded-xl border border-[#D6E6F2]">
                  <p className="text-sm text-[#4B4B4B] mb-1">
                    Catatan dari Klien:
                  </p>
                  <p className="text-[#234463]">{booking.notes}</p>
                </div>
              )}
            </Card>

            {booking.consultationForm && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#234463]">
                    Formulir Konsultasi
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setExpandedSections(
                          Object.keys(booking.consultationForm ?? {}).filter(
                            (k) =>
                              ![
                                "id",
                                "bookingId",
                                "createdAt",
                                "updatedAt",
                              ].includes(k),
                          ),
                        )
                      }
                      className="text-sm text-[#2B5379] hover:underline"
                    >
                      Buka Semua
                    </button>
                    <span className="text-[#D6E6F2]">|</span>
                    <button
                      onClick={() => setExpandedSections([])}
                      className="text-sm text-[#2B5379] hover:underline"
                    >
                      Tutup Semua
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {Object.entries(booking.consultationForm)
                    .filter(
                      ([k]) =>
                        !["id", "bookingId", "createdAt", "updatedAt"].includes(
                          k,
                        ),
                    )
                    .map(([key, value]) => {
                      const isExpanded = expandedSections.includes(key);
                      const label = key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase());
                      return (
                        <div
                          key={key}
                          className="rounded-xl overflow-hidden border border-[#D6E6F2]"
                        >
                          <button
                            onClick={() => toggleSection(key)}
                            className="w-full flex items-center justify-between p-4 bg-[#F5F9FC] hover:bg-[#E8F6FF] transition-colors"
                          >
                            <span className="font-medium text-[#234463]">
                              {label}
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-5 w-5 text-[#4B4B4B] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          {isExpanded && (
                            <div className="p-4 border-t border-[#D6E6F2]">
                              {value === null ||
                              value === undefined ||
                              value === "" ? (
                                <p className="text-sm text-[#4B4B4B] italic">
                                  Tidak diisi
                                </p>
                              ) : typeof value === "object" ? (
                                <pre className="text-sm text-[#234463] whitespace-pre-wrap">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              ) : (
                                <p className="text-[#234463] whitespace-pre-wrap">
                                  {String(value)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[#234463] mb-4">
                Ringkasan Pembayaran
              </h2>
              <div className="space-y-3">
                <PaymentRow
                  label="Total Biaya"
                  value={rupiah(booking.totalPrice)}
                  bold
                />
                <PaymentRow label="DP (50%)" value={rupiah(booking.dpAmount)} />
                <PaymentRow
                  label="Sisa Pelunasan"
                  value={rupiah(booking.remainingAmount)}
                />
              </div>
            </Card>

            <Card
              className={`p-6 ${canApproveReject ? "border-2 border-[#F59E0B]/50" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#234463]">
                  Pembayaran DP
                </h2>
                {dpPayment ? (
                  <Badge
                    variant={
                      dpPayment.status === "PAID"
                        ? "success"
                        : dpPayment.status === "PENDING"
                          ? "warning"
                          : "danger"
                    }
                    dot={dpPayment.status === "PENDING"}
                    pulse={dpPayment.status === "PENDING"}
                  >
                    {dpPayment.status === "PAID"
                      ? "Terbayar"
                      : dpPayment.status === "PENDING"
                        ? "Menunggu"
                        : dpPayment.status}
                  </Badge>
                ) : (
                  <Badge variant="info">Belum Ada</Badge>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#4B4B4B]">Nominal DP</p>
                  <p className="text-xl font-bold text-[#234463]">
                    {rupiah(booking.dpAmount)}
                  </p>
                </div>
                {dpPayment && (
                  <>
                    <InfoField label="Order ID" value={dpPayment.orderId} />
                    <InfoField label="Metode" value={dpPayment.method} />
                    {dpPayment.expiredAt && (
                      <InfoField
                        label="Batas Bayar"
                        value={formatDate(dpPayment.expiredAt)}
                      />
                    )}
                  </>
                )}
                {dpPayment?.proofImageUrl ? (
                  <ProofImage
                    src={dpPayment.proofImageUrl}
                    alt="Bukti Pembayaran DP"
                    onClick={() => setShowDpImageModal(true)}
                  />
                ) : (
                  <EmptyProof label="User belum mengupload bukti DP" />
                )}
                {canApproveReject && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-[#D6E6F2]">
                    <Button
                      variant="success"
                      fullWidth
                      onClick={handleApproveDP}
                      icon={<CheckIcon small />}
                    >
                      Validasi DP
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => setShowRejectModal(true)}
                      icon={<XIcon small />}
                    >
                      Tolak Booking
                    </Button>
                  </div>
                )}
                {booking.status === "REJECTED" && booking.rejectionReason && (
                  <RejectReasonBox reason={booking.rejectionReason} />
                )}
              </div>
            </Card>

            {["APPROVED", "FULLY_PAID", "COMPLETED"].includes(
              booking.status,
            ) && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#234463]">
                    Pelunasan
                  </h2>
                  {fullPayment ? (
                    <Badge
                      variant={
                        fullPayment.status === "PAID"
                          ? "success"
                          : fullPayment.status === "PENDING"
                            ? "warning"
                            : "danger"
                      }
                      dot={fullPayment.status === "PENDING"}
                      pulse={fullPayment.status === "PENDING"}
                    >
                      {fullPayment.status === "PAID"
                        ? "Lunas"
                        : fullPayment.status === "PENDING"
                          ? "Menunggu"
                          : fullPayment.status}
                    </Badge>
                  ) : (
                    <Badge variant="info">Belum Upload</Badge>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#4B4B4B]">Sisa Pembayaran</p>
                    <p className="text-xl font-bold text-[#234463]">
                      {rupiah(booking.remainingAmount)}
                    </p>
                  </div>
                  {fullPayment && (
                    <>
                      <InfoField label="Order ID" value={fullPayment.orderId} />
                      <InfoField label="Metode" value={fullPayment.method} />
                    </>
                  )}
                  {booking.status === "APPROVED" && (
                    <div className="pt-4 border-t border-[#D6E6F2]">
                      <Button
                        variant="success"
                        fullWidth
                        onClick={() => setShowConfirmFullModal(true)}
                        icon={<CheckIcon small />}
                      >
                        Konfirmasi Pelunasan Offline
                      </Button>
                      <p className="text-xs text-[#4B4B4B] text-center mt-2">
                        Gunakan tombol ini jika klien telah melunasi pembayaran secara langsung di kantor
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {booking.payments.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-[#234463] mb-4">
                  Riwayat Payment
                </h2>
                <div className="space-y-3">
                  {booking.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 bg-[#F5F9FC] rounded-xl border border-[#D6E6F2]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#234463]">
                          {p.type === "DOWN_PAYMENT" ? "DP" : "Pelunasan"}
                        </p>
                        <p className="text-xs text-[#4B4B4B]">{p.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#234463]">
                          {rupiah(p.amount)}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            p.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : p.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImageModal
        isOpen={showDpImageModal}
        onClose={() => setShowDpImageModal(false)}
        imageSrc={getImageUrl(
          getPayment(booking.payments, "DOWN_PAYMENT")?.proofImageUrl,
        )}
        alt="Bukti Pembayaran DP"
      />
      <ImageModal
        isOpen={showFullImageModal}
        onClose={() => setShowFullImageModal(false)}
        imageSrc={getImageUrl(
          getPayment(booking.payments, "FULL_PAYMENT")?.proofImageUrl,
        )}
        alt="Bukti Pelunasan"
      />

      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason("");
        }}
        title="Tolak Booking"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin menolak booking ini? Jadwal psikolog akan
            dibuka kembali. Mohon berikan alasan penolakan.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Alasan penolakan..."
            className="w-full h-24 px-4 py-3 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              fullWidth
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleRejectDP} fullWidth>
              Tolak Booking
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showConfirmFullModal}
        onClose={() => setShowConfirmFullModal(false)}
        title="Konfirmasi Pelunasan Offline"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin mengkonfirmasi pelunasan sebesar{" "}
            <strong>{rupiah(booking.remainingAmount)}</strong> telah diterima
            secara offline di kantor?
          </p>
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700">
              Status booking akan berubah menjadi <strong>FULLY_PAID</strong>{" "}
              dan sesi siap dilaksanakan.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmFullModal(false)}
              fullWidth
            >
              Batal
            </Button>
            <Button variant="success" onClick={handleConfirmFullPayment} fullWidth>
              Ya, Konfirmasi
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Booking"
      >
        <div className="space-y-4">
          <p className="text-[#4B4B4B]">
            Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini tidak
            dapat dibatalkan dan jadwal psikolog akan dibuka kembali.
          </p>
          {booking.status !== "WAITING_APPROVAL" && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-700">
                Hanya mendukung pembatalan saat status{" "}
                <strong>WAITING_APPROVAL</strong>. Status saat ini:{" "}
                <strong>{booking.status}</strong>. Pembatalan mungkin gagal.
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => setShowCancelModal(false)}
              fullWidth
            >
              Tidak
            </Button>
            <Button variant="danger" onClick={handleCancelBooking} fullWidth>
              Ya, Batalkan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Page Entry Point ──────────────────────────────────────────────────────────

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <ToastProvider>
      <BookingDetailContent id={id} />
    </ToastProvider>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#4B4B4B]">{label}</p>
      <p className="font-medium text-[#234463]">{value || "-"}</p>
    </div>
  );
}

function PaymentRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#4B4B4B]">{label}</span>
      <span
        className={
          bold ? "font-bold text-[#234463]" : "font-medium text-[#234463]"
        }
      >
        {value}
      </span>
    </div>
  );
}

// 🟢 FIX: Menggunakan tag <img> HTML standar dengan URL Backend utuh
function ProofImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) {
  return (
    <div>
      <p className="text-sm text-[#4B4B4B] mb-2">{alt}</p>
      <div
        onClick={onClick}
        className="relative w-full h-40 rounded-xl overflow-hidden cursor-pointer group border border-[#D6E6F2]"
      >
        <img
          src={getImageUrl(src)}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EmptyProof({ label }: { label: string }) {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-gray-400 mx-auto mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function RejectReasonBox({ reason }: { reason: string }) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
      <p className="text-sm text-red-600 font-medium mb-1">Alasan Penolakan:</p>
      <p className="text-sm text-red-700">{reason}</p>
    </div>
  );
}

function StatusBanner({
  gradient,
  icon,
  title,
  subtitle,
  right,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className={`mb-6 p-4 bg-gradient-to-r ${gradient} rounded-2xl text-white`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-white/80 text-sm">{subtitle}</p>
          </div>
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}

function InfoChip({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="bg-white/10 p-3 rounded-xl">
      <p className="text-white/80 text-xs">{label}</p>
      <p className={bold ? "font-bold text-lg" : "font-medium"}>{value}</p>
    </div>
  );
}

function CheckIcon({ small }: { small?: boolean }) {
  const s = small ? "h-4 w-4" : "h-6 w-6";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={s}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function XIcon({ small }: { small?: boolean }) {
  const s = small ? "h-4 w-4" : "h-6 w-6";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={s}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ClockIcon({ pulse }: { pulse?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6${pulse ? " animate-pulse" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}