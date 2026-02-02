"use client";

interface PatientTableProps {
  data?: Array<{
    id: string | number;
    name: string;
    email?: string;
    phone?: string;
    service: string;
    status?: "aktif" | "selesai" | "menunggu";
    date: string;
    description?: string;
  }>;
}

export default function PatientTable({ data }: PatientTableProps) {
  const mockData = data || [
    {
      id: "1",
      name: "Budi Santoso",
      email: "budi@example.com",
      phone: "+62 812 3456 7890",
      service: "Konseling",
      status: "aktif" as const,
      date: "28 Jan 2026",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      email: "siti@example.com",
      phone: "+62 812 3456 7891",
      service: "Tes Psikologi",
      status: "selesai" as const,
      date: "27 Jan 2026",
    },
    {
      id: "3",
      name: "Ahmad Wijaya",
      email: "ahmad@example.com",
      phone: "+62 812 3456 7892",
      service: "Terapi",
      status: "menunggu" as const,
      date: "26 Jan 2026",
    },
  ];

  const statusStyles: Record<string, string> = {
    aktif: "bg-green-100 text-green-800",
    selesai: "bg-blue-100 text-blue-800",
    menunggu: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Telepon
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Layanan
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Tanggal
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockData.map((row) => (
            <tr key={`${row.id}`} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.email || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.phone || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.service}</td>
              <td className="px-6 py-4 text-sm">
                {row.status ? (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[row.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
