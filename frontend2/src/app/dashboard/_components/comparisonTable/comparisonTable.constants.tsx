"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { decimalToPercentage } from "./comparisonTable.helpers";
import { type ComparisonTableItem } from "./comparisonTable.types";

export const columns: ColumnDef<ComparisonTableItem>[] = [
  {
    accessorKey: "productName",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
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
          style={{ padding: 0 }}
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

      return amount > 0 ? (
        <div className="font-medium text-green-600">{formatted}</div>
      ) : (
        <div className="font-medium text-red-600">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "returnOnInvestment",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ROI
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const roiPercentage = decimalToPercentage(
        row.getValue("returnOnInvestment"),
      );

      return parseFloat(roiPercentage) > 0 ? (
        <div className="font-medium text-green-600">{roiPercentage}</div>
      ) : (
        <div className="font-medium text-red-600">{roiPercentage}</div>
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
              <Button style={{ padding: 0 }} variant="link">
                View item on Kaufland
              </Button>
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
              <Button style={{ padding: 0 }} variant="link">
                View item on Amazon
              </Button>
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
