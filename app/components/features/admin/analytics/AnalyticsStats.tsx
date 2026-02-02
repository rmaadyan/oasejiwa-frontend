interface AnalyticsStatsProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

export default function AnalyticsStats({
  label,
  value,
  sublabel,
  icon,
  compact = false,
}: AnalyticsStatsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-600`}>
          {label}
        </span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
        {value}
      </div>
      {sublabel && (
        <div className="mt-1 text-xs text-gray-500">{sublabel}</div>
      )}
    </div>
  );
}
