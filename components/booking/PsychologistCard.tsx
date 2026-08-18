"use client";

import Image from "next/image";

interface PsychologistCardProps {
  id: string;
  name: string;
  role: string;
  specializations: string[]; // Add this line
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  available: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function PsychologistCard({
  id,
  name,
  role,
  specializations,
  experience,
  rating,
  reviews,
  price,
  avatar,
  available,
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
        flex items-start gap-4 p-4 bg-white rounded-2xl cursor-pointer
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "border-2 border-[#2B5379] shadow-lg shadow-[#2B5379]/20"
            : "border border-[#D6E6F2] shadow-sm hover:shadow-md hover:border-[#2B5379]/50 hover:-translate-y-0.5"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 mt-1">
        <Image
          src={avatar}
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
          {role}
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

      {/* Price & Button */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="text-sm md:text-base font-semibold text-[#234463] whitespace-nowrap">
          Rp {price.toLocaleString("id-ID")}
        </p>
        <button
          className={`
            px-4 py-2 rounded-xl text-sm font-semibold
            transition-all duration-300 active:scale-95
            ${
              isSelected
                ? "bg-[#2E8B3D] text-white"
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
