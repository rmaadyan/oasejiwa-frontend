"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CalendarDays } from "lucide-react";
import { updatePsychologistProfile, deletePsychologistSchedule, addPsychologistSchedule} from "@/lib/api/psychologist";

const DAYS_OF_WEEK = [
  { label: "Senin", dayIndex: 1 },
  { label: "Selasa", dayIndex: 2 },
  { label: "Rabu", dayIndex: 3 },
  { label: "Kamis", dayIndex: 4 },
  { label: "Jumat", dayIndex: 5 },
  { label: "Sabtu", dayIndex: 6 },
  { label: "Minggu", dayIndex: 0 },
];

function getNextDateForDay(dayName: string) {
  const targetDay = DAYS_OF_WEEK.find((d) => d.label === dayName)?.dayIndex ?? 1;
  const now = new Date();
  const currentDay = now.getUTCDay(); // ← pakai UTC

  let distance = targetDay - currentDay;
  if (distance < 0) distance += 7;
  if (distance === 0) distance = 7;

  const resultDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + distance,
    12, 0, 0 // ← tengah hari UTC
  ));

  const year = resultDate.getUTCFullYear();
  const month = String(resultDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(resultDate.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// 🟢 Helper Hitung Jam Selesai Otomatis (misal 09:00 + 60m = 10:00)
function calculateEndTime(startTime: string, durationMinutes: number) {
  if (!startTime || !startTime.includes(":")) return "10:00";
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + (Number(durationMinutes) || 60);

  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  return `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
}

export default function AvailabilitySettings({
  schedules = [],
  onUpdate,
}: {
  schedules?: any[];
  onUpdate?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [localSchedules, setLocalSchedules] = useState<any[]>([]);

useEffect(() => {
  if (Array.isArray(schedules) && schedules.length > 0) {
    setLocalSchedules([]); // ← reset dulu sebelum set baru
    const mapped = schedules.map((s) => {
      let dayName = "Senin";
  if (s.date) {
    const dateStr = String(s.date).split("T")[0];
    const dateObj = new Date(dateStr + "T12:00:00.000Z"); // ← tengah hari UTC, aman di semua timezone
    dayName =
      DAYS_OF_WEEK.find((item) => item.dayIndex === dateObj.getUTCDay())?.label || "Senin";
  }
      return {
        id: s.id || null,
        day: s.day || dayName,
        startTime: s.startTime || s.time || "09:00",
        duration: s.duration || 60,
        isAvailable: s.isAvailable ?? true,
      };
    });
    console.log("MAPPED LOCAL SCHEDULES:", mapped);
    setLocalSchedules(mapped);
  } else {
    setLocalSchedules([]);
  }
}, [schedules]);

  const addSchedule = () => {
    setLocalSchedules([
      ...localSchedules,
      {
        day: "Senin",
        startTime: "09:00",
        duration: 60,
        isAvailable: true,
      },
    ]);
  };


const handleDeleteSchedule = async (indexToDelete: number) => {
  const scheduleToDelete = localSchedules[indexToDelete];

  if (!scheduleToDelete?.id) {
    setLocalSchedules(localSchedules.filter((_, idx) => idx !== indexToDelete));
    return;
  }

  try {
    await deletePsychologistSchedule(scheduleToDelete.id);
    setLocalSchedules(localSchedules.filter((_, idx) => idx !== indexToDelete));
    if (onUpdate) await onUpdate();
  } catch (err: any) {
    alert("Gagal menghapus jadwal dari database.");
  }
};

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Hanya simpan jadwal BARU saja (yang belum punya id)
    const newSchedules = localSchedules.filter((sch) => !sch.id);

    if (newSchedules.length === 0) {
      alert("Tidak ada jadwal baru untuk disimpan.");
      setLoading(false);
      return;
    }

    for (const sch of newSchedules) {
      await addPsychologistSchedule({
        date: getNextDateForDay(sch.day),
        startTime: sch.startTime || "09:00",
        duration: Number(sch.duration) || 60,
        isAvailable: true,
      });
    }

    alert("Jadwal Mingguan Praktik berhasil disimpan!");
    if (onUpdate) await onUpdate();
  } catch (err: any) {
    alert(err.message || "Gagal menyimpan jadwal praktik.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white p-5 rounded-2xl border-2 border-slate-500 shadow-xs space-y-2 font-poppins text-xs">
      <div className="w-full bg-[#1F415F] text-white py-2 rounded-full text-center font-semibold text-xs tracking-wide mb-5">
        Jadwal Praktik Mingguan
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {localSchedules.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-medium">Belum ada hari praktik yang ditentukan.</p>
            <p className="text-slate-400 text-[11px]">Klik "Tambah Hari Praktik" di bawah.</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-3 px-4 py-2 bg-slate-100/80 rounded-xl text-slate-600 font-bold text-[11px] uppercase tracking-wider">
              <div className="col-span-3">Hari Praktik</div>
              <div className="col-span-3">Jam Mulai</div>
              <div className="col-span-3">Jam Selesai</div>
              <div className="col-span-2 text-center">Durasi</div>
              <div className="col-span-1 text-center">Aksi</div>
            </div>

            {localSchedules.map((sch, idx) => {
              const endTimeCalculated = calculateEndTime(sch.startTime, sch.duration);

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl"
                >
                  {/* Select Hari */}
                  <div className="sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">Hari</label>
                    <select
                      value={sch.day}
                      onChange={(e) => {
                        const updated = [...localSchedules];
                        updated[idx].day = e.target.value;
                        setLocalSchedules(updated);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none bg-white font-bold text-[#1F415F] cursor-pointer focus:border-[#1F415F]"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d.label} value={d.label}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Jam Mulai */}
                  <div className="sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      value={sch.startTime}
                      onChange={(e) => {
                        const updated = [...localSchedules];
                        updated[idx].startTime = e.target.value;
                        setLocalSchedules(updated);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg outline-none bg-white font-bold text-[#1F415F] cursor-pointer focus:border-[#1F415F]"
                    />
                  </div>

                  {/* Jam Selesai (Otomatis Terhitung) */}
                  <div className="sm:col-span-3">
                    <label className="sm:hidden text-[10px] font-bold text-gray-500 block mb-1">Jam Selesai</label>
                    <input
                      type="time"
                      disabled
                      value={endTimeCalculated}
                      className="w-full p-2 border border-gray-200 rounded-lg outline-none bg-slate-100 font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Durasi */}
                  <div className="sm:col-span-2 flex items-center justify-center gap-1">
                    <span className="sm:hidden text-[10px] font-bold text-gray-500">Durasi:</span>
                    <input
                      type="number"
                      value={sch.duration}
                      onChange={(e) => {
                        const updated = [...localSchedules];
                        updated[idx].duration = e.target.value;
                        setLocalSchedules(updated);
                      }}
                      className="w-14 p-2 border border-gray-300 rounded-lg outline-none bg-white text-center font-semibold text-gray-700 focus:border-[#1F415F]"
                    />
                    <span className="text-[10px] text-gray-400 font-medium">m</span>
                  </div>

                  {/* Tombol Hapus (Langsung Terhapus dari DB) */}
                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(idx)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Hapus Sesi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={addSchedule}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#1F415F] font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Hari Praktik</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-[#1F415F] text-white font-semibold rounded-xl hover:bg-[#18334b] transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? "Menyimpan..." : "Simpan Jadwal"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}