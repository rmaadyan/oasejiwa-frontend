import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface SecondaryStatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  links?: Array<{ label: string; href: string }>;
}

export default function SecondaryStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  links
}: SecondaryStatCardProps) {
  return (
    <div className={`${gradient} rounded-xl p-6 border border-gray-200`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-3xl font-bold text-[#2B5379] mt-2">{value}</p>
          {subtitle && <p className="text-xs mt-1 text-gray-600">{subtitle}</p>}
        </div>
        <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center">
          <Icon className="h-6 w-6 text-[#2B5379]" />
        </div>
      </div>
      
      {links && (
        <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
          {links.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href}
              className="block text-xs font-medium text-[#2B5379] hover:text-[#1e3d57] transition-colors"
            >
              → {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
