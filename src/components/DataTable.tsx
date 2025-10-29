"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-slate-50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="py-4">
                  <div
                    onClick={header.column.getCanSort() ? () => header.column.toggleSorting() : undefined}
                    role={header.column.getCanSort() ? "button" : undefined}
                    className="flex items-center gap-2 font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="py-4 w-12" />
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-slate-50/70 "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 max-w-96 truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="py-4 w-12">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Delete job"
                    title="Delete job"
                    onClick={async () => {
                      const id = (row.original as { id: number }).id;
                      const confirmed = window.confirm("Delete this job?");
                      if (!confirmed) return;
                      try {
                        const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
                        if (!res.ok) {
                          const err = await res.json().catch(() => ({}));
                          throw new Error(err.error || "Failed to delete job");
                        }
                        if (window.refreshJobs) {
                          window.refreshJobs();
                        }
                      } catch (error) {
                        console.error("Error deleting job:", error);
                        alert("Failed to delete. Please try again.");
                      }
                    }}
                  >
                    ×
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}