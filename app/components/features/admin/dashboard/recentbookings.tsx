import Link from "next/link";
import { CheckCircle, Clock, ArrowUpRight } from "lucide-react";

interface Booking {
  id: number;
  patient: string;
  service: string;
  psychologist: string;
  date: string;
  time: string;
  status: "confirmed" | "pending";
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export default function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#2B5379]">Booking Terbaru</h2>
          <p className="text-sm text-gray-600 mt-1">{bookings.length} booking terakhir</p>
        </div>
        <Link 
          href="/admin/bookings" 
          className="text-sm font-medium text-[#2B5379] hover:text-[#1e3d57] flex items-center gap-1"
        >
          Lihat Semua
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div 
            key={booking.id} 
            className="p-4 bg-gray-50 rounded-lg border-l-4 border-[#2B5379]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{booking.patient}</p>
                <p className="text-sm text-gray-600">{booking.service}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {booking.psychologist} • {booking.date} • {booking.time}
                </p>
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ml-3 ${
                booking.status === "confirmed" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-orange-100 text-orange-700"
              }`}>
                {booking.status === "confirmed" ? "Confirmed" : "Pending"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
