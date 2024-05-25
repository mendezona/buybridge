"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { type ComparisonTableItem } from "./comparisonTable.types";

export const columns: ColumnDef<ComparisonTableItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
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
    header: "Profit",
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
    header: "ROI",
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
