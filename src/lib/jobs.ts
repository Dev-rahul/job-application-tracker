import { db } from "@/lib/db";
import { addDays } from "date-fns";

export async function getJobStats() {
  const totalJobs = await db.job.count();

  const totalInterviews = await db.job.count({
    where: {
      status: "Interviewing"
    }
  });

  const totalOffers = await db.job.count({
    where: {
      status: "Offered"
    }
  });

  const thirtyDaysAgo = addDays(new Date(), -30);
  const recentApplications = await db.job.count({
    where: {
      dateApplied: {
        gte: thirtyDaysAgo
      }
    }
  });

  return {
    totalJobs,
    totalInterviews,
    totalOffers,
    recentApplications
  };
}