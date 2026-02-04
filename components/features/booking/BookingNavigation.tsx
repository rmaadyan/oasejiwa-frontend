interface BookingNavigationProps {
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
  showBackButton?: boolean;
}

export default function BookingNavigation({
  onBack,
  onNext,
  isNextDisabled = false,
  nextLabel = "Lanjutkan →",
  showBackButton = true,
}: BookingNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-6 border-t border-[#D6E6F2]">
      {showBackButton ? (
        <button
          onClick={onBack}
          className="px-6 py-3 text-[#2B5379] font-medium hover:bg-[#E8F6FF] rounded-xl transition-colors"
        >
          ← Kembali
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`
          px-8 py-3 rounded-xl font-semibold transition-all duration-300
          ${
            !isNextDisabled
              ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {nextLabel}
      </button>
    </div>
  );
}
