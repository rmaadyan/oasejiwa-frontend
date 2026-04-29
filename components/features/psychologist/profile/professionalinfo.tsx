"use client";

import {
  Award,
  Briefcase,
  FileCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import type { Psychologist } from "@/lib/types/psychologist";

interface ProfessionalInfoProps {
  psychologist: Psychologist;
}

export default function ProfessionalInfo({
  psychologist,
}: ProfessionalInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          Informasi Profesional
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Data legal dan keahlian psikolog
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <FileCheck className="w-5 h-5 text-[#2B5379]" />
              <p className="text-sm font-semibold text-[#2B5379]">
                Nomor SIPP
              </p>
            </div>

            <p className="text-sm text-gray-700 break-words">
              {psychologist.sipp || "-"}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#2B5379]" />
              <p className="text-sm font-semibold text-[#2B5379]">
                Nomor STR
              </p>
            </div>

            <p className="text-sm text-gray-700 break-words">
              {psychologist.str || "-"}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-[#2B5379]" />
            <h3 className="font-semibold text-[#2B5379]">Spesialisasi</h3>
          </div>

          {psychologist.specialization?.length ? (
            <div className="flex flex-wrap gap-2">
              {psychologist.specialization.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="px-3 py-1 rounded-full bg-[#D1EAFF] text-[#2B5379] text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-[#2B5379]" />
            <h3 className="font-semibold text-[#2B5379]">Pendidikan</h3>
          </div>

          {psychologist.education?.length ? (
            <ul className="space-y-2">
              {psychologist.education.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="text-sm text-gray-700 p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </div>

        {psychologist.certifications?.length ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-[#2B5379]" />
              <h3 className="font-semibold text-[#2B5379]">Sertifikasi</h3>
            </div>

            <ul className="space-y-2">
              {psychologist.certifications.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="text-sm text-gray-700 p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-[#2B5379]" />
            <h3 className="font-semibold text-[#2B5379]">Pengalaman</h3>
          </div>

          {psychologist.experienceList?.length ? (
            <div className="flex flex-wrap gap-2">
              {psychologist.experienceList.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="px-3 py-1 rounded-full bg-[#D1EAFF] text-[#2B5379] text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">-</p>
          )}
        </div>
      </div>
    </div>
  );
}