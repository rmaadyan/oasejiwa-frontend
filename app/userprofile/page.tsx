'use client'
import EditAddress from "@/components/features/user/profileManagement/editAddress";
import EditPersonalInformation from "@/components/features/user/profileManagement/editPersonalInfo";
import ProfileInformation from "@/components/features/user/profileManagement/profileInfo";
import { Home, Calendar, LogOut, Mail, Menu, Pencil, Phone, User, X, ShieldCheck, Key, Camera, CheckCircle2, Eye, EyeOff, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, updateUserProfile, changeUserPassword } from "@/lib/api/user";
import MyBookings from "@/components/features/user/profileManagement/MyBookings";
import { logoutUser } from "@/lib/api/auth";

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
    const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

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
    }, []);

    const getInitials = (name: string) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    // HANDLER UPLOAD FOTO PROFIL (Lokal Preview & LocalStorage)
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64Image = reader.result as string;
            
            // Simpan preview di state & localStorage
            setProfileData((prev) => ({ ...prev, avatarUrl: base64Image }));
            localStorage.setItem("user_avatar", base64Image);
            
            alert("Foto profil berhasil diperbarui!");
        };
    };

    // 2. HANDLER GANTI PASSWORD
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
        setProfileData(prev => ({ ...prev, ...updatedData }));
        setIsEditPersonalInformation(false);

        if (redirectUrl) {
            const currentProfile = {
                ...profileData,
                ...updatedData,
            };
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
        setProfileData(prev => ({ ...prev, ...data }));

        if (redirectUrl) {
            const currentProfile = {
                ...profileData,
                ...data,
            };
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

    const handleLogout = async() => {
        await logoutUser();
        localStorage.removeItem("user");
        setIsSidebarOpen(false);
        router.push('/auth/signin');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#E8F3FC] flex items-center justify-center font-poppins">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#234463] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#234463] font-semibold text-sm">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#E8F3FC] flex items-center justify-center font-poppins">
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-lg text-center max-w-md">
                    <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
                    <p className="text-gray-600 text-sm mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-[#234463] text-white rounded-xl text-sm font-medium hover:bg-[#2B5379] transition"
                    >
                        Coba Lagi
                    </button>
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
                
                {/* Header Title */}
                <div className="flex items-center pb-6 relative">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#234463] flex-1 lg:text-center tracking-wide">
                        My Profile
                    </h1> 

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-xl bg-white border border-blue-200 shadow-sm hover:bg-blue-50 transition"
                    >
                        {isSidebarOpen ? <X size={24} className="text-[#234463]" /> : <Menu size={24} className="text-[#234463]" />}
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

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                    
                    {/* SIDEBAR NAVIGATION */}
                    <aside className={`
                        fixed lg:static inset-0 z-50 lg:z-auto
                        w-full lg:w-72 lg:shrink-0
                        bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
                        transition-opacity duration-300
                        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <div
                            className={`
                                absolute lg:static right-0 top-0 h-full
                                w-80 lg:w-full
                                bg-white border-l lg:border border-blue-100 lg:rounded-2xl shadow-xl lg:shadow-md
                                overflow-hidden
                                transform transition-transform duration-300
                                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                            `}
                            onClick={(e) => e.stopPropagation()}>
                            
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden absolute top-4 right-4 p-2 text-white z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Banner Header Sidebar */}
                            <div className="h-24 bg-gradient-to-r from-[#234463] to-[#3B6E9B] relative" />

                            {/* Info Profile User */}
                            <div className="px-6 pb-6 relative text-center -mt-12">
                                
                                {/* Initials / Foto Avatar dengan Camera Input Handler */}
                                <div className="relative inline-block group">
                                    <div className="w-22 h-22 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#234463] to-[#427BB0] border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl tracking-wider overflow-hidden">
                                        {profileData.avatarUrl ? (
                                            <img src={profileData.avatarUrl} alt={profileData.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(profileData.fullName)
                                        )}
                                    </div>

                                    <label 
                                        title="Ubah Foto Profil"
                                        className="absolute bottom-1 right-1 bg-white text-[#234463] p-2 rounded-full border border-blue-100 shadow-md hover:bg-blue-50 transition transform hover:scale-105 cursor-pointer"
                                    >
                                        <Camera size={14} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                            disabled={isUploadingPhoto}
                                        />
                                    </label>
                                </div>

                                <p className="mt-3 font-bold text-[#234463] text-base sm:text-lg">{profileData.fullName || "—"}</p>
                                <p className="text-xs text-slate-500 break-all px-2 mt-0.5">{profileData.email}</p>

                                {/* Badge Status Verifikasi Akun */}
                                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 text-xs font-medium">
                                    <CheckCircle2 size={13} className="text-emerald-600" />
                                    <span>Verified Account</span>
                                </div>

                                {/* Item Menu Sidebar */}
                                <nav className="space-y-1.5 mt-6 text-left text-sm">
                                    <SidebarItem
                                        icon={<Home size={18} />}     
                                        label="Dashboard"
                                        onClick={() => { router.push('/'); setIsSidebarOpen(false); }}
                                    />
                                    <SidebarItem
                                        icon={<User size={18} />}
                                        label="My Profile"
                                        active={activeTab === "profile"}
                                        onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}
                                    />
                                    <SidebarItem
                                        icon={<Calendar size={18} />}
                                        label="My Bookings"
                                        active={activeTab === "bookings"}
                                        onClick={() => { setActiveTab("bookings"); setIsSidebarOpen(false); }}
                                    />
                                    <SidebarItem
                                        icon={<LogOut size={18} />}
                                        label="Log Out"
                                        danger
                                        onClick={handleLogout}
                                    />
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 w-full">
                        {activeTab === "profile" ? (
                            <div className="space-y-6">
                                
                                {/* CARD 1: Profile Information */}
                                <div className="bg-white border border-blue-100/80 rounded-2xl shadow-md p-5 sm:p-7 space-y-5">
                                    <div className="flex flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <h2 className="font-bold text-[#234463] text-lg sm:text-xl flex items-center gap-2">
                                                <User size={20} className="text-[#234463]" />
                                                Profile Information
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Kelola informasi pribadi dan identitas diri Anda</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditPersonalInformation(true)}
                                            className="flex items-center justify-center gap-2 text-sm bg-[#234463] text-white font-semibold rounded-xl px-4 py-2 hover:bg-[#2B5379] shadow-sm transition cursor-pointer w-auto h-fit">
                                            <Pencil size={14} />
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                    
                                    <div className="border-t border-slate-100" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <ProfileInformation label="Full Name" value={profileData.fullName || "—"} />
                                        <ProfileInformation label="Birthday" value={profileData.birthday || "—"} icon={<Calendar size={16} />} />
                                        <ProfileInformation label="Gender" value={profileData.gender === "MALE" ? "Male" : profileData.gender === "FEMALE" ? "Female" : "—"} icon={<User size={16} />} />
                                        <ProfileInformation label="Email" value={profileData.email || "—"} icon={<Mail size={16} />} />
                                        <ProfileInformation label="Phone" value={profileData.phone || "—"} icon={<Phone size={16} />} />
                                    </div>
                                </div>

                                {/* CARD 2: Address */}
                                <div className="bg-white border border-blue-100/80 rounded-2xl shadow-md p-5 sm:p-7 space-y-5">
                                    <div className="flex flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <h2 className="font-bold text-[#234463] text-lg sm:text-xl">Address</h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Informasi domisili dan alamat lengkap</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditAddress(true)}
                                            className="flex items-center justify-center gap-2 text-sm bg-[#234463] text-white font-semibold rounded-xl px-4 py-2 hover:bg-[#2B5379] shadow-sm transition cursor-pointer w-auto h-fit"
                                        >
                                            <Pencil size={14} />
                                            <span>Edit</span>
                                        </button>
                                    </div>
                                    
                                    <div className="border-t border-slate-100" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <ProfileInformation label="Country" value={profileData.country || "—"} />
                                        <ProfileInformation label="City" value={profileData.city || "—"} />
                                        <div className="md:col-span-2">
                                            <ProfileInformation label="Full Address" value={profileData.address || "—"} />
                                        </div>
                                    </div>
                                </div>

                                {/* CARD 3: Security & Password */}
                                <div className="bg-white border border-blue-100/80 rounded-2xl shadow-md p-5 sm:p-7 space-y-5">
                                    <div className="flex flex-row justify-between sm:items-center gap-3">
                                        <div>
                                            <h2 className="font-bold text-[#234463] text-lg sm:text-xl flex items-center gap-2">
                                                <ShieldCheck size={20} className="text-[#234463]" />
                                                Account Security
                                            </h2>
                                            <p className="text-xs text-slate-500 mt-0.5">Kelola kata sandi dan keamanan akun Anda</p>
                                        </div>
                                        <button
                                            onClick={() => setIsChangePasswordOpen(true)}
                                            className="flex items-center justify-center gap-2 text-sm border border-[#234463] text-[#234463] font-semibold rounded-xl px-4 py-2 hover:bg-blue-50 shadow-xs transition cursor-pointer w-auto h-fit"
                                        >
                                            <Key size={14} />
                                            <span>Change Password</span>
                                        </button>
                                    </div>
                                    
                                    <div className="border-t border-slate-100" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <ProfileInformation label="Password" value="••••••••••••" />
                                        <ProfileInformation label="Auth Provider" value="Local / Google Account" />
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="bg-white border border-blue-100/80 rounded-2xl shadow-md p-4 sm:p-6">
                                <MyBookings />
                            </div>
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
                        initialData={{ country: profileData.country, city: profileData.city, address: profileData.address }}
                        onClose={() => setIsEditAddress(false)}
                        onSave={handleSaveAddress}
                    />
                )}

                {/* MODAL CHANGE PASSWORD */}
                {isChangePasswordOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <h3 className="font-bold text-[#234463] text-lg flex items-center gap-2">
                                    <Key size={18} /> Change Password
                                </h3>
                                <button
                                    onClick={() => setIsChangePasswordOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-sm"
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
                                            onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                                            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                                            placeholder="Masukkan kata sandi lama"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                                            className="absolute right-3 top-2.5 text-slate-400"
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
                                            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                            className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                                            placeholder="Minimal 6 karakter"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-3 top-2.5 text-slate-400"
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
                                        onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-100"
                                        placeholder="Ulangi kata sandi baru"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsChangePasswordOpen(false)}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
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
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all font-medium text-sm
                ${active 
                    ? "bg-blue-50 text-[#234463] font-semibold border border-blue-100 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                ${danger ? "text-red-600 hover:bg-red-50 hover:text-red-700 mt-2" : ""}`}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}