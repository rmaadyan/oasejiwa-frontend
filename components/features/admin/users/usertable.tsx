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
  const getRoleBadge = (role: string) => {
    const styles =
      role === "psychologist"
        ? "bg-purple-100 text-purple-700"
        : "bg-[#D1EAFF] text-[#2B5379]";

    const label = role === "psychologist" ? "Psikolog" : "Pasien";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles}`}
      >
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B5379] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat data user...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email
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
                    <Eye className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">Tidak ada user ditemukan</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      {user.registeredAt && (
                        <p className="text-xs text-gray-500">
                          Bergabung {user.registeredAt}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.email}</p>
                    {user.phone && (
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    )}
                  </td>

                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {user.bookingCount || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewDetails(user)}
                        className="p-2 text-gray-600 hover:text-[#2B5379] hover:bg-[#D1EAFF] rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-gray-600 hover:text-[#2B5379] hover:bg-[#D1EAFF] rounded-lg transition-colors"
                        title="Edit User"
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