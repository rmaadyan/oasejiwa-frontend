import PsychologistCard from "@/components/booking/PsychologistCard";

export interface Psychologist {
  id: string;
  name: string;
  role: string;
  specializations: string[];
  experience: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  available: boolean;
}

interface PsychologistListSectionProps {
  psychologists: Psychologist[];
  selectedPsychologist: string | null;
  onSelect: (id: string) => void;
}

export default function PsychologistListSection({
  psychologists,
  selectedPsychologist,
  onSelect,
}: PsychologistListSectionProps) {
  return (
    <>
      {/* Results Count */}
      <div className="mb-4 animate-fadeIn stagger-4">
        <p className="text-[#4B4B4B]">
          Menampilkan{" "}
          <span className="font-semibold text-[#234463]">
            {psychologists.length}
          </span>{" "}
          psikolog
        </p>
      </div>

      {/* Psychologist List */}
      <div className="space-y-4 mb-8">
        {psychologists.map((psy, index) => (
          <div
            key={psy.id}
            className="animate-fadeIn"
            style={{ animationDelay: `${(index + 5) * 0.1}s` }}
          >
            <PsychologistCard
              id={psy.id}
              name={psy.name}
              role={psy.role}
              specializations={psy.specializations}
              experience={psy.experience}
              rating={psy.rating}
              reviews={psy.reviews}
              price={psy.price}
              avatar={psy.avatar}
              available={psy.available}
              isSelected={selectedPsychologist === psy.id}
              onSelect={onSelect}
            />
          </div>
        ))}
      </div>

      {psychologists.length === 0 && (
        <div className="text-center py-12 animate-fadeIn">
          <div className="w-16 h-16 bg-[#E8F6FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#2B5379]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#234463] mb-2">
            Tidak ada psikolog ditemukan
          </h3>
          <p className="text-[#4B4B4B]">
            Coba ubah kata kunci pencarian atau filter Anda
          </p>
        </div>
      )}
    </>
  );
}
