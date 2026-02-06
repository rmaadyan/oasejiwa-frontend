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
    <div className={`${gradient} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-70">{subtitle}</p>}
        </div>
        <Icon className="h-10 w-10 opacity-80" />
      </div>
      
      {links && (
        <div className="space-y-2 mt-3">
          {links.map((link, idx) => (
            <Link 
              key={idx}
              href={link.href}
              className="block text-xs font-medium hover:opacity-70 transition-opacity"
            >
              → {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
