import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobStats } from "@/lib/jobs";
import { UserCircle, Building2, CheckCircle2, Calendar, Ban } from "lucide-react";

export const dynamic = 'force-dynamic';
export default async function AnalyticsPage() {
  const { totalJobs, totalInterviews, totalOffers, recentApplications, totalRejections } = await getJobStats();

  const stats = [
    {
      title: "Total Applications",
      value: totalJobs,
      icon: UserCircle,
      description: "Total number of jobs applied",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Rejections",
      value: totalRejections,
      icon: Ban,
      description: "Rejected applications",
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Active Interviews",
      value: totalInterviews,
      icon: Building2,
      description: "Currently in interview process",
      color: "bg-amber-100 text-amber-800",
    },
    {
      title: "Job Offers",
      value: totalOffers,
      icon: CheckCircle2,
      description: "Received job offers",
      color: "bg-green-100 text-green-800",
    },
     
    {
      title: "Recent Applications",
      value: recentApplications,
      icon: Calendar,
      description: "Applications in last 30 days",
      color: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">Track your job search progress and metrics</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${stat.color}`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-20`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}