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
          Data pribadi dan kontak psikolog
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Nama Lengkap
          </label>
          <p className="text-gray-900">{psychologist.name || "-"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Email
          </label>
          <p className="text-gray-900">{psychologist.email || "-"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Nomor Telepon
          </label>
          <p className="text-gray-900">{psychologist.phone || "-"}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Bio
          </label>
          <p className="text-gray-900 whitespace-pre-line">
            {psychologist.bio || "-"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#2B5379] mb-2">
            Bahasa
          </label>

          {psychologist.languages?.length ? (
            <div className="flex flex-wrap gap-2">
              {psychologist.languages.map((lang, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#D1EAFF] text-[#2B5379] text-sm font-medium rounded-md"
                >
                  {lang}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-900">-</p>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Info:</strong> Perubahan data profil psikolog dikelola oleh admin.
          </p>
        </div>
      </div>
    </div>
  );
}