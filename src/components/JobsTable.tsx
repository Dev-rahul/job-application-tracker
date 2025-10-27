import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string | null;
  workType: string;
  status: string;
  dateApplied: Date;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
};

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link 
        href={`/jobs/${row.original.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        {row.getValue("title")}
      </Link>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "workType",
    header: "Work Type",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`inline-flex px-2 py-1 rounded-full text-sm ${
        row.getValue("status") === "Applied" ? "bg-blue-100 text-blue-800" :
        row.getValue("status") === "Interviewing" ? "bg-yellow-100 text-yellow-800" :
        row.getValue("status") === "Offered" ? "bg-green-100 text-green-800" :
        row.getValue("status") === "Rejected" ? "bg-red-100 text-red-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "salary",
    header: "Salary Range",
    cell: ({ row }) => {
      const min = row.original.salaryMin;
      const max = row.original.salaryMax;
      const currency = row.original.currency;
      
      if (!min && !max) return "-";
      
      const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          maximumFractionDigits: 0,
        }).format(amount);
      };

      if (min && max) {
        return `${formatSalary(min)} - ${formatSalary(max)}`;
      } else if (min) {
        return `From ${formatSalary(min)}`;
      } else if (max) {
        return `Up to ${formatSalary(max)}`;
      }
    },
  },
  {
    accessorKey: "dateApplied",
    header: "Date Applied",
    cell: ({ row }) => format(new Date(row.getValue("dateApplied")), "MMM d, yyyy"),
  },
];

interface JobsTableProps {
  jobs: Job[];
}

export function JobsTable({ jobs }: JobsTableProps) {
  return <DataTable columns={columns} data={jobs} />;
}