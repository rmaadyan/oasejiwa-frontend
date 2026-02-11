import * as XLSX from 'xlsx';

interface ExportData {
  [sheetName: string]: any[];
}

export const downloadToExcel = (data: ExportData, filename: string) => {
  // Create new workbook
  const wb = XLSX.utils.book_new();

  // Add each sheet
  Object.entries(data).forEach(([sheetName, sheetData]) => {
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Generate file and download
  XLSX.writeFile(wb, filename);
};

export const downloadToCSV = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(ws);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
