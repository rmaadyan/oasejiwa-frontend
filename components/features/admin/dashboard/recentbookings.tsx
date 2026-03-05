import Link from "next/link";
import { Users, CheckCircle, Clock, ArrowUpRight } from "lucide-react";

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
          <h2 className="text-xl font-semibold text-gray-900">Booking Terbaru</h2>
          <p className="text-sm text-gray-600 mt-1">{bookings.length} booking terakhir</p>
        </div>
        <Link 
          href="/admin/bookings" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          Lihat Semua
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div 
            key={booking.id} 
            className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{booking.patient}</p>
                <p className="text-sm text-gray-600">{booking.service}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {booking.psychologist} • {booking.date} • {booking.time}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                booking.status === "confirmed" 
                  ? "bg-green-100 text-green-700" 
                  : "bg-orange-100 text-orange-700"
              }`}>
                {booking.status === "confirmed" ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    Confirmed
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5" />
                    Pending
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
