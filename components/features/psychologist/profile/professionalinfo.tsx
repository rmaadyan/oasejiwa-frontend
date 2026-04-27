"use client";

import type { Psychologist } from "@/lib/types/psychologist";

interface ProfessionalInfoProps {
  psychologist: Psychologist;
}

export default function ProfessionalInfo({ psychologist }: ProfessionalInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">Informasi Profesional</h2>
        <p className="text-sm text-gray-600 mt-1">Kredensial dan kualifikasi</p>
      </div>

      <div className="space-y-6">
        {/* Experience */}
        <div>
          <h3 className="font-semibold text-[#2B5379] mb-2">Pengalaman</h3>
          <p className="text-gray-900 text-lg">{psychologist.experience} tahun</p>
        </div>

        {/* Specialization */}
        <div>
          <h3 className="font-semibold text-[#2B5379] mb-3">Spesialisasi</h3>
          <div className="flex flex-wrap gap-2">
            {psychologist.specialization?.map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[#D1EAFF] text-[#2B5379] text-sm font-medium rounded-md"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
<div>
  <h3 className="font-semibold text-[#2B5379] mb-2">Pendidikan</h3>

  <div className="space-y-2">
    {psychologist.education?.length ? (
      psychologist.education.map((edu: any, index: number) => (
        <div key={edu.id || index} className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-900">
            {typeof edu === "string" ? edu : edu.degree}
          </p>

          {typeof edu !== "string" && (
            <p className="text-sm text-gray-600">
              {edu.institution}
              {edu.city ? `, ${edu.city}` : ""}
              {edu.startYear && edu.endYear
                ? ` • ${edu.startYear} - ${edu.endYear}`
                : ""}
            </p>
          )}
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">Belum ada data pendidikan</p>
    )}
  </div>
</div>

        {/* Certifications */}
        <div>
          <h3 className="font-semibold text-[#2B5379] mb-3">Sertifikasi</h3>
          <ul className="space-y-2">
            {psychologist.certifications?.map((cert, index) => (
              <li key={index} className="pl-4 border-l-2 border-[#2B5379] text-gray-700">
                {cert}
              </li>
            ))}
          </ul>
        </div>

        {/* SIPP */}
        <div className="p-4 bg-[#D1EAFF] border-l-4 border-[#2B5379] rounded-lg">
          <p className="text-sm font-medium text-[#2B5379] mb-1">Nomor SIPP</p>
          <p className="text-xl font-bold text-[#2B5379]">{psychologist.sipp}</p>
        </div>
      </div>
    </div>
  );
}
