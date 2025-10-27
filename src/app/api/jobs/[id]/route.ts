import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

// PATCH /api/jobs/[id]
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const data = await request.json();
    const job = await prisma.job.update({
      where: {
        id: parseInt(params.id),
      },
      data,
    });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    await prisma.job.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}