"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "@/lib/types/psychologist";

interface ScheduleCalendarProps {
  sessions: Session[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export default function ScheduleCalendar({
  sessions,
  onDateSelect,
  selectedDate,
}: ScheduleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const pad = (value: number) => String(value).padStart(2, "0");

  const toDateKey = (date?: string | Date | null) => {
    if (!date) return "";

    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());

      return `${year}-${month}-${day}`;
    }

    const rawDate = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      return rawDate;
    }

    if (/^\d{4}-\d{2}-\d{2}T/.test(rawDate)) {
      return rawDate.split("T")[0];
    }

    const parsedDate = new Date(rawDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();
    const month = pad(parsedDate.getMonth() + 1);
    const day = pad(parsedDate.getDate());

    return `${year}-${month}-${day}`;
  };

  const getCalendarDateKey = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return toDateKey(date);
  };

  const formatDisplayDate = (dateKey: string) => {
    if (!dateKey) return "-";

    const [year, month, day] = dateKey.split("-").map(Number);

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      daysInMonth: lastDay.getDate(),
      startingDayOfWeek: firstDay.getDay(),
      year,
      month,
    };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getSessionsForDate = (day: number) => {
    const dateKey = getCalendarDateKey(day);

    return sessions.filter((session) => toDateKey(session.date) === dateKey);
  };

  const isToday = (day: number) => {
    const todayKey = toDateKey(new Date());
    const dateKey = getCalendarDateKey(day);

    return todayKey === dateKey;
  };

  const isSelected = (day: number) => {
    const selectedDateKey = toDateKey(selectedDate);
    const dateKey = getCalendarDateKey(day);

    return selectedDateKey === dateKey;
  };

  const handleSelectDate = (day: number) => {
    const dateKey = getCalendarDateKey(day);

    onDateSelect(dateKey);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">
          {monthNames[month]} {year}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const sessionsForDay = getSessionsForDate(day);

          const hasUpcoming = sessionsForDay.some(
            (session) => session.status === "upcoming"
          );

          const hasCompleted = sessionsForDay.some(
            (session) => session.status === "completed"
          );

          const hasCancelled = sessionsForDay.some(
            (session) => session.status === "cancelled"
          );

          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              onClick={() => handleSelectDate(day)}
              title={formatDisplayDate(getCalendarDateKey(day))}
              type="button"
              className={`aspect-square p-2 rounded-lg text-sm transition-all relative ${
                selected
                  ? "bg-[#2B5379] text-white font-semibold shadow-md"
                  : today
                    ? "bg-[#D1EAFF] text-[#2B5379] font-semibold border-2 border-[#2B5379]"
                    : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <span className="block">{day}</span>

              {sessionsForDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {hasUpcoming && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selected ? "bg-white" : "bg-blue-500"
                      }`}
                    />
                  )}

                  {hasCompleted && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selected ? "bg-white" : "bg-green-500"
                      }`}
                    />
                  )}

                  {hasCancelled && (
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        selected ? "bg-white" : "bg-red-500"
                      }`}
                    />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-200 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-gray-600">Akan datang</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-gray-600">Selesai</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-gray-600">Dibatalkan</span>
        </div>
      </div>
    </div>
  );
}