interface ScheduleSummaryProps {
  selectedDate: string;
  selectedScheduleId: string;
  selectedStartTime: string;     
}

export default function ScheduleSummary({
  selectedDate,
  selectedStartTime,
}: ScheduleSummaryProps) {
  return (
    <div className="mt-6 bg-[#E8F6FF] rounded-2xl p-4 flex items-center justify-between animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#2B5379] rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm text-[#4B4B4B]">Jadwal yang dipilih:</p>
          <p className="font-semibold text-[#234463]">
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long",
            })}{" "}• {selectedStartTime}
          </p>
        </div>
      </div>
    </div>
  );
}
