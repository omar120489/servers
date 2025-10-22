export type ExportColumn<Row = any> = { header: string; key: keyof Row | string; format?: (row: Row) => string | number | null | undefined; };
export function buildExportFilename(base: string, ext: string){ const d=new Date(); const stamp=[d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0'), String(d.getHours()).padStart(2,'0'), String(d.getMinutes()).padStart(2,'0')].join(''); return `${base}_${stamp}.${ext}`; }
export function formatDateForExport(v?: string|Date|null){ if(!v) return ''; const d= typeof v==='string'? new Date(v): v; if(Number.isNaN(d.getTime())) return ''; return d.toISOString().slice(0,10); }
function rows<Row>(data: Row[], cols: ExportColumn<Row>[]) { return data.map(r => cols.map(c => (c.format? c.format(r) : (r as any)[c.key]) ?? '')); }
export function exportToCSV<Row>(data: Row[], cols: ExportColumn<Row>[], filename: string){
  const header = cols.map(c=>`"${String(c.header).replace(/"/g,'""')}"`).join(',');
  const body = rows(data, cols).map(r=> r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',') );
  const csv = [header, ...body].join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(url), 1500);
}
export async function exportToXLSX<Row>(data: Row[], cols: ExportColumn<Row>[], filename: string){
  try { const XLSX = await import('xlsx'); const sheet=[cols.map(c=>c.header), ...rows(data, cols)]; const ws=XLSX.utils.aoa_to_sheet(sheet); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Sheet1'); XLSX.writeFile(wb, filename); }
  catch(e){ console.warn('xlsx not installed; falling back to CSV', e); exportToCSV(data, cols, filename.replace(/\.xlsx$/, '.csv')); }
}
export async function exportToPDF<Row>(data: Row[], cols: ExportColumn<Row>[], filename: string, title='Export'){
  try { const jsPDF = (await import('jspdf')).default; const autoTable = (await import('jspdf-autotable')).default; const doc = new jsPDF(); doc.text(title,14,16); autoTable(doc,{ startY:20, head:[cols.map(c=>c.header)], body: rows(data, cols) }); doc.save(filename); }
  catch(e){ console.warn('jspdf not installed; falling back to CSV', e); exportToCSV(data, cols, filename.replace(/\.pdf$/, '.csv')); }
}
