// components/features/manajemen-tes/StatusBadge.tsx

import { TesStatus } from "./types";

type Props = {
  status: TesStatus;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide border ${status === "Aktif"
          ? "bg-emerald-50 text-emerald-600 border-emerald-100/50"
          : "bg-gray-50 text-gray-600 border-gray-200"
        }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === "Aktif" ? "bg-emerald-500" : "bg-gray-400"}`}></span>
      {status}
    </span>
  );
}
