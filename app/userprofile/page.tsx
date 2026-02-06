'use client'
import {useState} from "react";
import {Mail, Phone, MapPin, User, Calendar, LogOut, History, Pencil, Check, Menu, X} from "lucide-react";
import ProfileInformation from "@/components/features/user/profileManagement/profileInfo";
import Navbar from "@/components//common/Navbar";
import EditPersonalInformation from "@/components/features/user/profileManagement/editPersonalInfo";
import EditAddress from "@/components/features/user/profileManagement/editAddress";
import { useRouter } from "next/navigation";


type profileData = {
    fullName: string;
    gender: "male" | "female";
    birthday: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    city: string;
};

export default function Profile(){

    const [isEditPersonalInformation, setIsEditPersonalInformation] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [currentPage, setCurrentPage] = useState<"profile" | "history">("profile");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = () => {
            setTimeout(() => {
                setIsSidebarOpen(false);
                router.push('/auth/signin')
            }, 500);
        }

    const [profileData, setProfileData] = useState<profileData>({
        fullName: "Amelia Agustin",
        gender: "female",
        birthday: "2004-02-02",
        email: "your@gmail.com",
        phone: "+62 812 xxxx xxxx",
        address: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        country: "Indonesia",
        city: "Malang",
    });

    return(
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 py-8">
                <div className="flex justify-between lg:justify-center items-center pb-6 sm:pb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-950">
                        {currentPage === "profile"? "My Profile":"History"}
                    </h1>
                    
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                    >
                        {isSidebarOpen ? <X size={24} className="text-blue-950" /> : <Menu size={24} className="text-blue-950" />}
                    </button>
                </div>

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
                                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-blue-950">
                                    <User size={48} className="sm:w-14 sm:h-14"/>
                                </div>
                                <p className="mt-3 font-semibold text-blue-950 text-sm sm:text-base">{profileData.fullName}</p>
                                <p className="text-xs sm:text-sm text-gray-500 break-all px-2">{profileData.email}</p>
                            </div>

                            {/* Menu */}
                            <nav className="space-y-2 text-sm">
                                <SidebarItem 
                                    icon={<User size={16} />} 
                                    label="My Profile" 
                                    active={currentPage === "profile"} 
                                    onClick={() => {
                                        setCurrentPage("profile");
                                        setIsSidebarOpen(false);
                                    }}
                                />
                                <SidebarItem 
                                    icon={<History size={16} />} 
                                    label="History" 
                                    active={currentPage === "history"}
                                    onClick={() => {
                                        setCurrentPage("history");
                                        setIsSidebarOpen(false);
                                    }}
                                />
                                <SidebarItem 
                                    icon={<LogOut size={16} />} 
                                    label="Log Out" 
                                    danger
                                    onClick={handleSubmit}
                                />
                            </nav>
                        </div>
                    </aside>

                    {currentPage === "profile" ? (
                        <main className="flex-1 w-full">
                            <div className="max-w-3xl space-y-6">
                                {/* Profile Information */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 space-y-4">
                                    <div className="flex flex-row justify-between sm:items-center gap-3">
                                        <h2 className="font-semibold text-blue-950 text-base sm:text-lg">Profile Information</h2>
                                        <button 
                                            onClick={() => setIsEditPersonalInformation(true)}
                                            className="flex items-center justify-center gap-2 text-sm bg-blue-900 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-800 transition cursor-pointer w-auto">
                                            <Pencil size={14}/>
                                            Edit
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-200" />
                                    <div className="space-y-3 sm:space-y-4">
                                        <ProfileInformation label="Full Name" value={profileData.fullName}/>
                                        <ProfileInformation label="Birthday" value={profileData.birthday} icon={<Calendar size={16}/>} />
                                        <ProfileInformation label="Gender" value={profileData.gender} icon={<User size={16}/>}/>
                                        <ProfileInformation label="Email" value={profileData.email} icon={<Mail size={16}/>}/>
                                        <ProfileInformation label="Phone" value={profileData.phone} icon={<Phone size={16}/>}/>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-6 space-y-4">
                                    <div className="flex flex-row justify-between sm:items-center gap-3">
                                        <h2 className="font-semibold text-blue-950 text-base sm:text-lg">Address</h2>
                                        <button 
                                            onClick={() => setIsEditAddress(true)}
                                            className="flex items-center justify-center gap-2 text-sm bg-blue-900 text-white font-semibold rounded-lg px-4 py-2 hover:bg-blue-800 transition cursor-pointer w-auto"
                                        >
                                            <Pencil size={14}/>
                                            Edit
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-200" />
                                    <div className="space-y-3 sm:space-y-4">
                                        <ProfileInformation label="Country" value={profileData.country}/>
                                        <ProfileInformation label="City" value={profileData.city}/>
                                        <ProfileInformation label="Full Address" value={profileData.address} />
                                    </div>
                                </div>
                            </div>
                        </main>
                    ) : (
                        <HistoryContent />
                    )}
                </div>

                {isEditPersonalInformation && (
                    <EditPersonalInformation
                        initialData={profileData}
                        onClose={() => setIsEditPersonalInformation(false)}
                        onSave={(updatedData) => {
                            setProfileData(updatedData);
                            setIsEditPersonalInformation(false);
                        }}
                    />
                )}

                {isEditAddress && (
                    <EditAddress
                        initialData={{
                            country: profileData.country,
                            city: profileData.city,
                            address: profileData.address,
                        }}
                        onClose={() => setIsEditAddress(false)}
                        onSave={(data) => {
                            setProfileData(prev => ({
                                ...prev,
                                country: data.country,
                                city: data.city,
                                address: data.address,
                            }));
                            setIsEditAddress(false);
                        }}
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
                ${active ? "bg-gray-100 text-blue-950 font-medium" : "text-gray-700"}
                ${danger && "text-red-600"}`}
            >
            {icon}
            {label}
        </div>
    );
}

// Komponen History
function HistoryContent() {
    const historyData = [
        { id: "1", tanggal: "14-01-2026", layanan: "Konsultasi", psikolog: "Dr. Ahmad", jadwal: "09.00 WIB" },
        { id: "2", tanggal: "14-01-2026", layanan: "Konsultasi", psikolog: "Dr. Siti", jadwal: "10.00 WIB" },
        { id: "3", tanggal: "15-01-2026", layanan: "Terapi", psikolog: "Dr. Budi", jadwal: "13.00 WIB" },
        { id: "4", tanggal: "16-01-2026", layanan: "Konsultasi", psikolog: "Dr. Rina", jadwal: "14.00 WIB" },
    ];

    return (
        <div className="flex-1 w-full">
            <div className="max-w-4xl space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow p-4 sm:p-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center w-full">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center z-10">
                                    <Check className="text-white" size={20} />
                                </div>
                                <div className="flex-1 h-1 bg-green-600 -ml-4 sm:-ml-6"></div>
                            </div>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-blue-950 text-center">Book</p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center w-full">
                                <div className="flex-1 h-1 bg-green-600 -mr-4 sm:-mr-6"></div>
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center z-10">
                                    <Check className="text-white" size={20} />
                                </div>
                                <div className="flex-1 h-1 bg-gray-200 -ml-4 sm:-ml-6"></div>
                            </div>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-blue-950 text-center">Verifikasi</p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center w-full">
                                <div className="flex-1 h-1 bg-gray-200 -mr-4 sm:-mr-6"></div>
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-10">
                                    <span className="text-sm sm:text-lg font-semibold text-gray-600">3</span>
                                </div>
                                <div className="flex-1 h-1 bg-gray-200 -ml-4 sm:-ml-6"></div>
                            </div>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-600 text-center">Konseling</p>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="relative flex items-center w-full">
                                <div className="flex-1 h-1 bg-gray-200 -mr-4 sm:-mr-6"></div>
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-10">
                                    <span className="text-sm sm:text-lg font-semibold text-gray-600">4</span>
                                </div>
                            </div>
                            <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-600 text-center">Selesai</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-4 gap-4 bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="font-semibold text-blue-950">Tanggal</div>
                            <div className="font-semibold text-blue-950">Layanan</div>
                            <div className="font-semibold text-blue-950">Psikolog</div>
                            <div className="font-semibold text-blue-950">Jadwal</div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {historyData.map((item) => (
                                <div key={item.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors">
                                    <div className="text-blue-950 text-sm">{item.tanggal}</div>
                                    <div className="text-blue-950 text-sm">{item.layanan}</div>
                                    <div className="text-blue-950 text-sm">{item.psikolog}</div>
                                    <div className="text-blue-950 text-sm">{item.jadwal}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {historyData.map((item) => (
                            <div key={item.id} className="p-4 space-y-2 hover:bg-blue-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-500">Tanggal</p>
                                        <p className="text-sm font-medium text-blue-950">{item.tanggal}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Jadwal</p>
                                        <p className="text-sm font-medium text-blue-950">{item.jadwal}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-start pt-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Layanan</p>
                                        <p className="text-sm font-medium text-blue-950">{item.layanan}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Psikolog</p>
                                        <p className="text-sm font-medium text-blue-950">{item.psikolog}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}