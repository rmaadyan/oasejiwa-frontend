"use client";

import { useState, useEffect } from "react";
import { X, Award, FileText, Mail, Phone } from "lucide-react";

// 🟢 BASE URL Dinamis mengarah ke API Produksi
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.oasejiwa.id";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number | null;
  initialUser?: any;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  userId,
  initialUser,
}: UserDetailsModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialUser) {
        setUser(initialUser);
      }

      if (userId) {
        const fetchUserDetail = async () => {
          setLoading(true);
          try {
            const token = localStorage.getItem("token");
            // 🟢 Gunakan API_BASE_URL dan credentials: "include"
            const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
              credentials: "include",
              headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data);
            }
          } catch (err) {
            console.warn("API Detail User error, menggunakan data fallback dari tabel.");
          } finally {
            setLoading(false);
          }
        };

        fetchUserDetail();
      }
    } else {
      setUser(null);
    }
  }, [isOpen, userId, initialUser]);

  // ... (Sisa JSX modal ke bawah tetap sama)
  if (!isOpen) return null;

  const roleStr = String(user?.role || "").toUpperCase();
  const isPsychologist = roleStr === "PSYCHOLOGIST" || roleStr === "PSIKOLOG";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-poppins">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fadeIn">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-[#234463]">Detail User</h2>
            <p className="text-xs text-gray-500">Rincian informasi pengguna platform</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!user ? (
            <div className="py-12 text-center text-gray-400 text-sm">Data tidak ditemukan.</div>
          ) : isPsychologist ? (

            /* ================= TAMPILAN PSIKOLOG ================= */
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-blue-50/60 p-4 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-[#234463] text-white font-bold rounded-full flex items-center justify-center text-lg shrink-0">
                  {(user.fullName || user.name || "P").charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#234463]">{user.fullName || user.name || "—"}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                      Psikolog
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                      {user.status || "Aktif"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data SIPP & STR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-[#234463]" /> Nomor SIPP / SILP
                  </p>
                  <p className="text-sm font-bold text-gray-800">{user.sipp || user.psychologistDetail?.sipp || "—"}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#234463]" /> Nomor STR
                  </p>
                  <p className="text-sm font-bold text-gray-800">{user.str || user.psychologistDetail?.str || "—"}</p>
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5 text-[#234463]" /> Email
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#234463]" /> Nomor Telepon / WA
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{user.phone || "—"}</p>
                </div>
              </div>

              {/* Spesialisasi */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">Bidang Spesialisasi</p>
                <div className="flex flex-wrap gap-2">
                  {(user.specializations || user.psychologistDetail?.specializations)?.length > 0 ? (
                    (user.specializations || user.psychologistDetail?.specializations).map((spec: any, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-200 text-[#234463] text-xs font-medium rounded-lg">
                        {typeof spec === "string" ? spec : spec.name || spec.title}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Belum ada spesialisasi ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">Tentang / Bio</p>
                <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">
                  {user.about || user.psychologistDetail?.about || "Belum ada deskripsi bio."}
                </p>
              </div>
            </div>
          ) : (

            /* ================= TAMPILAN PASIEN ================= */
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[11px] font-medium text-gray-400">Total Booking</p>
                  <p className="text-lg font-bold text-gray-800 mt-0.5">{user.stats?.totalBooking || user.bookingCount || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[11px] font-medium text-gray-400">Selesai</p>
                  <p className="text-lg font-bold text-emerald-600 mt-0.5">{user.stats?.completedBooking || 0}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[11px] font-medium text-gray-400">Total Transaksi</p>
                  <p className="text-sm font-bold text-[#234463] mt-1">
                    Rp {(user.stats?.totalTransaction || 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                  <p className="text-[11px] font-medium text-gray-400">Booking Terakhir</p>
                  <p className="text-xs font-semibold text-gray-700 mt-1">{user.stats?.lastBookingDate || "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1">Nama Lengkap</p>
                  <p className="text-sm font-bold text-gray-800">{user.fullName || user.name || "—"}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1">Email</p>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1">Nomor Telepon</p>
                  <p className="text-sm font-semibold text-gray-800">{user.phone || "—"}</p>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 mb-1">Tanggal Bergabung</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.joinedDate || user.createdAt || user.registeredAt ? new Date(user.joinedDate || user.createdAt || user.registeredAt).toLocaleDateString("id-ID") : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-gray-400 font-medium">Status:</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                  Aktif
                </span>
                <span className="text-xs text-gray-400 font-medium ml-2">Role:</span>
                <span className="px-3 py-1 bg-blue-50 text-[#234463] border border-blue-200 rounded-full text-xs font-semibold">
                  Pasien
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}