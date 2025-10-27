import { SortableJob } from "@/types/job";

export function downloadCSV(jobs: SortableJob[], filename: string) {
  // Define CSV headers
  const headers = [
    'Title',
    'Company',
    'Location',
    'Work Type',
    'Status',
    'Salary Min',
    'Salary Max',
    'Currency',
    'Date Applied',
    'URL',
    'Notes',
    'Tags'
  ];

  // Convert jobs to CSV rows
  const rows = jobs.map(job => [
    job.title,
    job.company,
    job.location || '',
    job.workType || '',
    job.status,
    job.salaryMin?.toString() || '',
    job.salaryMax?.toString() || '',
    job.currency || '',
    new Date(job.dateApplied).toISOString().split('T')[0], // YYYY-MM-DD format
    job.url,
    job.notes?.replace(/,/g, ';').replace(/\n/g, ' ') || '', // Escape commas and newlines
    job.tags || ''
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => 
      // Wrap in quotes if contains comma, and escape existing quotes
      cell.includes(',') ? `"${cell.replace(/"/g, '""')}"` : cell
    ).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}