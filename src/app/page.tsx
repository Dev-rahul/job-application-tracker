'use client';

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddJobForm } from "@/components/AddJobForm";
import { useEffect, useState } from "react";
import { columns } from "@/components/columns";
import { SortableJob } from "@/types/job";
import { downloadCSV } from "@/lib/csv";

interface AddJobData {
  title: string;
  company: string;
  location?: string;
  url: string;
  status?: string;
  workType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  notes?: string;
  tags?: string;
}

export default function HomePage() {
  const [jobs, setJobs] = useState<SortableJob[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    // Expose the refresh function globally
    window.refreshJobs = fetchJobs;
    fetchJobs();

    // Cleanup
    return () => {
      delete window.refreshJobs;
    };
  }, []);

  const handleAddJob = async (data: AddJobData) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to add job');
      
      const newJob = await response.json();
      setJobs([newJob, ...jobs]);
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <main className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
  
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Job Application</DialogTitle>
            </DialogHeader>
            <AddJobForm onSubmit={handleAddJob} />
          </DialogContent>
        </Dialog>
        <div className="flex gap-2">
  <Button 
    variant="outline"
    onClick={() => {
      const now = new Date().toISOString().split('T')[0];
      downloadCSV(jobs, `job-applications-${now}.csv`);
    }}
  >
    Export to CSV
  </Button>
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    {/* ... existing Dialog content ... */}
  </Dialog>
</div>
      </div>

      <DataTable columns={columns} data={jobs} />
    </main>
  );
}