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
  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "border-2 border-[#2B5379] shadow-lg shadow-[#2B5379]/20"
            : "border border-[#D6E6F2] shadow-sm hover:shadow-md hover:border-[#2B5379]/50 hover:-translate-y-0.5"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base md:text-lg font-semibold text-[#234463] truncate">
          {name}
        </h3>
        <p className="text-sm text-[#4B4B4B] truncate">
          {role}
        </p>
      </div>

      {/* Specializations */}
      <div className="flex flex-wrap gap-2 mt-2">
        {specializations.map((specialization) => (
          <span
            key={specialization}
            className="text-xs md:text-sm font-semibold text-[#2B5379] bg-[#F5F5F5] px-2 py-1 rounded-full"
          >
            {specialization}
          </span>
        ))}
      </div>

      {/* Price & Button */}
      <div className="flex flex-col items-end gap-2">
        <p className="text-sm md:text-base font-semibold text-[#234463]">
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
