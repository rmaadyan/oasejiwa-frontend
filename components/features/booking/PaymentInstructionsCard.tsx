interface PaymentInstructionsCardProps {
  bank: string;
  amount: number;
}

export default function PaymentInstructionsCard({
  bank,
  amount,
}: PaymentInstructionsCardProps) {
  const isQris = bank.toLowerCase().includes("qris");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const qrisInstructions = [
    "Buka aplikasi e-wallet (GoPay, OVO, ShopeePay, Dana) atau M-Banking pilihan Anda.",
    "Pilih menu 'Scan' atau 'Pay QRIS'.",
    "Arahkan kamera smartphone ke kode QRIS OASE JIWA KLINIK di atas.",
    `Masukkan atau pastikan nominal pembayaran adalah ${formatPrice(amount)}.`,
    "Selesaikan pembayaran dan simpan tangkapan layar (screenshot) bukti transaksi.",
    "Unggah (upload) bukti pembayaran pada kolom di bawah ini untuk konfirmasi.",
  ];

  const bankInstructions = [
    `Buka aplikasi mobile banking atau ATM ${bank}`,
    "Pilih menu Transfer",
    "Masukkan nomor rekening di atas",
    `Pastikan jumlah pembayaran adalah ${formatPrice(amount)}`,
    "Konfirmasi dan selesaikan pembayaran",
    "Simpan bukti pembayaran dan upload di bawah",
  ];

  const instructions = isQris ? qrisInstructions : bankInstructions;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 animate-fadeIn stagger-4">
      <h2 className="text-lg font-bold text-[#234463] mb-4">
        Cara Pembayaran {isQris ? "via QRIS" : ""}
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
