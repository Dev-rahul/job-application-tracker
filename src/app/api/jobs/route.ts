import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/jobs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        dateApplied: 'desc',
      },
      select: {
        id: true,
        title: true,
        company: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        workType: true,
        currency: true,
        url: true,
        dateApplied: true,
        status: true,
        notes: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log('Creating job with data:', data);
    const job = await prisma.job.create({
      data: {
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
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}