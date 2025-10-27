export type Job = {
  id: number;
  title: string;
  company: string;
  location?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  workType?: string | null;
  currency?: string | null;
  url: string;
  dateApplied: Date;
  status: string;
  notes?: string | null;
  tags?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SortableJob = Job & {
  dateAppliedFormatted?: string;
  salaryRangeFormatted?: string;
};