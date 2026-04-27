import Image from "next/image";
import {
  GraduationCap,
  FileBadge,
  Brain,
  Calendar,
} from "lucide-react";
import { DateOption, RawSchedule } from "@/lib/booking-data";

export interface PsychologistProfile {
  id: string;
  name: string;
  avatar: string;
  education: string[];
  licenseNumber: string;
  specialization: string;
  bio: string;
  expertise: string[];
  caseExperience: string[];
}

interface ScheduleSectionProps {
  psychologist: PsychologistProfile;
  dates: DateOption[];
  rawSchedules: RawSchedule[]; 
  selectedDate: string | null;
  selectedScheduleId: string | null;
  onDateSelect: (date: string) => void;
  onScheduleSelect: (id: string) => void; 
}

export default function ScheduleSection({
  psychologist,
  dates,
  rawSchedules,   
  selectedDate,
  selectedScheduleId,
  onDateSelect,
  onScheduleSelect,
}: ScheduleSectionProps) {

  const availableSlots = rawSchedules.filter(
    (s) => s.date.split('T')[0] === selectedDate && s.isAvailable
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fadeIn stagger-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Psychologist Profile (1/3) */}
        <div className="lg:col-span-1 lg:border-r lg:border-gray-200 lg:pr-8">
          {/* Avatar */}
          <div className="flex flex-col items-center lg:items-start mb-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-[#E8F6FF]">
              <Image
                src={psychologist.avatar}
                alt={psychologist.name}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    psychologist.name
                  )}&background=2B5379&color=fff&size=128`;
                }}
              />
            </div>
            <h2 className="text-lg font-bold text-slate-800 text-center lg:text-left">
              {psychologist.name}
            </h2>
          </div>

          {/* Info Sections */}
          <div className="space-y-5">
            {/* Education */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#2B5379]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Pendidikan
                </h3>
                <ul className="space-y-1">
                  {psychologist.education.map((edu, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-500 leading-relaxed"
                    >
                      {edu}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* License Number */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                <FileBadge className="w-5 h-5 text-[#2B5379]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Nomor Izin Praktek
                </h3>
                <p className="text-sm text-slate-500">
                  {psychologist.licenseNumber}
                </p>
              </div>
            </div>

            {/* Specialization */}
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-[#E8F6FF] rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#2B5379]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  Spesialisasi
                </h3>
                <p className="text-sm text-slate-500">
                  {psychologist.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-sm text-slate-500 leading-relaxed text-justify">
              {psychologist.bio}
            </p>
          </div>
        </div>

        {/* Right Column - Schedule & Competencies (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section A: Date Picker */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">
              Jadwal Praktek
            </h3>
            <div className="flex items-center gap-2">
              {/* Date Cards - Horizontal Scroll */}
              <div className="flex-1 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                  {dates.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => onDateSelect(date.value)}
                      className={`flex flex-col items-center justify-center p-2 min-w-[80px] rounded-lg border transition-all duration-200
                        ${selectedDate === date.value
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          selectedDate === date.value
                            ? "text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {date.dayName}
                      </span>
                      <span
                        className={`text-sm ${
                          selectedDate === date.value
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      >
                        {date.dayNum} {date.month}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Calendar Icon Button */}
              <button className="flex-shrink-0 w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Calendar className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Section B: Time Slots */}
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-4">Pilih Waktu</h3>
            {!selectedDate ? (
              <p className="text-sm text-gray-400">Pilih tanggal terlebih dahulu.</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-gray-400">Tidak ada slot tersedia pada tanggal ini.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onScheduleSelect(slot.id)}
                    className={`px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                      ${selectedScheduleId === slot.id
                        ? "bg-[#2B5379] text-white shadow-md"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {slot.startTime}
                    <span className="text-xs block opacity-75">{slot.duration} mnt</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section C: Competency Tags */}
          <div className="space-y-5">
            {/* Keahlian */}
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">
                Keahlian
              </h3>
              <div className="flex flex-wrap gap-2">
                {psychologist.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Pengalaman Kasus */}
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-3">
                Pengalaman Kasus
              </h3>
              <div className="flex flex-wrap gap-2">
                {psychologist.caseExperience.map((experience, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 rounded-full border border-gray-300 text-gray-600 text-sm"
                  >
                    {experience}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
