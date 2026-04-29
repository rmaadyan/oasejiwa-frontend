import PaymentMethodCard from "@/components/booking/PaymentMethodCard";

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  category: "bank" | "ewallet";
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
  const bankMethods = paymentMethods.filter((p) => p.category === "bank");
  const ewalletMethods = paymentMethods.filter((p) => p.category === "ewallet");

  return (
    <div className="space-y-6">
      {/* Bank Transfer */}
      <div className="animate-fadeIn stagger-3">
        <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
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
                logo={method.logo}
                isSelected={selectedPayment === method.id}
                onSelect={onSelectPayment}
              />
            </div>
          ))}
        </div>
      </div>

      {/* E-wallet
      <div className="animate-fadeIn stagger-4">
        <h2 className="text-lg font-bold text-[#234463] mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          E-Wallet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ewalletMethods.map((method, index) => (
            <div
              key={method.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${(index + 8) * 0.1}s` }}
            >
              <PaymentMethodCard
                id={method.id}
                name={method.name}
                logo={method.logo}
                isSelected={selectedPayment === method.id}
                onSelect={onSelectPayment}
              />
            </div>
          ))}
        </div>
      </div>
      */}
      
    </div>
  );
}
