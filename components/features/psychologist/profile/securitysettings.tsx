"use client";

import { useState } from "react";
import { changePassword } from "@/lib/api/psychologist";

export default function SecuritySettings() {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Password baru dan konfirmasi password tidak cocok");
      return;
    }
    
    if (formData.newPassword.length < 8) {
      alert("Password baru minimal 8 karakter");
      return;
    }

    setLoading(true);
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      alert("Password berhasil diubah");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah password. Pastikan password lama benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">Keamanan</h2>
        <p className="text-sm text-gray-600 mt-1">Ubah password akun Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Password Saat Ini <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => handleChange("currentPassword", e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              placeholder="Masukkan password saat ini"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("current")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#2B5379] text-xs font-medium"
            >
              {showPasswords.current ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Password Baru <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              placeholder="Minimal 8 karakter"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#2B5379] text-xs font-medium"
            >
              {showPasswords.new ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Konfirmasi Password Baru <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2B5379] focus:border-transparent outline-none"
              placeholder="Ketik ulang password baru"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#2B5379] text-xs font-medium"
            >
              {showPasswords.confirm ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="p-3 bg-[#D1EAFF] border-l-4 border-[#2B5379] rounded-lg">
          <p className="text-xs font-semibold text-[#2B5379] mb-2">Persyaratan Password:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li className={formData.newPassword.length >= 8 ? "text-green-700 font-medium" : ""}>
              {formData.newPassword.length >= 8 ? "✓" : "•"} Minimal 8 karakter
            </li>
            <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-700 font-medium" : ""}>
              {/[A-Z]/.test(formData.newPassword) ? "✓" : "•"} Minimal 1 huruf besar
            </li>
            <li className={/[0-9]/.test(formData.newPassword) ? "text-green-700 font-medium" : ""}>
              {/[0-9]/.test(formData.newPassword) ? "✓" : "•"} Minimal 1 angka
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#2B5379] rounded-lg hover:bg-[#1e3d57] transition-colors disabled:opacity-50"
          >
            {loading ? "Mengubah Password..." : "Ubah Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
