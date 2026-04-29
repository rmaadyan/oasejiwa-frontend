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
}

export default function PendingPayments({ payments }: PendingPaymentsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#2B5379]">Pembayaran Pending</h2>
          <p className="text-sm text-gray-600 mt-1">Memerlukan validasi segera</p>
        </div>
        <Link 
          href="/admin/payments" 
          className="text-sm font-medium text-[#2B5379] hover:text-[#1e3d57] flex items-center gap-1"
        >
          Validasi Semua
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {payments.map((payment) => (
          <div 
            key={payment.id} 
            className={`rounded-lg p-4 border-l-4 ${
              payment.urgent 
                ? "border-red-500 bg-red-50" 
                : "border-[#2B5379] bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{payment.patient}</p>
                <p className="text-sm text-gray-600">{payment.service}</p>
              </div>
              {payment.urgent && (
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                  URGENT
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-[#2B5379]">
                {formatCurrency(payment.amount)}
              </span>
              <span className="text-xs text-gray-500">{payment.uploadedAt}</span>
            </div>
            <Link
              href={`/admin/payments/${payment.id}`}
              className="block w-full text-center py-2 bg-[#2B5379] hover:bg-[#1e3d57] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Validasi Sekarang
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
