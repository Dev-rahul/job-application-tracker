import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// DELETE /api/jobs/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = rawId ? Number(rawId) : NaN;
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid job id" }, { status: 400 });
    }

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


