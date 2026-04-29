"use client";

import type { Psychologist } from "@/lib/types/psychologist";

interface PersonalInfoProps {
  psychologist: Psychologist;
}

export default function PersonalInfo({ psychologist }: PersonalInfoProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          Informasi Personal
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Data dasar profil psikolog
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-[#2B5379] mb-2">
            Nama Lengkap
          </p>
          <p className="text-gray-900">{psychologist.name || "-"}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#2B5379] mb-2">
            Email
          </p>
          <p className="text-gray-900">{psychologist.email || "-"}</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#2B5379] mb-2">
            Bio
          </p>
          <p className="text-gray-900 leading-relaxed">
            {psychologist.bio || "-"}
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Info:</strong> Perubahan data profil psikolog dikelola oleh
            admin.
          </p>
        </div>
      </div>
    </div>
  );
}