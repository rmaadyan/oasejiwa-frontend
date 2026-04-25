'use client'
import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {BadgeCheck, GraduationCap, Stethoscope, User} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { getPsychologistByIdPublic } from "@/lib/api/psychologists";

type Schedule = {
    id: string;
    date: string;
    startTime: string;
    duration: number;
    isAvailable: boolean;
};

type PsikologDetail = {
    id: string;
    name: string;
    avatarUrl: string | null;
    about: string;
    sipp: string;
    str: string;
    educations: {
        id: string;
        degree: string;
        institution: string;
        city: string;
        startYear: number;
        endYear: number;
    }[];
    experiences: string[];
    specializations: string[];
    expertises: string[];
    schedules: Schedule[];
};

function groupSchedulesByDate(schedules: Schedule[]) {
    const map = new Map<string, Schedule[]>();
    schedules.forEach(s => {
        const dateKey = s.date.split('T')[0];
        if (!map.has(dateKey)) map.set(dateKey, []);
        map.get(dateKey)!.push(s);
    });
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }));
}

function formatDayName(dateStr: string) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date(dateStr).getDay()];
}

function formatDateShort(dateStr: string) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
}

export default function PsikologDetail(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const [psikolog, setPsikolog] = useState<PsikologDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeDay, setActiveDay] = useState(0);

    useEffect(() => {
        if (!id) {
            router.push('/psikolog');
            return;
        }
        const fetchData = async () => {
            try {
                const result = await getPsychologistByIdPublic(id);
                setPsikolog(result.data);
            } catch (err: any) {
                setError(err.message || "Gagal memuat data psikolog");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500">Memuat data psikolog...</p>
                </div>
            </div>
        );
    }

    if (error || !psikolog) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-red-500">{error || "Psikolog tidak ditemukan"}</p>
                </div>
            </div>
        );
    }

    const groupedSchedules = groupSchedulesByDate(psikolog.schedules);

    return(
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <Navbar/>
            <h1 className="text-center text-4xl font-bold text-[#234463] mt-16">Our Psikolog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl sm:border bg-white sm:border-gray-200 sm:rounded-2xl sm:shadow-lg sm:p-4 my-8 sm:mx-8">
                {/* Left */}
                <div className="p-6 md:p-8 space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start">
                        {psikolog.avatarUrl ? (
                            <img
                                src={psikolog.avatarUrl}
                                alt={psikolog.name}
                                className="w-28 h-28 rounded-full object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                                <User className="w-14 h-14 text-gray-400" />
                            </div>
                        )}
                        <div className="pt-0 lg:pt-2 text-center lg:text-left space-y-2">
                            <h2 className="text-lg font-bold text-[#234463]">
                                {psikolog.name}
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">{psikolog.about}</p>
                        </div>
                    </div>

                    {psikolog.specializations.length > 0 && (
                        <div className="flex gap-2 items-start">
                            <Stethoscope className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-[#234463] mb-1">Spesialis</p>
                                <p className="text-sm text-gray-600">
                                    {psikolog.specializations.join(', ')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex gap-2 items-start">
                            <BadgeCheck className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-[#234463]">SIPP</p>
                                <p className="text-sm text-gray-600 break-all">{psikolog.sipp}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 items-start">
                            <BadgeCheck className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-[#234463]">STR</p>
                                <p className="text-sm text-gray-600 break-all">{psikolog.str}</p>
                            </div>
                        </div>
                    </div>

                    {psikolog.educations.length > 0 && (
                        <div className="flex gap-2 items-start">
                            <GraduationCap className="w-5 h-5 text-[#234463] mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-[#234463] mb-2">Pendidikan</p>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    {psikolog.educations.map((edu) => (
                                        <li key={edu.id}>
                                            • {edu.degree} — {edu.institution}, {edu.city} ({edu.endYear})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/*Right*/}
                <div className="p-4 md:p-6">
                    <h3 className="text-lg font-semibold text-[#234463] mb-4">Jadwal Praktik</h3>

                    {groupedSchedules.length === 0 ? (
                        <p className="text-sm text-gray-500">Belum ada jadwal tersedia</p>
                    ) : (
                        <>
                            <div className="flex gap-4">
                                <div className="grid grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
                                    {groupedSchedules.map((group, index) => (
                                        <button
                                            key={group.date}
                                            onClick={() => setActiveDay(index)}
                                            className={`border rounded-md text-center px-2 py-1 cursor-pointer hover:bg-blue-100 transition
                                                ${activeDay === index ? "bg-blue-100 border-[#234463]" : "border-gray-300"}`}
                                        >
                                            <p className="text-sm font-semibold text-[#234463]">
                                                {formatDayName(group.date)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatDateShort(group.date)}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6">
                                {groupedSchedules[activeDay]?.items.map((sch) => (
                                    <div
                                        key={sch.id}
                                        className="border border-[#234463] rounded-md cursor-pointer hover:bg-blue-50 px-4 py-1 text-sm text-[#234463] font-semibold"
                                    >
                                        {sch.startTime} WIB
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {psikolog.expertises.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-[#234463] mb-2">Keahlian</h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {psikolog.expertises.map((item, index) => (
                                    <span key={index} className="border border-[#234463] rounded-full px-3 py-1 text-sm text-[#234463]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {psikolog.experiences.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-[#234463] mb-2">Pengalaman</h3>
                            <div className="flex flex-wrap gap-2">
                                {psikolog.experiences.map((item, index) => (
                                    <span key={index} className="border border-[#234463] rounded-full px-3 py-1 text-sm text-[#234463]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}