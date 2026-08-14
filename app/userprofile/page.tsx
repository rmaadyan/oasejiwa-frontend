'use client';

import EditAddress from "@/components/features/user/profileManagement/editAddress";
import EditPersonalInformation from "@/components/features/user/profileManagement/editPersonalInfo";
import ProfileInformation from "@/components/features/user/profileManagement/profileInfo";
import { 
  Home, 
  Calendar, 
  LogOut, 
  Mail, 
  Menu, 
  Pencil, 
  Phone, 
  User, 
  X, 
  ShieldCheck,
  Key, 
  Camera, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Save,
  MapPin,
  Sparkles,
  LayoutDashboard,
  History,
  ClipboardList,
  ArrowRight,
  HeartHandshake,
  BrainCircuit,
  FileText
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, updateUserProfile, uploadUserAvatar, changeUserPassword } from "@/lib/api/user";
import MyBookings from "@/components/features/user/profileManagement/MyBookings";
import TestHistoryTab from "@/components/features/user/profileManagement/TestHistoryTab";
import { logoutUser } from "@/lib/api/auth";
import { getImageUrl } from "@/lib/utils/getImageUrl";
import {
  ProfileProgressBar,
  QuoteOfDay,
  StatsSection,
  Separator,
} from "@/components/features/user/modernProfile";

type ProfileData = {
  fullName: string;
  gender: "MALE" | "FEMALE" | null;
  birthday: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  avatarUrl?: string;
  isEmailVerified?: boolean;
};

export default function Profile() {
  const [isEditPersonalInformation, setIsEditPersonalInformation] = useState(false);
  const [isEditAddress, setIsEditAddress] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "bookings" | "tes">("profile");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [bookingCount, setBookingCount] = useState(0);

  // State Ubah Password & Upload Foto
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRedirectUrl(params.get("redirect"));

    // 🟢 Cek apakah ada query ?tab=bookings atau ?tab=tes
    const tabParam = params.get("tab");
    if (tabParam === "bookings" || tabParam === "tes" || tabParam === "profile") {
      setActiveTab(tabParam);
    }
  }, []);

  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    gender: null,
    birthday: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    city: "",
    avatarUrl: "",
    isEmailVerified: true,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setIsLoading(true);
        const data = await getMe();
        setProfileData({
          fullName: data.profile?.name ?? data.fullName ?? "",
          gender: data.profile?.gender ?? null,
          birthday: data.profile?.birthday
            ? new Date(data.profile.birthday).toISOString().split("T")[0]
            : "",
          email: data.email ?? "",
          phone: data.profile?.phone ?? "",
          address: data.profile?.fullAddress ?? "",
          country: data.profile?.country ?? "",
          city: data.profile?.city ?? "",
          avatarUrl: data.profile?.avatarUrl ?? data.avatarUrl ?? "",
          isEmailVerified: data.isEmailVerified ?? true,
        });
      } catch (err: any) {
        if (err.message?.includes("401")) {
          localStorage.removeItem("user");
          router.push("/auth/signin");
          return;
        }
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previousAvatar = profileData.avatarUrl;
    const previewUrl = URL.createObjectURL(file);
    setProfileData((prev) => ({ ...prev, avatarUrl: previewUrl }));

    setIsUploadingPhoto(true);
    try {
      const uploadedUrl = await uploadUserAvatar(file);
      await updateUserProfile({ avatarUrl: uploadedUrl });
      setProfileData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
      alert("Foto profil berhasil diperbarui!");
    } catch (err: any) {
      setProfileData((prev) => ({ ...prev, avatarUrl: previousAvatar }));
      alert(err.message || "Gagal mengunggah foto profil.");
    } finally {
      setIsUploadingPhoto(false);
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passData.newPassword !== passData.confirmPassword) {
      alert("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }

    if (passData.newPassword.length < 6) {
      alert("Kata sandi baru minimal 6 karakter!");
      return;
    }

    setPassLoading(true);
    try {
      await changeUserPassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });

      alert("Kata sandi berhasil diubah! Silakan gunakan kata sandi baru untuk login.");
      setIsChangePasswordOpen(false);
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      alert(err.message || "Gagal mengubah kata sandi.");
    } finally {
      setPassLoading(false);
    }
  };

  const handleSavePersonalInfo = async (updatedData: {
    fullName: string;
    gender: "MALE" | "FEMALE" | null;
    birthday: string;
    email: string;
    phone: string;
  }) => {
    await updateUserProfile({
      fullName: updatedData.fullName,
      birthday: updatedData.birthday,
      gender: updatedData.gender ?? undefined,
      phone: updatedData.phone,
      email: updatedData.email,
    });
    setProfileData((prev) => ({ ...prev, ...updatedData }));
    setIsEditPersonalInformation(false);

    if (redirectUrl) {
      const currentProfile = { ...profileData, ...updatedData };
      const isNowComplete =
        currentProfile.fullName &&
        currentProfile.birthday &&
        currentProfile.gender &&
        currentProfile.country &&
        currentProfile.city &&
        currentProfile.address &&
        currentProfile.phone;

      if (isNowComplete) {
        router.push(redirectUrl);
      }
    }
  };

  const handleSaveAddress = async (data: { country: string; city: string; address: string }) => {
    await updateUserProfile({
      country: data.country,
      city: data.city,
      fullAddress: data.address,
    });
    setProfileData((prev) => ({ ...prev, ...data }));

    if (redirectUrl) {
      const currentProfile = { ...profileData, ...data };
      const isNowComplete =
        currentProfile.fullName &&
        currentProfile.birthday &&
        currentProfile.gender &&
        currentProfile.country &&
        currentProfile.city &&
        currentProfile.address &&
        currentProfile.phone;

      if (isNowComplete) {
        router.push(redirectUrl);
      }
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem("user");
    setIsSidebarOpen(false);
    router.push("/auth/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-poppins">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#234463] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#234463] font-semibold text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F3FC] font-poppins pt-20 lg:pt-24 pb-16 relative overflow-hidden">
      
      {/* Ambient Light Orbs */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-blue-300/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Bar Mobile */}
        <div className="flex items-center justify-between lg:hidden mb-4 bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
          <h1 className="text-xl font-bold text-[#234463]">Portal Pasien</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-[#234463]"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Banner Warning Profil Belum Lengkap */}
        {redirectUrl && (
          <div className="mb-6 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-md">
            <span className="text-amber-600 text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Profil belum lengkap</p>
              <p className="text-amber-700 text-sm mt-0.5">
                Lengkapi data profil Anda terlebih dahulu untuk melanjutkan booking. 
                Setelah semua data terisi, Anda akan otomatis diarahkan kembali.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* 🟢 1. SIDEBAR NAVIGASI KIRI */}
          <aside
            className={`
              lg:col-span-3 lg:sticky lg:top-24 lg:h-fit z-30
              fixed lg:static inset-0
              bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
              transition-opacity duration-300
              ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"}
            `}
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className={`
                w-72 lg:w-full bg-white border border-blue-100 rounded-2xl p-5 shadow-md
                fixed lg:static top-0 right-0 h-full lg:h-auto z-40
                transition-transform duration-300 overflow-y-auto
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
                <span className="font-bold text-[#234463] text-sm">Menu Navigasi</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400">
                  <X size={18} />
                </button>
              </div>

              {/* Header Panel */}
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#234463] uppercase tracking-wider bg-blue-50/80 rounded-xl mb-4 border border-blue-100">
                <LayoutDashboard size={15} />
                <span>Panel Pasien</span>
              </div>

              {/* Menu Navigation */}
              <nav className="space-y-1.5 text-sm">
                <SidebarItem
                  icon={<Home size={18} />}
                  label="Dashboard Utama"
                  onClick={() => {
                    router.push("/");
                    setIsSidebarOpen(false);
                  }}
                />
                <SidebarItem
                  icon={<User size={18} />}
                  label="Profil Saya"
                  active={activeTab === "profile"}
                  onClick={() => {
                    setActiveTab("profile");
                    setIsSidebarOpen(false);
                  }}
                />
                <SidebarItem
                  icon={<History size={18} />}
                  label="Riwayat Booking"
                  active={activeTab === "bookings"}
                  onClick={() => {
                    setActiveTab("bookings");
                    setIsSidebarOpen(false);
                  }}
                />
                <SidebarItem
                  icon={<ClipboardList size={18} />}
                  label="Riwayat Tes"
                  active={activeTab === "tes"}
                  onClick={() => {
                    setActiveTab("tes");
                    setIsSidebarOpen(false);
                  }}
                />
                <SidebarItem
                  icon={<Key size={18} />}
                  label="Ubah Password"
                  onClick={() => {
                    setIsChangePasswordOpen(true);
                    setIsSidebarOpen(false);
                  }}
                />

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <SidebarItem
                    icon={<LogOut size={18} />}
                    label="Keluar / Logout"
                    danger
                    onClick={handleLogout}
                  />
                </div>
              </nav>
            </div>
          </aside>

          {/* 🟢 2. KONTEN UTAMA */}
          <main className="lg:col-span-9 space-y-6 w-full">
            
            {/* PORTAL BANNER HERO HEADER (Gaya Opsi 1) */}
            <div className="bg-gradient-to-r from-[#234463] via-[#2B5379] to-[#3B6E9B] rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-[#1E3B59] relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute right-20 -bottom-10 w-36 h-36 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                
                {/* Avatar dengan Camera Badge */}
                <div className="relative shrink-0 group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/50 shadow-inner overflow-hidden flex items-center justify-center text-white font-bold text-3xl">
                    {profileData.avatarUrl ? (
                      <img
                        src={getImageUrl(profileData.avatarUrl)}
                        alt={profileData.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(profileData.fullName)
                    )}
                  </div>

                  <label
                    title="Ubah Foto Profil"
                    className="absolute -bottom-2 -right-2 bg-white text-[#234463] p-2 rounded-xl border border-blue-200 shadow-md hover:bg-blue-50 transition transform hover:scale-105 cursor-pointer"
                  >
                    <Camera size={15} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploadingPhoto}
                    />
                  </label>
                </div>

                {/* Info & Ucapan */}
                <div className="space-y-2 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-xs text-blue-100 font-medium">
                    <Sparkles size={13} className="text-amber-300" />
                    <span>Portal Pasien Oase Jiwa</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Selamat Datang, {profileData.fullName || "User Oase Jiwa"} 👋
                  </h1>

                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
                    Kelola informasi profil pribadi, jadwal sesi konseling, serta riwayat tes kesehatan mental Anda secara terpadu di sini.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-300/40 rounded-lg text-emerald-200 text-xs font-medium">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>Akun Terverifikasi</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/25 rounded-lg text-blue-100 text-xs">
                      <Mail size={13} />
                      <span>{profileData.email}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* KONTEN TAB */}
{activeTab === "profile" ? (
  <div className="space-y-6">
    
    {/* 🟢 1. PROGRESS KELENGKAPAN PROFIL (LEBAR MEMANJANG PENUH) */}
    <div className="w-full">
      <ProfileProgressBar {...profileData} />
    </div>

    {/* 🟢 2. REFLEKSI HARI INI (MEMANJANG DI BAWAH PROGRESS BAR) */}
    <div className="w-full">
      <QuoteOfDay />
    </div>

    {/* 🟢 3. CARD ACTION: BUTUH TEMAN CERITA & TES KESEHATAN MENTAL */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Card 1: Butuh Teman Cerita */}
      <div className="bg-gradient-to-br from-white to-blue-50/50 border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
        <div className="space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#234463] flex items-center justify-center">
            <HeartHandshake size={20} />
          </div>
          <h3 className="font-bold text-[#234463] text-base sm:text-lg">Butuh Teman Cerita?</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Jadwalkan sesi konseling dengan psikolog klinis profesional Oase Jiwa secara daring maupun tatap muka langsung.
          </p>
        </div>
        <div>
          <Link
            href="/layanan"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#234463] text-white rounded-xl text-xs font-semibold hover:bg-[#2B5379] transition shadow-sm active:scale-95"
          >
            <span>Lihat Layanan Konseling</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Card 2: Tes Kesehatan Mental */}
      <div className="bg-gradient-to-br from-white to-sky-50/50 border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
        <div className="space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <BrainCircuit size={20} />
          </div>
          <h3 className="font-bold text-[#234463] text-base sm:text-lg">Tes Kesehatan Mental</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Kenali kondisi stres, kecemasan, dan tingkat depresi Anda dengan instrumen tes psikologi terstandar (DASS-21).
          </p>
        </div>
        <div>
          <Link
            href="/tes"
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#234463] text-[#234463] bg-white rounded-xl text-xs font-semibold hover:bg-blue-50 transition shadow-sm active:scale-95"
          >
            <span>Mulai Tes Psikologi</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>

    <Separator />

    {/* 🟢 4. CARD INFORMASI PRIBADI */}
    <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition p-6 space-y-5">
      <div className="flex flex-row justify-between items-center gap-3">
        <div>
          <h2 className="font-bold text-[#234463] text-base sm:text-lg flex items-center gap-2">
            <User size={18} className="text-[#234463]" />
            Informasi Pribadi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola identitas diri dan kontak utama Anda
          </p>
        </div>
        <button
          onClick={() => setIsEditPersonalInformation(true)}
          className="flex items-center gap-1.5 text-xs bg-[#234463] text-white font-semibold rounded-xl px-4 py-2 hover:bg-[#2B5379] shadow-xs transition cursor-pointer"
        >
          <Pencil size={13} />
          <span>Edit</span>
        </button>
      </div>

      <div className="border-t border-slate-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ProfileInformation label="Nama Lengkap" value={profileData.fullName || "—"} />
        <ProfileInformation label="Tanggal Lahir" value={profileData.birthday || "—"} icon={<Calendar size={15} />} />
        <ProfileInformation label="Jenis Kelamin" value={profileData.gender === "MALE" ? "Laki-laki" : profileData.gender === "FEMALE" ? "Perempuan" : "—"} icon={<User size={15} />} />
        <ProfileInformation label="Alamat Email" value={profileData.email || "—"} icon={<Mail size={15} />} />
        <ProfileInformation label="Nomor Telepon / WA" value={profileData.phone || "—"} icon={<Phone size={15} />} />
      </div>
    </div>

    {/* 🟢 5. CARD ALAMAT DOMISILI */}
    <div className="bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition p-6 space-y-5">
      <div className="flex flex-row justify-between items-center gap-3">
        <div>
          <h2 className="font-bold text-[#234463] text-base sm:text-lg flex items-center gap-2">
            <MapPin size={18} className="text-teal-600" />
            Alamat Domisili
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Informasi tempat tinggal dan kota domisili Anda
          </p>
        </div>
        <button
          onClick={() => setIsEditAddress(true)}
          className="flex items-center gap-1.5 text-xs bg-teal-600 text-white font-semibold rounded-xl px-4 py-2 hover:bg-teal-700 shadow-xs transition cursor-pointer"
        >
          <Pencil size={13} />
          <span>Edit</span>
        </button>
      </div>

      <div className="border-t border-slate-100" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <ProfileInformation label="Negara" value={profileData.country || "—"} />
        <ProfileInformation label="Kota / Kabupaten" value={profileData.city || "—"} />
        <div className="md:col-span-2">
          <ProfileInformation label="Alamat Lengkap" value={profileData.address || "—"} />
        </div>
      </div>
    </div>

  </div>
) : activeTab === "bookings" ? (
  /* TAB MY BOOKINGS */
  <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-5 sm:p-6">
    <MyBookings />
  </div>
) : (
  /* TAB RIWAYAT TES */
  <TestHistoryTab />
)}

          </main>
        </div>

        {/* MODAL EDIT PERSONAL INFO */}
        {isEditPersonalInformation && (
          <EditPersonalInformation
            key={JSON.stringify({
              fullName: profileData.fullName,
              phone: profileData.phone,
              email: profileData.email,
            })}
            initialData={{
              fullName: profileData.fullName,
              gender: profileData.gender,
              birthday: profileData.birthday,
              email: profileData.email,
              phone: profileData.phone,
            }}
            onClose={() => setIsEditPersonalInformation(false)}
            onSave={handleSavePersonalInfo}
          />
        )}

        {/* MODAL EDIT ADDRESS */}
        {isEditAddress && (
          <EditAddress
            initialData={{
              country: profileData.country,
              city: profileData.city,
              address: profileData.address,
            }}
            onClose={() => setIsEditAddress(false)}
            onSave={handleSaveAddress}
          />
        )}

        {/* MODAL CHANGE PASSWORD */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-[#234463] text-base flex items-center gap-2">
                  <Key size={18} /> Ubah Kata Sandi
                </h3>
                <button
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? "text" : "password"}
                      required
                      value={passData.currentPassword}
                      onChange={(e) =>
                        setPassData({ ...passData, currentPassword: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Masukkan kata sandi lama"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                    >
                      {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      required
                      value={passData.newPassword}
                      onChange={(e) =>
                        setPassData({ ...passData, newPassword: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Minimal 6 karakter"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                    >
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    value={passData.confirmPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, confirmPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Ulangi kata sandi baru"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={passLoading}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#234463] text-white text-xs font-semibold rounded-xl hover:bg-[#2B5379] shadow-xs cursor-pointer"
                  >
                    <Save size={14} />
                    <span>{passLoading ? "Menyimpan..." : "Simpan Kata Sandi"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-medium text-xs sm:text-sm
        ${
          active
            ? "bg-[#234463] text-white font-semibold shadow-xs"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
        ${danger ? "text-red-600 hover:bg-red-50 hover:text-red-700 mt-2" : ""}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}