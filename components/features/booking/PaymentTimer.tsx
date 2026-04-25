interface PaymentTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PaymentTimer({
  hours,
  minutes,
  seconds,
}: PaymentTimerProps) {
  const padZero = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-2xl p-4 mb-6 flex items-center gap-4 animate-fadeIn stagger-2">
      <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#92400E] font-medium">
          Selesaikan pembayaran dalam:
        </p>
        <p className="text-2xl font-bold text-[#B45309]">
          {padZero(hours)}:{padZero(minutes)}:{padZero(seconds)}
        </p>
      </div>
    </div>
  );
}
