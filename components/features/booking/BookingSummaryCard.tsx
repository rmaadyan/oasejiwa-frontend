export interface BookingSummary {
  service: string;
  psychologist: string;
  date: string;
  time: string;
  duration: string;
  price: number;
}

interface BookingSummaryCardProps {
  summary: BookingSummary;
  selectedPayment: string | null;
  paymentMethods: { id: string; name: string }[];
  onPayClick: () => void;
}

export default function BookingSummaryCard({
  summary,
  selectedPayment,
  paymentMethods,
  onPayClick,
}: BookingSummaryCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8 animate-fadeIn stagger-5">
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Ringkasan Pesanan
      </h2>

      {/* Summary Items */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-[#4B4B4B]">Layanan</span>
          <span className="font-medium text-[#234463]">{summary.service}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B4B4B]">Psikolog</span>
          <span className="font-medium text-[#234463] text-right">
            {summary.psychologist}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B4B4B]">Tanggal</span>
          <span className="font-medium text-[#234463]">{summary.date}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B4B4B]">Waktu</span>
          <span className="font-medium text-[#234463]">{summary.time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4B4B4B]">Durasi</span>
          <span className="font-medium text-[#234463]">{summary.duration}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-[#D6E6F2] my-4" />

      {/* Total */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-[#234463]">Total</span>
        <span className="text-xl font-bold text-[#2B5379]">
          {formatPrice(summary.price)}
        </span>
      </div>

      {/* Selected Payment */}
      {selectedPayment && (
        <div className="bg-[#E8F6FF] rounded-xl p-3 mb-4 flex items-center gap-3 animate-fadeIn">
          <svg
            className="w-5 h-5 text-[#22C55E]"
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
          <span className="text-sm text-[#234463]">
            {paymentMethods.find((p) => p.id === selectedPayment)?.name}
          </span>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={onPayClick}
        disabled={!selectedPayment}
        className={`
          w-full py-3 rounded-xl font-semibold transition-all duration-300
          ${
            selectedPayment
              ? "bg-[#2B5379] text-white hover:bg-[#234463] shadow-lg hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Bayar Sekarang
      </button>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#4B4B4B]">
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Pembayaran aman & terenkripsi</span>
      </div>
    </div>
  );
}
