"use client";

interface PatientTableProps {
  data?: Array<{
    id: number | string;
    name: string;
    date: string;
    service: string;
    description?: string;
  }>;
}

export default function PatientTable({ data }: PatientTableProps) {
  const mockData = data || [
    {
      id: 1,
      name: "Budi Santoso",
      date: "28 Jan 2026",
      service: "Konseling Individu",
      description: "-",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Nama
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Layanan
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Tanggal
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Keterangan
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {mockData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.service}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {row.description || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
