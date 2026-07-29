"use client";

import { Edit2, Eye } from "lucide-react";
import type { User as UserType } from "@/lib/types/users";

interface UserTableProps {
  users: UserType[];
  onEdit: (user: UserType) => void;
  onViewDetails: (user: UserType) => void;
  loading?: boolean;
}

export default function UserTable({
  users,
  onEdit,
  onViewDetails,
  loading = false,
}: UserTableProps) {
  
  // 🟢 Penyesuaian pengecekan role agar fleksibel terhadap huruf besar/kecil dari backend
  const getRoleBadge = (role: string) => {
    const roleUpper = String(role || "").toUpperCase();
    const isPsychologist = roleUpper === "PSYCHOLOGIST" || roleUpper === "PSIKOLOG";

    const styles = isPsychologist
      ? "bg-purple-100 text-purple-700 border border-purple-200"
      : "bg-[#D1EAFF] text-[#2B5379] border border-blue-200";

    const label = isPsychologist ? "Psikolog" : "Pasien";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B5379] mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm font-medium">Memuat data user...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden font-poppins">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email / Kontak
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Eye className="w-10 h-10 text-gray-300" />
                    <p className="text-gray-500 text-sm">Tidak ada user ditemukan</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  {/* Nama User */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {user.name || user.fullName || "—"}
                      </p>
                      {(user.registeredAt || user.createdAt) && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Bergabung {user.registeredAt || new Date(user.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Email & No Telepon */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{user.email}</p>
                    {user.phone && user.phone !== "-" && (
                      <p className="text-xs text-gray-500 mt-0.5">{user.phone}</p>
                    )}
                  </td>

                  {/* Role Badge */}
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                  {/* Jumlah Booking */}
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {user.bookingCount || user.stats?.totalBooking || 0}
                    </span>
                  </td>

                  {/* Tombol Aksi (Mata = Detail Modal, Pensil = Edit Modal) */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(user)}
                        className="p-2 text-gray-500 hover:text-[#2B5379] hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Lihat Detail User"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-gray-500 hover:text-[#2B5379] hover:bg-blue-50 rounded-xl transition cursor-pointer"
                        title="Edit Role User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}