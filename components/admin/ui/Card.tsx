"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: "primary" | "success" | "warning" | "danger" | "info";
  hoverable?: boolean;
  onClick?: () => void;
}

const accentColors = {
  primary: "border-t-[#2B5379]",
  success: "border-t-[#22C55E]",
  warning: "border-t-[#F59E0B]",
  danger: "border-t-[#EF4444]",
  info: "border-t-[#3B82F6]",
};

export default function Card({
  children,
  className = "",
  accentColor,
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl shadow-sm border border-[#D6E6F2]
        ${accentColor ? `border-t-4 ${accentColors[accentColor]}` : ""}
        ${hoverable ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
