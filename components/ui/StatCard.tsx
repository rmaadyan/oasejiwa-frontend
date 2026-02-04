interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-[#234463]">{icon}</div>
      <div>
        <p className="text-[24px] font-semibold text-[#234463]">{value}</p>
        <p className="text-[14px] font-medium text-[#4B4B4B]">{label}</p>
      </div>
    </div>
  );
}
