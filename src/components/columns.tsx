"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SortableJob } from "@/types/job";
import { format, formatDistanceStrict } from "date-fns";
import { StatusDropdown } from "./StatusDropdown";
import Link from "next/link";

export const columns: ColumnDef<SortableJob>[] = [
  {
    accessorKey: "dateApplied",
    header: "Date Applied",
    cell: ({ row }) => {
      const date = row.original.dateApplied;
      return format(new Date(date), 'MMM dd, yyyy');
    },
  },
  // {
  //   id: "postedAgo",
  //   header: "Posted Ago",
  //   cell: ({ row }) => row.original.postedAgo || "-",
  // },
  {
    accessorKey: "title",
    header: "Job Title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => row.original.location || "Not specified",
  },
  {
    accessorKey: "workType",
    header: "Work Type",
    cell: ({ row }) => row.original.workType || "Not specified",
  },
  {
    id: "salary",
    header: "Salary Range",
    cell: ({ row }) => {
      const salaryMin = row.original.salaryMin;
      const salaryMax = row.original.salaryMax;
      const currency = row.original.currency || 'USD';
      
      if (!salaryMin && !salaryMax) return 'Not specified';
      
      if (salaryMin && salaryMax) {
        return `${currency} ${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()}`;
      }
      
      if (salaryMin) {
        return `${currency} ${salaryMin.toLocaleString()}+`;
      }
      
      return `Up to ${currency} ${salaryMax?.toLocaleString()}`;
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.salaryMin || 0;
      const b = rowB.original.salaryMin || 0;
      return a > b ? 1 : a < b ? -1 : 0;
    },
  },
  {
    id: "appliedSpeed",
    header: "Applied Speed",
    cell: ({ row }) => {
      const applied = new Date(row.original.dateApplied);
      const postedAt = row.original.postedAt ? new Date(row.original.postedAt) : undefined;
      if (!postedAt) return "-";
      return formatDistanceStrict(postedAt, applied, { addSuffix: false });
    },
    sortingFn: (a, b) => {
      const aPosted = a.original.postedAt ? new Date(a.original.postedAt).getTime() : Infinity;
      const bPosted = b.original.postedAt ? new Date(b.original.postedAt).getTime() : Infinity;
      const aApplied = new Date(a.original.dateApplied).getTime();
      const bApplied = new Date(b.original.dateApplied).getTime();
      const aDelta = aApplied - aPosted;
      const bDelta = bApplied - bPosted;
      return (aDelta || Infinity) - (bDelta || Infinity);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StatusDropdown
          currentStatus={row.original.status}
          onStatusChange={async (newStatus) => {
            try {
              const response = await fetch(`/api/jobs/${row.original.id}/status`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, id : row.original.id}),
              });
              
              if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update status');
              }

              // Let the parent component handle the refresh
              if (window.refreshJobs) {
                window.refreshJobs();
              }
            } catch (error) {
              console.error('Error updating status:', error);
              alert('Failed to update status. Please try again.');
            }
          }}
        />
      );
    },
  },
  {
    id: "url",
    header: "Link",
    cell: ({ row }) => {
      return (
        <Link
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          View
        </Link>
      );
    },
  },
];