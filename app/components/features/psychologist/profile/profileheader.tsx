"use client";

import { User } from "lucide-react";
import type { Psychologist } from "@/lib/types/psychologist";

interface ProfileHeaderProps {
  psychologist: Psychologist;
}

export default function ProfileHeader({ psychologist }: ProfileHeaderProps) {
  return (
    <div className="bg-[#D1EAFF] rounded-xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Photo - Read Only */}
        <div className="w-32 h-32 bg-[#2B5379]/10 rounded-full flex items-center justify-center overflow-hidden">
          {psychologist.photo ? (
            <img 
              src={psychologist.photo} 
              alt={psychologist.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-[#2B5379]" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#2B5379] mb-2">{psychologist.name}</h1>
          <p className="text-gray-700 mb-4">{psychologist.email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
            <div className="px-4 py-2 bg-white rounded-lg text-gray-700">
              <span className="font-medium">SIPP:</span> {psychologist.sipp}
            </div>
            <div className="px-4 py-2 bg-white rounded-lg text-gray-700">
              <span className="font-medium">Bergabung:</span> {psychologist.joinedDate}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-6 py-3 rounded-lg font-medium ${
          psychologist.status === "active" 
            ? "bg-[#2B5379] text-white" 
            : "bg-gray-500 text-white"
        }`}>
          {psychologist.status === "active" ? "Aktif" : "Tidak Aktif"}
        </div>
      </div>
    </div>
  );
}
