"use client";

import { useEffect, useState } from "react";
import { getUserBookings } from "@/lib/api/booking";
import Link from "next/link";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];
      setBookings(list);
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // 🟢 Realtime fetch saat kembali ke tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchBookings();
      }
    };

    window.addEventListener("focus", fetchBookings);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("focus", fetchBookings);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_DP":
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1"><AlertCircle size={14} /> Menunggu DP</span>;
      case "WAITING_APPROVAL":
        return <span className="px-3 py-1 bg-blue-100 text-[#234463] rounded-full text-xs font-semibold flex items-center gap-1"><Clock size={14} /> Menunggu Validasi Admin</span>;
      case "APPROVED":
        return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} /> DP Divalidasi</span>;
      case "FULLY_PAID":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} /> Lunas</span>;
      case "REJECTED":
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle size={14} /> Ditolak</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle size={14} /> Selesai</span>;
      case "CANCELLED":
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle size={14} /> Dibatalkan</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "-") return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 flex justify-center items-center h-48">
        <div className="animate-spin w-8 h-8 border-4 border-[#2B5379] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <Calendar size={32} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#234463]">Belum Ada Riwayat Booking</h3>
          <p className="text-gray-500 mt-1 text-xs">Anda belum memiliki jadwal booking konsultasi aktif.</p>
        </div>
        <Link href="/layanan" className="inline-block mt-4 px-6 py-2.5 bg-[#234463] text-white text-xs font-semibold rounded-xl hover:bg-[#2B5379] transition-colors">
          Mulai Konsultasi
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-poppins">
      <h2 className="text-xl sm:text-2xl font-bold text-[#234463]">Riwayat Booking Saya</h2>
      
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white border border-blue-100 rounded-2xl shadow-xs p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-1">{booking.bookingCode ?? `BKG-${booking.id}`}</p>
                <h3 className="text-base sm:text-lg font-bold text-[#234463]">{booking.service?.nama || "Layanan Konseling"}</h3>
              </div>
              <div>
                {getStatusBadge(booking.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#234463]">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Psikolog</p>
                  <p className="font-semibold text-xs sm:text-sm text-[#234463]">{booking.psychologist?.fullName ?? booking.psychologist?.name ?? "Psikolog Oase Jiwa"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-[#234463]">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Jadwal Sesi</p>
                  <p className="font-semibold text-xs sm:text-sm text-[#234463]">
                    {formatDate(booking.scheduledDate ?? booking.date ?? "-")} • {booking.scheduledTime ?? booking.time ?? "-"} WIB
                  </p>
                </div>
              </div>
            </div>

            {booking.status === "PENDING_DP" && (
              <div className="pt-2">
                <button
                  onClick={() => router.push(`/booking/payment-method?bookingId=${booking.id}`)}
                  className="px-4 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl hover:bg-[#2B5379] transition cursor-pointer"
                >
                  Lanjut Pembayaran DP
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}