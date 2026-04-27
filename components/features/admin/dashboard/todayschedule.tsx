import Link from "next/link";

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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2B5379]">Jadwal Hari Ini</h2>
        <span className="text-xs font-medium text-[#2B5379] bg-[#D1EAFF] px-3 py-1 rounded-full">
          {schedule.length} sessions
        </span>
      </div>
      <div className="space-y-3">
        {schedule.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-3">
              <div className="shrink-0 text-center min-w-15">
                <div className="text-xs font-semibold text-[#2B5379] bg-[#D1EAFF] px-2 py-1 rounded">
                  {item.time}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.patient}</p>
                <p className="text-xs text-gray-600">{item.service}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.psychologist}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link 
        href="/admin/schedule"
        className="block text-center text-sm font-medium text-[#2B5379] hover:text-[#1e3d57] mt-4"
      >
        Lihat Jadwal Lengkap →
      </Link>
    </div>
  );
}
