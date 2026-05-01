import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Payment {
  id: number;
  patient: string;
  service: string;
  amount: number;
  uploadedAt: string;
  urgent: boolean;
}

interface PendingPaymentsProps {
  payments: Payment[];
  totalPendingPayments?: number;
}

export default function PendingPayments({
  payments,
  totalPendingPayments = payments.length,
}: PendingPaymentsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const displayedPayments = payments.slice(0, 3);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2B5379]">
            Pembayaran Pending
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            {totalPendingPayments} pembayaran perlu divalidasi
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="flex items-center gap-1 text-sm font-medium text-[#2B5379] hover:text-[#1e3d57]"
        >
          Validasi Semua
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {displayedPayments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {displayedPayments.map((payment) => (
            <div
              key={payment.id}
              className={`rounded-lg border-l-4 p-4 ${
                payment.urgent
                  ? "border-red-500 bg-red-50"
                  : "border-[#2B5379] bg-gray-50"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">
                    {payment.patient}
                  </p>
                  <p className="truncate text-sm text-gray-600">
                    {payment.service}
                  </p>
                </div>

                {payment.urgent && (
                  <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                    URGENT
                  </span>
                )}
              </div>

              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-lg font-bold text-[#2B5379]">
                  {formatCurrency(payment.amount)}
                </span>

                <span className="text-xs text-gray-500">
                  {payment.uploadedAt}
                </span>
              </div>

              <Link
                href={`/admin/bookings/${payment.id}`}
                className="block w-full rounded-lg bg-[#2B5379] py-2 text-center text-sm font-medium text-white transition-colors hover:bg-[#1e3d57]"
              >
                Validasi Sekarang
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-sm font-medium text-gray-600">
            Tidak ada pembayaran pending
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Pembayaran yang perlu divalidasi akan muncul di sini.
          </p>
        </div>
      )}
    </div>
  );
}