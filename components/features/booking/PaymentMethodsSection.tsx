import PaymentMethodCard from "@/components/booking/PaymentMethodCard";

export interface PaymentMethod {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  category: "qris" | "bank" | "ewallet";
}

interface PaymentMethodsSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPayment: string | null;
  onSelectPayment: (id: string) => void;
}

export default function PaymentMethodsSection({
  paymentMethods,
  selectedPayment,
  onSelectPayment,
}: PaymentMethodsSectionProps) {
  const qrisMethods = paymentMethods.filter((p) => p.category === "qris" || p.id.toLowerCase().includes("qris"));
  const bankMethods = paymentMethods.filter((p) => p.category === "bank" && !p.id.toLowerCase().includes("qris"));

  return (
    <div className="space-y-6">
      {/* QRIS Payment Section */}
      {qrisMethods.length > 0 && (
        <div className="animate-fadeIn stagger-3">
          <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#2B5379]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            Pembayaran QRIS (Instant & Bebas Biaya)
          </h2>
          <div className="space-y-3">
            {qrisMethods.map((method, index) => (
              <div
                key={method.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <PaymentMethodCard
                  id={method.id}
                  name={method.name}
                  logo={method.logo || ""}
                  description={method.description || "Scan via GoPay, OVO, ShopeePay, Dana, BCA Mobile, Livin, dll"}
                  isSelected={selectedPayment === method.id}
                  onSelect={onSelectPayment}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      <div className="animate-fadeIn stagger-4">
        <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-[#2B5379]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Transfer Bank
        </h2>
        <div className="space-y-3">
          {bankMethods.map((method, index) => (
            <div
              key={method.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${(index + 4) * 0.1}s` }}
            >
              <PaymentMethodCard
                id={method.id}
                name={method.name}
                logo={method.logo || ""}
                description={method.description}
                isSelected={selectedPayment === method.id}
                onSelect={onSelectPayment}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
