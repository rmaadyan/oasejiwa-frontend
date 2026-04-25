"use client";

import { ReactNode } from "react";

type BadgeVariant = "primary" | "success" | "warning" | "pending" | "danger" | "info" | "default";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pulse?: boolean;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[#2B5379]/10 text-[#2B5379]",
  success: "bg-[#22C55E]/10 text-[#22C55E]",
  warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
  pending: "bg-[#FBBF24]/10 text-[#FBBF24]",
  danger: "bg-[#EF4444]/10 text-[#EF4444]",
  info: "bg-[#3B82F6]/10 text-[#3B82F6]",
  default: "bg-gray-100 text-gray-600",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-[#2B5379]",
  success: "bg-[#22C55E]",
  warning: "bg-[#F59E0B]",
  pending: "bg-[#FBBF24]",
  danger: "bg-[#EF4444]",
  info: "bg-[#3B82F6]",
  default: "bg-gray-400",
};

export default function Badge({
  children,
  variant = "default",
  pulse = false,
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {children}
    </span>
  );
}
