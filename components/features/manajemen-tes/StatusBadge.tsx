// components/features/manajemen-tes/StatusBadge.tsx

import { TesStatus } from "./types";

type Props = {
  status: TesStatus;
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        status === "Aktif"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}
