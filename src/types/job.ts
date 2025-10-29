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
  companyDescription?: string | null;
  companyLogo?: string | null;
  dateExtracted?: Date | null;
  postedAgo?: string | null;
  postedAt?: Date | null;
  followers?: string | null;
  jobType?: string | null;
  description?: string | null;
};

export type SortableJob = Job & {
  dateAppliedFormatted?: string;
  salaryRangeFormatted?: string;
  appliedSpeedFormatted?: string;
};