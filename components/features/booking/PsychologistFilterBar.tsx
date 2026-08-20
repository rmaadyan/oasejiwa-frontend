interface PsychologistFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSpecialization: string;
  onSpecializationChange: (value: string) => void;
  specializations: string[];
}

export default function PsychologistFilterBar({
  searchQuery,
  onSearchChange,
  selectedSpecialization,
  onSpecializationChange,
  specializations,
}: PsychologistFilterBarProps) {
  return (
    <div className="bg-[#F5F9FC] border border-[#D6E6F2] rounded-2xl p-4 md:p-5 shadow-xs mb-6 animate-fadeIn stagger-3 space-y-3.5">
      {/* Search Input - Full width */}
      <div className="w-full relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2B5379]/60 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Cari nama atau spesialisasi psikolog..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 text-sm md:text-base text-[#234463] placeholder:text-gray-400 bg-white border border-[#D6E6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-[#234463] hover:bg-gray-100 transition-all cursor-pointer"
            title="Hapus pencarian"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Specialization Filter */}
      {specializations && specializations.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center pt-1">
          {specializations.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => onSpecializationChange(spec)}
              className={`
                px-3.5 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer
                ${
                  selectedSpecialization === spec
                    ? "bg-[#234463] text-white shadow-xs"
                    : "bg-white text-[#2B5379] border border-[#D6E6F2] hover:bg-[#E8F6FF] hover:border-[#2B5379]/40"
                }
              `}
            >
              {spec}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
