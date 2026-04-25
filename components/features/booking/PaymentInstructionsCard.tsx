interface PaymentInstructionsCardProps {
  bank: string;
  amount: number;
}

export default function PaymentInstructionsCard({
  bank,
  amount,
}: PaymentInstructionsCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const instructions = [
    `Buka aplikasi mobile banking atau ATM ${bank}`,
    "Pilih menu Transfer > Virtual Account",
    "Masukkan nomor Virtual Account di atas",
    `Pastikan jumlah pembayaran adalah ${formatPrice(amount)}`,
    "Konfirmasi dan selesaikan pembayaran",
    "Simpan bukti pembayaran dan upload di bawah",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-4">
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Cara Pembayaran
      </h2>
      <div className="space-y-3">
        {instructions.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-[#2B5379] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-[#4B4B4B] text-sm pt-0.5">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
