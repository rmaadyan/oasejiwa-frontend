type CsvValue = string | number | boolean | null | undefined | Date;

type CsvRow = Record<string, CsvValue>;

interface DownloadCsvOptions {
  delimiter?: "," | ";";
  includeBom?: boolean;
  includeExcelSeparatorHint?: boolean;
}

export function downloadToCSV(
  rows: CsvRow[],
  filename: string,
  options: DownloadCsvOptions = {}
) {
  const delimiter = options.delimiter ?? ";";
  const includeBom = options.includeBom ?? true;
  const includeExcelSeparatorHint = options.includeExcelSeparatorHint ?? true;

  if (!rows || rows.length === 0) {
    alert("Tidak ada data untuk diexport.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers.map((header) => escapeCsvValue(header)).join(delimiter),
    ...rows.map((row) =>
      headers.map((header) => escapeCsvValue(row[header])).join(delimiter)
    ),
  ];

  const separatorHint = includeExcelSeparatorHint ? `sep=${delimiter}\r\n` : "";
  const csvContent = separatorHint + csvRows.join("\r\n");

  const bom = includeBom ? "\uFEFF" : "";

  const blob = new Blob([bom + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: CsvValue) {
  if (value === null || value === undefined) {
    return '""';
  }

  let text =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value);

  text = text.replace(/\r?\n|\r/g, " ");

  const escaped = text.replace(/"/g, '""');

  return `"${escaped}"`;
}