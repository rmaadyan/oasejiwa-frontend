'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, User } from "lucide-react"
import Navbar from "@/components/common/navbar"
import { getAllPsychologistsPublic } from "@/lib/api/psychologists"

type Psikolog = {
    id: string;
    name: string;
    avatarUrl: string | null;
    sipp: string;
    specializations: string[];
}

export default function PsikologList() {
    const router = useRouter()
    const [psikologList, setPsikologList] = useState<Psikolog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllPsychologistsPublic()
                setPsikologList(result.data)
            } catch (err: any) {
                setError(err.message || "Gagal memuat data psikolog")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    //auto edirect jika hanya ada 1 psikolog
    useEffect(() => {
        if (!isLoading && psikologList.length === 1) {
            router.push(`/psikologdetail/?id=${psikologList[0].id}`)
        }
    }, [psikologList, isLoading, router])

    const handleLihatDetail = (id: string) => {
        router.push(`/psikologdetail/?id=${id}`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500">Memuat data psikolog...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-red-500">{error}</p>
                </div>
            </div>
        )
    }

    if (psikologList.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500">Belum ada psikolog tersedia</p>
                </div>
            </div>
        )
    }

    if (psikologList.length === 1) return null

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="pt-20 pb-12 px-6 lg:px-16">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-[40px] md:text-[48px] font-semibold text-center mb-4 animate-fade-in-up">
                            <span className="text-[#000000]">Psikolog </span>
                            <span className="text-[#234463]">Kami</span>
                        </h1>
                        <p className="text-center text-[16px] md:text-[18px] text-[#4B4B4B] max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                            Tim psikolog profesional dan berpengalaman siap membantu Anda mencapai kesehatan mental yang optimal
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                    {psikologList.map((psikolog) => (
                        <div
                            key={psikolog.id}
                            className="bg-[#E8F6FF] border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    {psikolog.avatarUrl ? (
                                        <img
                                            src={psikolog.avatarUrl} 
                                            alt={psikolog.name}
                                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-lg font-bold text-[#234463] leading-tight">
                                    {psikolog.name}
                                </h2>

                                <div className="w-full space-y-3">
                                    <div className="flex items-start gap-2 text-left">
                                        <BadgeCheck className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-[#234463]">SIPP</p>
                                            <p className="text-sm text-gray-600">{psikolog.sipp}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-left">
                                        <User className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-[#234463]">Spesialisasi</p>
                                            <p className="text-sm text-gray-600">
                                                {psikolog.specializations.length > 0
                                                    ? psikolog.specializations.join(", ")
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleLihatDetail(psikolog.id)}
                                    className="w-full bg-[#234463] hover:bg-[#2B5379] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors mt-4 cursor-pointer"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}