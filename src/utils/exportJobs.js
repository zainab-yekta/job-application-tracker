import { formatDisplayDate } from './formatDate';

const COLUMNS = [
  { header: 'Title', key: 'title', width: 24 },
  { header: 'Company', key: 'company', width: 20 },
  { header: 'Location', key: 'location', width: 16 },
  { header: 'Status', key: 'status', width: 16 },
  { header: 'Applied', key: 'applied', width: 20 },
  { header: 'Interview', key: 'interview', width: 20 },
  { header: 'Time', key: 'time', width: 10 },
];

const toRow = (job) => ({
  title: job.title,
  company: job.company,
  location: job.location || '',
  status: job.status,
  applied: job.appliedDate ? formatDisplayDate(job.appliedDate) : '',
  interview: job.interviewDate ? formatDisplayDate(job.interviewDate) : '',
  time: job.interviewTime || '',
});

// e.g. "JOBs 24.09.2026"
export function exportFileName(now = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `JOBs ${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
}

// The export libraries are large, so they are only downloaded when a user exports
export async function exportToExcel(jobs) {
  const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
    import('exceljs'),
    import('file-saver'),
  ]);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Jobs');
  worksheet.columns = COLUMNS;
  jobs.forEach((job) => worksheet.addRow(toRow(job)));

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `${exportFileName()}.xlsx`);
}

export async function exportToPDF(jobs) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text('Job Application Report', 14, 12);
  autoTable(doc, {
    head: [COLUMNS.map((column) => column.header)],
    body: jobs.map((job) => {
      const row = toRow(job);
      return COLUMNS.map((column) => row[column.key]);
    }),
    startY: 18,
  });
  doc.save(`${exportFileName()}.pdf`);
}
