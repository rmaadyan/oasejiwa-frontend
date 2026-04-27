"use client";

import { Button, Card, Modal, Pagination, Table } from "@/components/admin/ui";
import CountUp from "@/components/admin/ui/CountUp";
import { ToastProvider, useToast } from "@/components/admin/ui/Toast";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAdminBookings } from "@/lib/api/booking";

const paymentStatusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" | "pending" }> = {
  validated: { label: "Tervalidasi", variant: "success" },
  pending: { label: "Menunggu Validasi", variant: "warning" },
  rejected: { label: "Ditolak", variant: "danger" },
};

const sessionStatusMap: Record<string, { label: string; variant: "success" | "info" | "danger" | "pending" | "primary" }> = {
  scheduled: { label: "Terjadwal", variant: "primary" },
  waiting: { label: "Menunggu", variant: "pending" },
  completed: { label: "Selesai", variant: "success" },
  cancelled: { label: "Dibatalkan", variant: "danger" },
};

// Available time slots
const timeSlots = [
  { id: "09:00", time: "09.00 WIB", available: true },
  { id: "10:00", time: "10.00 WIB", available: true },
  { id: "11:00", time: "11.00 WIB", available: false },
  { id: "13:00", time: "13.00 WIB", available: true },
  { id: "14:00", time: "14.00 WIB", available: true },
  { id: "15:00", time: "15.00 WIB", available: false },
  { id: "16:00", time: "16.00 WIB", available: true },
  { id: "19:00", time: "19.00 WIB", available: true },
  { id: "20:00", time: "20.00 WIB", available: true },
];

// Generate dates for the next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      id: `date-${i}`,
      date: date,
      dayName: date.toLocaleDateString("id-ID", { weekday: "short" }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString("id-ID", { month: "short" }),
      fullDate: date.toISOString().split("T")[0],
    });
  }
  return dates;
};

function AdminBookingsContent() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickFilter, setQuickFilter] = useState<"all" | "today" | "needValidation" | "cancelled">("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await getAdminBookings();
        const data = res.data ?? [];

        const mapped = data.map((b: any) => {
          // Tentukan paymentStatus berdasarkan status booking
          let paymentStatus = "pending";
          if (["APPROVED", "FULLY_PAID", "COMPLETED"].includes(b.status)) {
            paymentStatus = "validated";
          } else if (["REJECTED", "CANCELLED"].includes(b.status)) {
            paymentStatus = "rejected";
          }

          // Tentukan sessionStatus
          let sessionStatus = "waiting";
          if (["APPROVED", "FULLY_PAID"].includes(b.status)) {
            sessionStatus = "scheduled";
          } else if (b.status === "COMPLETED") {
            sessionStatus = "completed";
          } else if (["REJECTED", "CANCELLED"].includes(b.status)) {
            sessionStatus = "cancelled";
          }

          const dateStr = b.scheduledDate
            ? b.scheduledDate.split("T")[0]
            : "";

          return {
            id: `BKG-${b.bookingCode ?? b.id}`,
            originalId: b.id,
            bookingCode: b.bookingCode,
            datetime: `${dateStr} ${b.scheduledTime ?? ""}`,
            client: {
              name: b.user?.email ?? "Klien",
              avatar: "/assets/about-us.jpg",
            },
            psychologist: b.psychologist?.fullName ?? "Psikolog",
            service: b.service?.nama ?? "Layanan",
            paymentStatus,
            sessionStatus,
            rawStatus: b.status,
            scheduleUpdated: false,
            totalPrice: b.totalPrice,
            dpAmount: b.dpAmount,
          };
        });

        setBookings(mapped);
      } catch (e) {
        console.error("Gagal fetch bookings:", e);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Reschedule modal state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const availableDates = generateDates();

  const handleOpenReschedule = (booking: any) => {
    setSelectedBooking(booking);
    setSelectedDate("");
    setSelectedTime("");
    setRescheduleReason("");
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedDate || !selectedTime || !rescheduleReason.trim()) {
      showToast("Lengkapi semua data reschedule", "error");
      return;
    }
    showToast(`Jadwal berhasil diubah untuk booking ${selectedBooking?.id}`, "success");
    setIsRescheduleModalOpen(false);
    setSelectedBooking(null);
  };

  // Filter logic
  const today = new Date().toISOString().split("T")[0];
  const filteredBookings = bookings.filter((b) => {
    if (quickFilter === "today") return b.datetime.startsWith(today);
    if (quickFilter === "needValidation") return b.paymentStatus === "pending";
    if (quickFilter === "cancelled") return b.sessionStatus === "cancelled";
    return true;
  }).filter((b) => {
    if (statusFilter !== "all") return b.paymentStatus === statusFilter;
    return true;
  }).filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.client.name.toLowerCase().includes(q) ||
      b.psychologist.toLowerCase().includes(q) ||
      b.service.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  // Quick filter counts
  const quickFilterCounts = {
    today: bookings.filter((b) => b.datetime.startsWith(today)).length,
    needValidation: bookings.filter((b) => b.paymentStatus === "pending").length,
    cancelled: bookings.filter((b) => b.sessionStatus === "cancelled").length,
  };

  const stats = [
    {
      label: "Perlu Validasi",
      value: quickFilterCounts.needValidation,
      color: "warning" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      pulse: true,
    },
    {
      label: "Jadwal Hari Ini",
      value: quickFilterCounts.today,
      color: "primary" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Total Booking",
      value: bookings.length,
      color: "success" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Booking Batal",
      value: quickFilterCounts.cancelled,
      color: "danger" as const,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const columns = [
    {
      key: "id",
      header: "Kode Booking",
      render: (item: any) => (
        <span className="font-mono text-sm text-[#2B5379] font-medium">{item.bookingCode ?? item.id}</span>
      ),
    },
    {
      key: "client",
      header: "Klien",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#D6E6F2] flex items-center justify-center">
            <span className="text-xs font-bold text-[#2B5379]">
              {item.client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium text-[#234463]">{item.client.name}</span>
        </div>
      ),
    },
    {
      key: "datetime",
      header: "Jadwal",
      sortable: true,
      render: (item: any) => {
        const [datePart, timePart] = item.datetime.split(" ");
        const date = datePart ? new Date(datePart) : null;
        const formattedDate = date
          ? date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
          : "-";
        return (
          <div className="flex flex-col">
            <span className="text-[#234463] font-medium">{formattedDate}</span>
            <span className="text-sm text-[#4B4B4B]">{timePart ?? "-"} WIB</span>
            {item.scheduleUpdated && (
              <span className="text-xs text-[#F59E0B] flex items-center gap-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Jadwal Diperbarui
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "psychologist",
      header: "Psikolog",
      render: (item: any) => (
        <span className="text-[#4B4B4B]">{item.psychologist}</span>
      ),
    },
    {
      key: "service",
      header: "Layanan",
      render: (item: any) => (
        <span className="text-[#4B4B4B]">{item.service}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: any) => {
        const statusColors: Record<string, string> = {
          validated: "bg-[#22C55E]",
          pending: "bg-[#F59E0B]",
          rejected: "bg-[#EF4444]",
        };
        const statusLabels: Record<string, string> = {
          validated: "Divalidasi",
          pending: "Menunggu",
          rejected: "Ditolak",
        };
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${statusColors[item.paymentStatus]}`} />
              <span className={`font-medium text-sm ${
                item.paymentStatus === "validated" ? "text-[#22C55E]" :
                item.paymentStatus === "rejected" ? "text-[#EF4444]" :
                "text-[#F59E0B]"
              }`}>
                {statusLabels[item.paymentStatus]}
              </span>
            </div>
            <span className="text-xs text-[#4B4B4B] bg-gray-100 px-2 py-0.5 rounded-full w-fit">
              {item.rawStatus}
            </span>
          </div>
        );
      },
    },
    {
      key: "action",
      header: "Action",
      render: (item: any) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/bookings/${item.originalId}`}
            className="px-3 py-1.5 text-sm bg-[#2B5379] text-white rounded-lg hover:bg-[#1E3A5F] transition-all"
          >
            Detail
          </Link>
          {item.paymentStatus === "validated" && item.sessionStatus !== "completed" && (
            <button
              onClick={() => handleOpenReschedule(item)}
              className="p-1.5 text-[#4B4B4B] hover:bg-[#E8F6FF] rounded-lg transition-all"
              title="Edit Jadwal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FC] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-2xl md:text-[28px] font-bold text-secondary-heading">
            Manajemen Booking
          </h1>
          <p className="text-[#4B4B4B] mt-1">
            Kelola dan pantau semua booking konseling
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fadeIn">
          <button
            onClick={() => setQuickFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              quickFilter === "all"
                ? "bg-[#2B5379] text-white shadow-md"
                : "bg-white text-[#4B4B4B] border border-[#D6E6F2] hover:border-[#2B5379]"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setQuickFilter("today")}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              quickFilter === "today"
                ? "bg-[#2B5379] text-white shadow-md"
                : "bg-white text-[#4B4B4B] border border-[#D6E6F2] hover:border-[#2B5379]"
            }`}
          >
            Hari Ini
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              quickFilter === "today" ? "bg-white/20" : "bg-[#2B5379]/10 text-[#2B5379]"
            }`}>
              {quickFilterCounts.today}
            </span>
          </button>
          <button
            onClick={() => setQuickFilter("needValidation")}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              quickFilter === "needValidation"
                ? "bg-[#F59E0B] text-white shadow-md"
                : "bg-white text-[#4B4B4B] border border-[#D6E6F2] hover:border-[#F59E0B]"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                quickFilter === "needValidation" ? "bg-white" : "bg-[#F59E0B]"
              }`} />
            </span>
            Perlu Validasi
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              quickFilter === "needValidation" ? "bg-white/20" : "bg-[#F59E0B]/10 text-[#F59E0B]"
            }`}>
              {quickFilterCounts.needValidation}
            </span>
          </button>
          <button
            onClick={() => setQuickFilter("cancelled")}
            className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
              quickFilter === "cancelled"
                ? "bg-[#EF4444] text-white shadow-md"
                : "bg-white text-[#4B4B4B] border border-[#D6E6F2] hover:border-[#EF4444]"
            }`}
          >
            Dibatalkan
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              quickFilter === "cancelled" ? "bg-white/20" : "bg-[#EF4444]/10 text-[#EF4444]"
            }`}>
              {quickFilterCounts.cancelled}
            </span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              accentColor={stat.color}
              hoverable
              className={`p-6 animate-fadeIn opacity-0 stagger-${index + 1}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#4B4B4B] mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#234463]">
                    <CountUp end={stat.value} />
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === "warning" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                  stat.color === "primary" ? "bg-[#2B5379]/10 text-[#2B5379]" :
                  stat.color === "success" ? "bg-[#22C55E]/10 text-[#22C55E]" :
                  "bg-[#EF4444]/10 text-[#EF4444]"
                } ${stat.pulse ? "animate-pulse" : ""}`}>
                  {stat.icon}
                </div>
              </div>
              {stat.pulse && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
                  </span>
                  <span className="text-xs text-[#F59E0B]">Perlu perhatian</span>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Filter & Search */}
        <Card className="p-4 mb-6 animate-fadeIn opacity-0 stagger-5">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari booking, klien, atau psikolog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all bg-white text-[#4B4B4B]"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Validasi</option>
              <option value="validated">Tervalidasi</option>
              <option value="rejected">Ditolak</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="px-4 py-2.5 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all text-[#4B4B4B]"
              />
              <span className="text-[#4B4B4B]">-</span>
              <input
                type="date"
                className="px-4 py-2.5 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all text-[#4B4B4B]"
              />
            </div>
          </div>
        </Card>

        {/* Booking Table */}
        <div className="animate-fadeIn opacity-0 stagger-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B5379]" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20 text-[#4B4B4B]">
              Tidak ada data booking ditemukan.
            </div>
          ) : (
            <Table columns={columns} data={filteredBookings} />
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredBookings.length / 10)}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Reschedule Modal */}
        <Modal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          title="Ubah Jadwal Konseling"
          size="lg"
        >
          <div className="space-y-6">
            {selectedBooking && (
              <div className="bg-[#F5F9FC] p-4 rounded-xl border border-[#D6E6F2]">
                <p className="text-sm text-[#4B4B4B] mb-2">Booking Saat Ini:</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D6E6F2] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#2B5379]">
                      {selectedBooking.client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-[#234463]">{selectedBooking.client.name}</p>
                    <p className="text-sm text-[#4B4B4B]">
                      {selectedBooking.datetime} • {selectedBooking.service}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-[#234463] mb-3">
                Pilih Tanggal Baru
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {availableDates.map((dateItem) => (
                  <button
                    key={dateItem.id}
                    onClick={() => setSelectedDate(dateItem.fullDate)}
                    className={`flex-shrink-0 w-16 py-3 rounded-xl border-2 transition-all ${
                      selectedDate === dateItem.fullDate
                        ? "border-[#2B5379] bg-[#2B5379] text-white"
                        : "border-[#D6E6F2] bg-white text-[#4B4B4B] hover:border-[#2B5379]"
                    }`}
                  >
                    <div className="text-xs opacity-75">{dateItem.dayName}</div>
                    <div className="text-lg font-bold">{dateItem.dayNumber}</div>
                    <div className="text-xs opacity-75">{dateItem.monthName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-[#234463] mb-3">
                Pilih Waktu Baru
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.id)}
                    disabled={!slot.available}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === slot.id
                        ? "bg-[#2B5379] text-white"
                        : slot.available
                          ? "bg-white border border-[#D6E6F2] text-[#4B4B4B] hover:border-[#2B5379]"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-[#234463] mb-2">
                Alasan Perubahan Jadwal
              </label>
              <textarea
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="Masukkan alasan perubahan jadwal..."
                className="w-full px-4 py-3 border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all resize-none"
                rows={3}
              />
            </div>

            {selectedDate && selectedTime && (
              <div className="bg-[#E8F6FF] p-4 rounded-xl border border-[#2B5379]/20">
                <p className="text-sm font-medium text-[#2B5379] mb-1">Jadwal Baru:</p>
                <p className="text-[#234463] font-semibold">
                  {new Date(selectedDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}, {selectedTime} WIB
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsRescheduleModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReschedule}
                disabled={!selectedDate || !selectedTime || !rescheduleReason.trim()}
                className="flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Konfirmasi Perubahan
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <ToastProvider>
      <AdminBookingsContent />
    </ToastProvider>
  );
}