import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Job } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { StatusDropdown } from "./StatusDropdown";

interface JobTableProps {
  jobs: Job[];
  onStatusChange: (jobId: number, newStatus: string) => void;
}

export function JobTable({ jobs, onStatusChange }: JobTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Applied</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                {formatDistanceToNow(new Date(job.dateApplied), {
                  addSuffix: true,
                })}
              </TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.company}</TableCell>
              <TableCell>
                <StatusDropdown
                  currentStatus={job.status}
                  onStatusChange={(status) => onStatusChange(job.id, status)}
                />
              </TableCell>
              <TableCell>
                <Link
                  href={job.url}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}