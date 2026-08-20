"use client";

import Image from "next/image";

interface PsychologistCardProps {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  experience?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  avatar: string;
  available?: boolean;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

export default function PsychologistCard({
  id,
  name,
  role,
  specializations = [],
  avatar,
  isSelected = false,
  onSelect,
}: PsychologistCardProps) {
  const MAX_VISIBLE_SPECIALIZATIONS = 3;
  const visibleSpecs = specializations.slice(0, MAX_VISIBLE_SPECIALIZATIONS);
  const remainingCount = specializations.length - MAX_VISIBLE_SPECIALIZATIONS;

  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "border-2 border-[#2B5379] shadow-lg shadow-[#2B5379]/20 bg-blue-50/20"
            : "border border-[#D6E6F2] shadow-sm hover:shadow-md hover:border-[#2B5379]/50 hover:-translate-y-0.5"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={avatar || "/assets/default-avatar.png"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info + Specializations */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-[#234463] truncate">
          {name}
        </h3>
        <p className="text-sm text-[#4B4B4B] truncate">
          {role || "Psikolog Oase Jiwa"}
        </p>

        {/* Specializations */}
        {specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {visibleSpecs.map((specialization) => (
              <span
                key={specialization}
                className="text-xs font-semibold text-[#2B5379] bg-[#EDF4FA] px-2.5 py-1 rounded-full"
              >
                {specialization}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs font-semibold text-[#6B8CAE] bg-[#F0F0F0] px-2.5 py-1 rounded-full">
                +{remainingCount} lainnya
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tombol Pilih (Teks Rp 0 Dihilangkan) */}
      <div className="flex items-center justify-end flex-shrink-0 ml-2">
        <button
          type="button"
          className={`
            px-5 py-2.5 rounded-xl text-sm font-semibold
            transition-all duration-300 active:scale-95 cursor-pointer shadow-xs
            ${
              isSelected
                ? "bg-[#2E8B3D] text-white shadow-md ring-2 ring-emerald-300"
                : "bg-[#3AB64C] text-white hover:bg-[#2E8B3D]"
            }
          `}
        >
          {isSelected ? "Terpilih" : "Pilih"}
        </button>
      </div>
    </div>
  );
}