'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, User } from "lucide-react"
import Navbar from "@/components/common/navbar"

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
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-950 text-center mt-10 mb-8 sm:mb-12">
                    Psikolog Kami
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                    {psikologList.map((psikolog) => (
                        <div
                            key={psikolog.id}
                            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <img
                                        src={psikolog.photo}
                                        alt={psikolog.name}
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                                    />
                                </div>

                                <h2 className="text-lg font-bold text-blue-950 leading-tight">
                                    {psikolog.name}
                                </h2>

                                <div className="w-full space-y-3">
                                    <div className="flex items-start gap-2 text-left">
                                        <BadgeCheck className="w-5 h-5 text-blue-950 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-blue-950">
                                                Nomor Izin Praktek
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {psikolog.nomorIzin}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-left">
                                        <User className="w-5 h-5 text-blue-950 mt-0.5 shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-blue-950">
                                                Spesialisasi
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {psikolog.spesialis}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleLihatDetail(psikolog.id)}
                                    className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors mt-4 cursor-pointer"
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