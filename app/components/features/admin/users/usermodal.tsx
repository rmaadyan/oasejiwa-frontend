"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import type { User, UserFormData } from "@/lib/types/users";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  onDelete?: () => void;
  user?: User | null;
  mode: "create" | "edit";
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  user,
  mode,
}: UserModalProps) {
  const [role, setRole] = useState<"patient" | "psychologist">("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
    setError(null);
    setShowDeleteConfirm(false);
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setLoading(true);
    try {
      // Kirim data asli user, hanya role yang diubah
      await onSubmit({
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone || "",
        role,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Role User</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info User (read-only) */}
        <div className="px-6 pt-5 pb-2">
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <p className="text-sm">
              <span className="font-medium text-gray-600">Nama:</span>{" "}
              <span className="text-gray-900">{user.name}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-600">Email:</span>{" "}
              <span className="text-gray-900">{user.email}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-600">Gender:</span>{" "}
              <span className="text-gray-900">
                {user.gender === "male" ? "Laki-laki" : "Perempuan"}
              </span>
            </p>
          </div>
        </div>

        {/* Form — hanya role */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "patient" | "psychologist")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="patient">Pasien</option>
              <option value="psychologist">Psikolog</option>
            </select>
          </div>

          {/* Hapus User */}
          {onDelete && (
            <>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus User
                </button>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Yakin ingin menghapus user ini?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
