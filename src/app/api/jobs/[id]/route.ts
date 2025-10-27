import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
  };
};

// PATCH /api/jobs/[id]
export async function PATCH(
  request: Request,
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    await prisma.job.delete({
      where: {
        id: parseInt(params.id),
      },
    });
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete job';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}