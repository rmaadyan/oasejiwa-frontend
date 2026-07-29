"use client";

import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface SessionCardProps {
  session: Session;
  onViewDetails: (session: Session) => void;
}

export default function SessionCard({ session, onViewDetails }: SessionCardProps) {
  const getStatusBadge = (statusParam?: string) => {
    // Normalisasi status ke huruf kecil agar fleksibel
    const rawStatus = String(statusParam || session?.status || '').toLowerCase();

    // Petakan status backend ke status standar
    let normalizedStatus = rawStatus;
    if (['approved', 'paid', 'success', 'confirmed'].includes(rawStatus)) {
      normalizedStatus = 'upcoming';
    }

    const styles: Record<string, { bg: string; text: string; icon: any; label: string }> = {
      upcoming: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock, label: "Akan Datang" },
      completed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle, label: "Selesai" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle, label: "Dibatalkan" },
      "no-show": { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle, label: "Tidak Hadir" },
    };

    // 🟢 FALLBACK AMAN: Jika status tidak dikenal, gunakan ikon Clock
    const badgeConfig = styles[normalizedStatus] || {
      bg: "bg-blue-100",
      text: "text-blue-700",
      icon: Clock,
      label: statusParam || "Akan Datang",
    };

    const IconComponent = badgeConfig.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badgeConfig.bg} ${badgeConfig.text}`}>
        <IconComponent className="w-3 h-3" />
        {badgeConfig.label}
      </span>
    );
  };

  const isPaid = String(session?.paymentStatus || '').toLowerCase() === 'paid' || 
                 ['approved', 'paid', 'success'].includes(String(session?.status || '').toLowerCase());

  return (
    <div 
      onClick={() => onViewDetails(session)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2B5379] hover:shadow-md transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-[#2B5379]">{session?.patientName || "Pasien"}</h3>
          <p className="text-sm text-gray-600">{session?.service || "Konseling"}</p>
        </div>
        {getStatusBadge(session?.status)}
      </div>

      {/* Time Info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div>
          {session?.time || "-"} ({session?.duration || 60} menit)
        </div>
        <span>•</span>
        <span>Sesi ke-{session?.sessionNumber || 1}</span>
      </div>

      {/* Payment Status */}
      {isPaid && (
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