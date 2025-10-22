import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn {
  field: string;
  headerName: string;
  valueFormatter?: (value: any) => string;
}

/**
 * Build filename with timestamp
 */
export function buildExportFilename(
  entity: string,
  extension: 'xlsx' | 'pdf',
  filters?: Record<string, unknown>
): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .slice(0, 16)
    .replace('T', '_')
    .replaceAll(':', '-');
  
  const filterSuffix = filters && Object.keys(filters).length > 0 ? '_filtered' : '';
  return `${entity}_${timestamp}${filterSuffix}.${extension}`;
}

/**
 * Format value for export
 */
function formatValue(value: unknown, formatter?: (value: any) => string): string {
  if (formatter) {
    return formatter(value);
  }
  
  if (value === null || value === undefined) {
    return '—';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Build export rows from data
 */
export function buildExportRows(
  data: any[],
  columns: ExportColumn[]
): Record<string, string>[] {
  return data.map((item) => {
    const row: Record<string, string> = {};
    for (const col of columns) {
      const value = item[col.field];
      row[col.headerName] = formatValue(value, col.valueFormatter);
    }
    return row;
  });
}

/**
 * Export data to XLSX
 */
export function exportToXLSX(
  data: any[],
  columns: ExportColumn[],
  filename: string
): void {
  const rows = buildExportRows(data, columns);
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(rows);
  
  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: Math.max(col.headerName.length, 15)
  }));
  ws['!cols'] = colWidths;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Save file
  XLSX.writeFile(wb, filename);
}

/**
 * Export data to PDF
 */
export function exportToPDF(
  data: any[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): void {
  const rows = buildExportRows(data, columns);
  
  // Determine orientation based on column count
  const orientation = columns.length > 6 ? 'landscape' : 'portrait';
  
  // Create PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });
  
  // Add title if provided
  if (title) {
    doc.setFontSize(16);
    doc.text(title, 14, 15);
  }
  
  // Prepare table data
  const headers = columns.map((col) => col.headerName);
  const body = rows.map((row) => headers.map((h) => row[h] || '—'));
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body,
    startY: title ? 25 : 15,
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: {
      fillColor: [33, 150, 243], // Primary blue
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 15, right: 10, bottom: 10, left: 10 }
  });
  
  // Save file
  doc.save(filename);
}

/**
 * Format currency for export
 */
export function formatCurrencyForExport(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format date for export
 */
export function formatDateForExport(value?: string | null): string {
  if (!value) return '—';
  
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

