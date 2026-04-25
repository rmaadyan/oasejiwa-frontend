"use client";

import Image from "next/image";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  duration: string;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

export default function ServiceCard({
  id,
  title,
  description,
  price,
  image,
  duration,
  isSelected = false,
  onSelect,
}: ServiceCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        relative bg-white rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "border-2 border-[#2B5379] shadow-lg shadow-[#2B5379]/20"
            : "border border-[#D6E6F2] shadow-sm hover:shadow-lg hover:-translate-y-1"
        }
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 z-10 w-6 h-6 bg-[#2B5379] rounded-full flex items-center justify-center animate-scaleIn">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 text-center">
        <h3 className="text-lg font-semibold text-[#234463] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[#4B4B4B] mb-2 line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-[#6B7280] mb-2">
          {duration}
        </p>
        <p className="text-sm font-medium text-[#4B4B4B] mb-4">
          Rp {price.toLocaleString("id-ID")}
        </p>
        <button
          className={`
            w-full py-3 px-6 rounded-xl font-semibold
            transition-all duration-300 active:scale-95
            ${
              isSelected
                ? "bg-[#2E8B3D] text-white"
                : "bg-[#3AB64C] text-white hover:bg-[#2E8B3D]"
            }
          `}
        >
          {isSelected ? "TERPILIH" : "DAFTAR"}
        </button>
      </div>
    </div>
  );
}
