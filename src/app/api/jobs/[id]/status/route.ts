import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
) {
  try {
    const { status, id } = await request.json();

    console.log("id:", id);
    const updatedJob = await prisma.job.update({
      where: {
        id
      },
      data: {
        status
      }
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error("Error updating job status:", error);
    return NextResponse.json(
      { error: "Failed to update job status" },
      { status: 500 }
    );
  }
}