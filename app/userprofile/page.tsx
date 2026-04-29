'use client'
import EditAddress from "@/components/features/user/profileManagement/editAddress";
import EditPersonalInformation from "@/components/features/user/profileManagement/editPersonalInfo";
import ProfileInformation from "@/components/features/user/profileManagement/profileInfo";
import { Home, Calendar, LogOut, Mail, Menu, Pencil, Phone, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, updateUserProfile } from "@/lib/api/user";
import MyBookings from "@/components/features/user/profileManagement/MyBookings";

type ProfileData = {
    fullName: string;
    gender: "MALE" | "FEMALE" | null;
    birthday: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    city: string;
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
    });

    useEffect(() => {
        async function fetchProfile() {
            try {
                setIsLoading(true);
                const data = await getMe();
                setProfileData({
                    fullName: data.profile?.name ?? "",
                    gender: data.profile?.gender ?? null,
                    birthday: data.profile?.birthday
                        ? new Date(data.profile.birthday).toISOString().split("T")[0]
                        : "",
                    email: data.email ?? "",
                    phone: data.profile?.phone ?? "",
                    address: data.profile?.fullAddress ?? "",
                    country: data.profile?.country ?? "",
                    city: data.profile?.city ?? "",
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

        // Cek apakah semua data sudah lengkap setelah save lalu redirect balik ke booking kalau ada redirectUrl
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
        setIsEditAddress(false);

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

    const handleLogout = () => {
        document.cookie = "token=; path=/; max-age=0";
        localStorage.removeItem("user");
        setTimeout(() => {
            setIsSidebarOpen(false);
            router.push('/auth/signin');
        }, 500);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-[#234463] font-medium">Memuat profil...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-600 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 py-8">
                <div className="flex items-center pb-6 sm:pb-8 relative">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#234463] flex-1 lg:text-center">
                        My Profile
                    </h1> 

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                    >
                        {isSidebarOpen ? <X size={24} className="text-[#234463]" /> : <Menu size={24} className="text-[#234463]" />}
                    </button>
                </div>

                {redirectUrl && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                        <span className="text-amber-600 text-lg">⚠️</span>
                        <div>
                            <p className="font-semibold text-amber-800 text-sm">Profil belum lengkap</p>
                            <p className="text-amber-700 text-sm mt-1">
                                Lengkapi data profil Anda terlebih dahulu untuk melanjutkan booking. 
                                Setelah semua data terisi, Anda akan otomatis diarahkan kembali.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <aside className={`
                        fixed lg:static inset-0 z-50 lg:z-auto
                        w-full lg:w-64 lg:shrink-0
                        bg-black/50 lg:bg-transparent
                        transition-opacity duration-300
                        ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <div
                            className={`
                                absolute lg:static right-0 top-0 h-full
                                w-80 lg:w-full
                                bg-white border-l lg:border lg:border-gray-200 lg:rounded-2xl shadow-xl lg:shadow
                                p-4 space-y-6
                                transform transition-transform duration-300
                                ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
                            `}
                            onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden absolute top-4 right-4 p-2"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>

                            <div className="text-center pt-8 lg:pt-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-[#234463]">
                                    <User size={48} className="sm:w-14 sm:h-14" />
                                </div>
                                <p className="mt-3 font-semibold text-[#234463] text-sm sm:text-base">{profileData.fullName || "—"}</p>
                                <p className="text-xs sm:text-sm text-gray-500 break-all px-2">{profileData.email}</p>
                            </div>

                            {/* Menu */}
                            <nav className="space-y-2 text-sm">
                                <SidebarItem
                                    icon={<Home size={16} />}     
                                    label="Dashboard"
                                    onClick={() => { router.push('/'); setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<User size={16} />}
                                    label="My Profile"
                                    active={activeTab === "profile"}
                                    onClick={() => { setActiveTab("profile"); setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<Calendar size={16} />}
                                    label="My Bookings"
                                    active={activeTab === "bookings"}
                                    onClick={() => { setActiveTab("bookings"); setIsSidebarOpen(false); }}
                                />
                                <SidebarItem
                                    icon={<LogOut size={16} />}
                                    label="Log Out"
                                    danger
                                    onClick={handleLogout}
                                />
                            </nav>
                        </div>
                    </aside>

                        <main className="flex-1 w-full">
                            {activeTab === "profile" ? (
                                <div className="max-w-3xl space-y-6">
                                    {/* Profile Information */}
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 space-y-4">
                                        <div className="flex flex-row justify-between sm:items-center gap-3">
                                            <h2 className="font-semibold text-[#234463] text-base sm:text-lg">Profile Information</h2>
                                            <button
                                                onClick={() => setIsEditPersonalInformation(true)}
                                                className="flex items-center justify-center gap-2 text-sm bg-[#234463] text-white font-semibold rounded-lg px-4 py-2 hover:bg-[#2B5379] transition cursor-pointer w-auto">
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-200" />
                                        <div className="space-y-3 sm:space-y-4">
                                            <ProfileInformation label="Full Name" value={profileData.fullName || "—"} />
                                            <ProfileInformation label="Birthday" value={profileData.birthday || "—"} icon={<Calendar size={16} />} />
                                            <ProfileInformation label="Gender" value={profileData.gender === "MALE" ? "Male" : profileData.gender === "FEMALE" ? "Female" : "-"} icon={<User size={16} />} />
                                            <ProfileInformation label="Email" value={profileData.email || "—"} icon={<Mail size={16} />} />
                                            <ProfileInformation label="Phone" value={profileData.phone || "—"} icon={<Phone size={16} />} />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 space-y-4">
                                        <div className="flex flex-row justify-between sm:items-center gap-3">
                                            <h2 className="font-semibold text-[#234463] text-base sm:text-lg">Address</h2>
                                            <button
                                                onClick={() => setIsEditAddress(true)}
                                                className="flex items-center justify-center gap-2 text-sm bg-[#234463] text-white font-semibold rounded-lg px-4 py-2 hover:bg-[#2B5379] transition cursor-pointer w-auto"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-200" />
                                        <div className="space-y-3 sm:space-y-4">
                                            <ProfileInformation label="Country" value={profileData.country || "—"} />
                                            <ProfileInformation label="City" value={profileData.city || "—"} />
                                            <ProfileInformation label="Full Address" value={profileData.address || "—"} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <MyBookings />
                            )}
                        </main>
                </div>

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

                {isEditAddress && (
                    <EditAddress
                        initialData={{ country: profileData.country, city: profileData.city, address: profileData.address }}
                        onClose={() => setIsEditAddress(false)}
                        onSave={handleSaveAddress}
                    />
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
            className={`flex items-center gap-3 px-3 py-2.5 sm:py-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-100
                ${active ? "bg-gray-100 text-[#234463] font-medium" : "text-gray-700"}
                ${danger ? "text-red-600" : ""}`}
        >
            {icon}
            {label}
        </div>
    );
}