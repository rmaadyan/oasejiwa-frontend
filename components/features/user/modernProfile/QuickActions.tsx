'use client'

import React from 'react';
import { Pencil, Calendar, Key, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onEditProfile: () => void;
  onBooking: () => void;
  onPassword: () => void;
  onHistory: () => void;
}

export default function QuickActions({
  onEditProfile,
  onBooking,
  onPassword,
  onHistory,
}: QuickActionsProps) {
  const actions = [
    {
      icon: <Pencil size={20} />,
      label: 'Edit Profil',
      onClick: onEditProfile,
    },
    {
      icon: <Calendar size={20} />,
      label: 'Booking',
      onClick: onBooking,
    },
    {
      icon: <Key size={20} />,
      label: 'Password',
      onClick: onPassword,
    },
    {
      icon: <ArrowRight size={20} />,
      label: 'History',
      onClick: onHistory,
    },
  ];

  return (
    <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center gap-2 p-4 md:p-5 rounded-xl border border-gray-200 bg-white text-[#234463] transition-all duration-200 hover:border-[#234463] hover:shadow-md hover:bg-gray-50 active:scale-95"
          >
            <div className="text-lg md:text-xl">{action.icon}</div>
            <span className="text-xs md:text-sm font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
