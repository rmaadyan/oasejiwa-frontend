"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface ScheduleCalendarProps {
  sessions: Session[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export default function ScheduleCalendar({ sessions, onDateSelect, selectedDate }: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getSessionsForDate = (day: number) => {
    const dateStr = `${day} ${monthNames[month].slice(0, 3)} ${year}`;
    return sessions.filter(s => s.date === dateStr);
  };

  const formatDateForComparison = (day: number) => {
    return `${day} ${monthNames[month].slice(0, 3)} ${year}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate === formatDateForComparison(day);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const sessionsForDay = getSessionsForDate(day);
          const hasUpcoming = sessionsForDay.some(s => s.status === "upcoming");
          const hasCompleted = sessionsForDay.some(s => s.status === "completed");

          return (
            <button
              key={day}
              onClick={() => onDateSelect(formatDateForComparison(day))}
              className={`aspect-square p-2 rounded-lg text-sm transition-all relative ${
                isSelected(day)
                  ? "bg-[#2B5379] text-white font-semibold shadow-md"
                  : isToday(day)
                  ? "bg-[#D1EAFF] text-[#2B5379] font-semibold border-2 border-[#2B5379]"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="block">{day}</span>
              
              {/* Session indicators - Always show when there are sessions */}
              {sessionsForDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasUpcoming && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-white' : 'bg-blue-500'}`} />
                  )}
                  {hasCompleted && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-white' : 'bg-green-500'}`} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-200 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-600">Akan datang</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600">Selesai</span>
        </div>
      </div>
    </div>
  );
}
