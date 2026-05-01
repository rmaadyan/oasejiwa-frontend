interface Schedule {
  time: string;
  psychologist: string;
  patient: string;
  service: string;
}

interface TodayScheduleProps {
  schedule: Schedule[];
}

export default function TodaySchedule({ schedule }: TodayScheduleProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#2B5379]">
          Jadwal Hari Ini
        </h2>

        <span className="rounded-full bg-[#D1EAFF] px-3 py-1 text-xs font-medium text-[#2B5379]">
          {schedule.length} sesi
        </span>
      </div>

      {schedule.length > 0 ? (
        <div className="space-y-3">
          {schedule.map((item, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3">
              <div className="flex gap-3">
                <div className="min-w-15 shrink-0 text-center">
                  <div className="rounded bg-[#D1EAFF] px-2 py-1 text-xs font-semibold text-[#2B5379]">
                    {item.time}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.patient}
                  </p>

                  <p className="text-xs text-gray-600">{item.service}</p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.psychologist}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-sm font-medium text-gray-600">
            Tidak ada jadwal hari ini
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Jadwal sesi hari ini akan muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
}