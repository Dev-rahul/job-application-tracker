import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        dateApplied: 'desc',
      },
    });
    return NextResponse.json(jobs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/jobs
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating job with data:', data);
    // Derive postedAt from postedAgo + dateExtracted when possible
    let postedAt: Date | undefined = undefined;
    if (data.postedAt) {
      postedAt = new Date(data.postedAt);
    } else if (data.postedAgo && data.dateExtracted) {
      const extracted = new Date(data.dateExtracted);
      const match = String(data.postedAgo).trim().toLowerCase().match(/^(just now|\d+\s*(minute|hour|day|week|month|year)s?\s+ago)$/);
      if (match) {
        const text = match[1] || match[0];
        if (text === 'just now') {
          postedAt = extracted;
        } else {
          const num = parseInt(text.match(/\d+/)?.[0] || '0', 10);
          const unit = (text.match(/minute|hour|day|week|month|year/)?.[0] || 'minute') as 'minute'|'hour'|'day'|'week'|'month'|'year';
          const ms = {
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
            year: 365 * 24 * 60 * 60 * 1000,
          }[unit];
          postedAt = new Date(extracted.getTime() - num * ms);
        }
      }
    }
    const createData: Record<string, unknown> = {
      title: data.title,
      company: data.company,
      location: data.location,
      url: data.url,
      workType: data.workType,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      currency: data.currency,
      dateApplied: data.dateApplied || new Date(),
      status: data.status || 'Applied',
      notes: data.notes,
      tags: data.tags,
    };
    createData.companyDescription = data.companyDescription;
    createData.companyLogo = data.companyLogo;
    createData.dateExtracted = data.dateExtracted ? new Date(data.dateExtracted) : undefined;
    createData.postedAgo = data.postedAgo;
    createData.postedAt = postedAt;
    createData.followers = data.followers;
    createData.jobType = data.jobType;
    createData.description = data.description;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const job = await prisma.job.create({ data: createData as any });
    return NextResponse.json(job);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}