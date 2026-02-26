'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, User, Award } from "lucide-react"
import Navbar from "@/components/common/Navbar"
import Image from "next/image"

export default function PsikologList() {
    const router = useRouter()

    const psikologList = [
        {
            id: 1,
            name: "Andi Zainuddin Japri, M. Psi, Psikolog",
            photo: "/assets/psikologProfile/psikolog-Andi.png",
            nomorIzin: "12345678",
            spesialis: "lorem ipsum",
        },
        {
            id: 2,
            name: "Andi Zainuddin Japri, M. Psi, Psikolog",
            photo: "/assets/psikologProfile/psikolog-Andi.png",
            nomorIzin: "12345678",
            spesialis: "lorem ipsum",
        },
        {
            id: 3,
            name: "Andi Zainuddin Japri, M. Psi, Psikolog",
            photo: "/assets/psikologProfile/psikolog-Andi.png",
            nomorIzin: "12345678",
            spesialis: "lorem ipsum",
        },
        {
            id: 4,
            name: "Andi Zainuddin Japri, M. Psi, Psikolog",
            photo: "/assets/psikologProfile/psikolog-Andi.png",
            nomorIzin: "12345678",
            spesialis: "lorem ipsum",
        },
    ]

    useEffect(() => {
        if (psikologList.length === 1) {
            router.push(`/psikologdetail`)
        }
    }, [psikologList, router])

    const handleLihatDetail = (id: number) => {
        router.push(`/psikologdetail`)
    }

    if (psikologList.length === 1) {
        return null
    }

    return (
        <div className="min-h-screen bg-white font-[var(--font-poppins)]">
            <Navbar />

            {/* Hero Section with Animation */}
            <section className="pt-32 pb-12 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-[40px] md:text-[48px] font-semibold text-center mb-4 animate-fade-in-up">
                        <span className="text-[#000000]">Psikolog </span>
                        <span className="text-[#234463]">Kami</span>
                    </h1>
                    <p className="text-center text-[16px] md:text-[18px] text-[#4B4B4B] max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        Tim psikolog profesional dan berpengalaman siap membantu Anda mencapai kesehatan mental yang optimal
                    </p>
                </div>
            </section>

            {/* Psychologist Cards Grid */}
            <section className="pb-20 px-6 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
                        {psikologList.map((psikolog, index) => (
                            <div
                                key={psikolog.id}
                                className={`bg-[#E8F6FF] rounded-[22px] p-7 flex flex-col items-center w-full max-w-[520px] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-gradient-to-b hover:from-[#E8F6FF] hover:to-[#d4edff] group animate-fade-in-up stagger-${index + 1}`}
                            >
                                {/* Photo with hover effect */}
                                <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#234463]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                                    <Image
                                        src={psikolog.photo}
                                        alt={psikolog.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Name */}
                                <h3 className="text-[18px] md:text-[20px] font-semibold text-[#234463] mb-2 text-center leading-tight">
                                    {psikolog.name}
                                </h3>

                                {/* Divider */}
                                <div className="w-16 h-1 bg-[#234463] rounded-full mb-6 group-hover:w-24 transition-all duration-300" />

                                {/* Info Cards */}
                                <div className="w-full space-y-4 mb-6">
                                    {/* SIPP Card */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 transition-all duration-300 hover:bg-white/80 hover:shadow-md">
                                        <div className="w-10 h-10 bg-[#234463] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <BadgeCheck className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] font-semibold text-[#234463] mb-1">
                                                Nomor SIPP
                                            </p>
                                            <p className="text-[13px] text-[#4B4B4B] font-medium">
                                                {psikolog.nomorIzin}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Specialization Card */}
                                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 transition-all duration-300 hover:bg-white/80 hover:shadow-md">
                                        <div className="w-10 h-10 bg-[#234463] rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[14px] font-semibold text-[#234463] mb-1">
                                                Spesialisasi
                                            </p>
                                            <p className="text-[13px] text-[#4B4B4B] font-medium">
                                                {psikolog.spesialis}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Button */}
                                <button
                                    onClick={() => handleLihatDetail(psikolog.id)}
                                    className="w-full bg-[#234463] hover:bg-[#2B5379] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 mt-auto hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Lihat Detail Profil
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}