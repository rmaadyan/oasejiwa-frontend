"use client";

import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface SessionCardProps {
  session: Session;
  onViewDetails: (session: Session) => void;
}

export default function SessionCard({ session, onViewDetails }: SessionCardProps) {
  const getStatusBadge = () => {
    const styles = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
      completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
      "no-show": { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle }
    };

    const style = styles[session.status];
    const Icon = style.icon;

    const labels = {
      upcoming: "Akan Datang",
      completed: "Selesai",
      cancelled: "Dibatalkan",
      "no-show": "Tidak Hadir"
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3" />
        {labels[session.status]}
      </span>
    );
  };

  return (
    <div 
      onClick={() => onViewDetails(session)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2B5379] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#2B5379]">{session.patientName}</h3>
          <p className="text-sm text-gray-600">{session.service}</p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Time Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div>
          {session.time} ({session.duration} menit)
        </div>
        <span>•</span>
        <span>Sesi ke-{session.sessionNumber}</span>
      </div>

      {/* Payment Status */}
      {session.status === "upcoming" && session.paymentStatus === "paid" && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-xs text-green-600">
            <CheckCircle className="w-3 h-3" />
            Lunas
          </span>
        </div>
      )}
    </div>
  );
}
