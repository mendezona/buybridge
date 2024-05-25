"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type ComparisonTableItem } from "./comparisonTable.types";

export const columns: ColumnDef<ComparisonTableItem>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const productName = row.getValue("productName");
      return (
        <div className="max-w-xs truncate font-medium">
          {productName as string}
        </div>
      );
    },
  },
  {
    accessorKey: "profit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Profit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "returnOnInvestment",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ROI
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "kauflandLink",
    header: "Kaufland Link",
    cell: ({ row }) => {
      const link = row.getValue("kauflandLink");
      return (
        <>
          {link && (
            <a href={link as string} target="_black" rel="noopener noreferrer">
              <Button variant="link">View item on Kaufland</Button>
            </a>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "amazonLink",
    header: "Amazon Link",
    cell: ({ row }) => {
      const link = row.getValue("amazonLink");
      return (
        <>
          {link && (
            <a href={link as string} target="_black" rel="noopener noreferrer">
              <Button variant="link">View item on Kaufland</Button>
            </a>
          )}
        </>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
  },
];
