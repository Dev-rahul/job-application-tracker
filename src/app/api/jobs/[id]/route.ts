import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PATCH /api/jobs/[id]
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const job = await prisma.job.update({
      where: {
        id: parseInt(context.params.id),
      },
      data,
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]
export async function DELETE(
  _request: Request,
  context: { params: { id: string } }
) {
  try {
    await prisma.job.delete({
      where: {
        id: parseInt(context.params.id),
      },
    });
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}