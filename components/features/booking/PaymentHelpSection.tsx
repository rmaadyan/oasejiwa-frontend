export default function PaymentHelpSection() {
  return (
    <div className="bg-[#E8F6FF] rounded-2xl p-4 flex items-center gap-4 animate-fadeIn stagger-6">
      <div className="w-10 h-10 bg-[#2B5379] rounded-full flex items-center justify-center flex-shrink-0">
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#234463] font-medium">Butuh bantuan?</p>
        <p className="text-xs text-[#4B4B4B]">
          Hubungi customer service kami di{" "}
          <a
            href="https://wa.me/6281234567890"
            className="text-[#2B5379] font-medium hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
