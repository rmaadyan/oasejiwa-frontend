'use client'

import React from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';

interface WelcomeCardProps {
  memberSince?: string;
  name: string;
}

export default function WelcomeCard({ memberSince, name }: WelcomeCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const isNewMember = () => {
    if (!memberSince) return true;
    
    try {
      const joinDate = new Date(memberSince);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return joinDate > thirtyDaysAgo;
    } catch {
      return false;
    }
  };

  if (!isNewMember() || !isVisible) return null;

  return (
    <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm">
        {/* Subtle decorative element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#234463]/5 rounded-full blur-2xl" />
        
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition z-10"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="relative z-10 flex gap-4">
          <div className="text-2xl flex-shrink-0">👋</div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#234463] text-base mb-1">
              Selamat Datang di OaseJiwa, {name}!
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Terima kasih telah bergabung dengan kami. Kami senang memiliki Anda di sini. Jangan ragu untuk menghubungi psikolog profesional kami kapan saja Anda membutuhkan dukungan kesehatan mental.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
