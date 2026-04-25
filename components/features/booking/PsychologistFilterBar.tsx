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
    <div className="bg-[#F5F9FC] rounded-2xl p-4 shadow-sm mb-6 animate-fadeIn stagger-3">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            placeholder="Cari nama atau spesialisasi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-[#D6E6F2] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#2B5379]/20 focus:border-[#2B5379] transition-all"
          />
        </div>

        {/* Specialization Filter */}
        <div className="flex gap-2 flex-wrap">
          {specializations.slice(0, 5).map((spec) => (
            <button
              key={spec}
              onClick={() => onSpecializationChange(spec)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${
                  selectedSpecialization === spec
                    ? "bg-[#2B5379] text-white"
                    : "bg-[#E8F6FF] text-[#2B5379] hover:bg-[#2B5379]/10"
                }
              `}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
