'use client'
import { useState, useRef } from "react"
import {BadgeCheck, GraduationCap, Stethoscope, Calendar, ChevronLeft, ChevronRight} from "lucide-react";
import Navbar from "@/components/common/Navbar";

const scrollAmount = 150;

export default function PsikologDetail(){

    const psikolog= {
        name: "Andi Zainuddin Japri, M.Psi, Psikolog",
        photo: "/assets/psikologProfile/psikolog-Andi.png",
        spesialis: "Psikologi Klinis",
        nomorIzin: "12345678",
        pendidikan: [
            "S1 Psikologi Universitas Muhammadiyah Malang",
            "Magister Psikologi Profesi Universitas Muhammadiyah Malang (2022)",
        ],
        description: "merupakan Praktisi Psikolog dengan Peminatan Klinis lulusan Magister Psikologi Profesi Universitas Muhammadiyah Malang yang ahli dalam melakukan asesmen psikologis individu dan kelompok, serta berpengalaman dalam memberikan layanan konseling dan Psikoterapi. Dengan pendekatan ilmiah dan empatik, saya berkomitmen membantu individu menemukan makna dan keseimbangan dalam menghadapi berbagai tantangan psikologis.",
    }

    const jadwalPraktik = [
        {
            day: "Senin",
            date: "12 Jan",
            times: ["09.00 WIB", "13.00 WIB", "13.00 WIB", "13.00 WIB", "13.00 WIB"],
        },
        {
            day: "Selasa",
            date: "13 Jan",
            times: ["10.00 WIB"],
        },
        {
            day: "Rabu",
            date: "14 Jan",
            times: ["13.00 WIB"],
        },
        {
            day: "Kamis",
            date: "15 Jan",
            times: ["13.00 WIB"],
        },
        {
            day: "Jumat",
            date: "16 Jan",
            times: ["13.00 WIB"],
        },
        {
            day: "Sabtu",
            date: "17 Jan",
            times: ["14.00 WIB"],
        },
    ]

    const [activeDay, setActiveDay] = useState(0);

    const keahlian = [
        "Assessment Psikologi",
        "Konseling Psikologi",
        "Intervensi Psikologi",
        "Psikoterapi",
    ];

    const pengalamanKasus = [
        "Permasalahan Komunikasi",
        "Permasalahan Harga Diri",
        "Depresi",
        "Kecemasan",
    ];

    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return(
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Navbar/>
            <h1 className="text-center text-4xl font-bold text-blue-950 mt-16">Our Psikolog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl sm:border bg-white sm:border-gray-200 sm:rounded-2xl sm:shadow-lg sm:p-4 my-8 sm:mx-8">
                {/*Left */}
                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-2 lg:gap-6">
                        <img src={psikolog.photo} alt="Psikolog" className="w-28 h-28 rounded-full object-cover mx-auto md:mx-0"/>
                        <div className="space-y-3 pt-4">
                            <h2 className="text-lg font-bold text-blue-950 text-center md:text-start">
                                {psikolog.name}
                            </h2>
                            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                                <div className="flex gap-2">
                                    <Stethoscope className="w-5 h-5 text-blue-950 mt-1"/>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-950">
                                            Spesialis
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {psikolog.spesialis}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <BadgeCheck className="w-5 h-h text-blue-950 mt-1"/>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-950">
                                            SIPP
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {psikolog.nomorIzin}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-950"/>
                            <p className="text-sm font-semibold text-blue-950 mb-2">Pendidikan</p>
                        </div>
                        <ul className="space-y-1 pl-6 text-sm text-gray-600">
                            {psikolog.pendidikan.map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{psikolog.description}</p>
                    
                </div>

                {/*Right*/}
                <div className="p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-4">Jadwal Praktik</h3>

                    <div className="flex gap-4">
                        <div className="grid grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
                            {jadwalPraktik.map((item, index) => (
                                <button 
                                key={index} 
                                onClick={() => setActiveDay(index)}
                                className={`border rounded-md text-center px-2 py-1 cursor-pointer hover:bg-blue-100 transition
                                ${
                                    activeDay === index ? "bg-blue-100 border-blue-950" : "border-gray-300"
                                }`}>
                                        <p className="text-sm font-semibold text-blue-950">
                                            {item.day}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.date}
                                        </p>
                                </button>
                            ))}
                            <div className="border border-blue-950 rounded-md grid items-center justify-center px-2">
                                <Calendar className="w-5 h-5 text-blue-950"/>
                                <p className="text-xs font-semibold text-blue-950">Jan</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                        {jadwalPraktik[activeDay].times.map((time, index) => (
                            <div
                            key={index}
                            className="border border-blue-950 rounded-md cursor-pointer hover:bg-blue-50 px-4 py-1 text-sm text-blue-950 font-semibold"
                            >
                            {time}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-blue-950 mb-4">Keahlian</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {keahlian.map((item, index) => (
                                <span
                                key={index}
                                className="border border-blue-950 rounded-full px-3 py-1 text-sm text-blue-950"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="font-semibold text-blue-950 mb-6">Pengalaman</h3>
                        <div className="flex flex-wrap gap-2">
                            {pengalamanKasus.map((item, index) => (
                                <span
                                key={index}
                                className="border border-blue-950 rounded-full px-3 py-1 text-sm text-blue-950">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}