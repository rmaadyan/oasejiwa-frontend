"use client";

export default function AvailabilitySettings() {
  const workingDays = [
    { day: "Senin", available: true, hours: "09:00 - 17:00" },
    { day: "Selasa", available: true, hours: "09:00 - 17:00" },
    { day: "Rabu", available: true, hours: "09:00 - 17:00" },
    { day: "Kamis", available: true, hours: "09:00 - 17:00" },
    { day: "Jumat", available: true, hours: "09:00 - 17:00" },
    { day: "Sabtu", available: false, hours: "-" },
    { day: "Minggu", available: false, hours: "-" }
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#2B5379]">Ketersediaan</h2>
        <p className="text-sm text-gray-600 mt-1">Jadwal praktik Anda</p>
      </div>

      <div className="space-y-3">
        {workingDays.map((schedule, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${
              schedule.available 
                ? "bg-green-50 border-green-500" 
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <span className={`font-medium ${
              schedule.available ? "text-green-900" : "text-gray-600"
            }`}>
              {schedule.day}
            </span>
            
            <span className={`text-sm font-medium ${
              schedule.available ? "text-green-700" : "text-gray-500"
            }`}>
              {schedule.hours}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Info:</strong> Untuk mengubah jadwal ketersediaan, hubungi admin
        </p>
      </div>
    </div>
  );
}
