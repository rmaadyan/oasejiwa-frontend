"use client";

interface PaymentMethodCardProps {
  id: string;
  name: string;
  logo: string;
  description?: string;
  isSelected?: boolean;
  onSelect: (id: string) => void;
}

export default function PaymentMethodCard({
  id,
  name,
  description,
  isSelected = false,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`
        flex items-center gap-4 p-4 bg-[#E8F6FF] rounded-xl cursor-pointer
        transition-all duration-300 ease-out
        ${
          isSelected
            ? "border-2 border-[#2B5379] shadow-md shadow-[#2B5379]/20"
            : "border-2 border-transparent hover:border-[#2B5379]/30"
        }
      `}
    >
      {/* Radio Circle */}
      <div
        className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-300
          ${
            isSelected
              ? "border-[#2B5379] bg-[#2B5379]"
              : "border-gray-300"
          }
        `}
      >
        {isSelected && (
          <div className="w-2 h-2 bg-white rounded-full animate-scaleIn" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-[#234463]">{name}</h3>
        {description && (
          <p className="text-sm text-[#4B4B4B]">{description}</p>
        )}
      </div>
    </div>
  );
}
