'use client'

import React from 'react';

interface GreetingProps {
  name: string;
}

export default function Greeting({ name }: GreetingProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 11) {
      return { text: 'Selamat Pagi', emoji: '☀️' };
    } else if (hour >= 11 && hour < 15) {
      return { text: 'Selamat Siang', emoji: '🌤️' };
    } else if (hour >= 15 && hour < 18) {
      return { text: 'Selamat Sore', emoji: '🌅' };
    } else {
      return { text: 'Selamat Malam', emoji: '🌙' };
    }
  };

  const greeting = getGreeting();

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{greeting.emoji}</span>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#234463]">
            {greeting.text}, <span className="text-[#3B6E9B]">{name}</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Semoga harimu menyenangkan
          </p>
        </div>
      </div>
    </div>
  );
}
