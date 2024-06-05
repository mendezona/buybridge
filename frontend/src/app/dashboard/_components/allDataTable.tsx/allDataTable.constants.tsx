"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { convertDecimalToPercentage } from "../comparisonTable/comparisonTable.helpers";
import { type ComparisonTableItem } from "../comparisonTable/comparisonTable.types";

export const allDataTableColumns: ColumnDef<ComparisonTableItem>[] = [
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
      const amount = parseFloat(row.getValue("profit")) ?? 0;
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
      const returnOnInvestment = row.getValue("returnOnInvestment");
      const parsedROI = parseFloat(returnOnInvestment as string);
      return (
        <div
          className={`font-medium ${parsedROI > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {convertDecimalToPercentage(row.getValue("returnOnInvestment"))}
        </div>
      );
    },
  },
  {
    accessorKey: "amazonPrice",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amazon Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amazonPrice")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "kauflandPrice",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kaufland Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("kauflandPrice")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "kauflandVAT",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kaufland VAT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("kauflandVAT")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "kauflandVariableFee",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kaufland Category Fee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("kauflandVariableFee")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "kauflandFixedFee",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kaufland Fixed Fee
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("kauflandFixedFee")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "kauflandShippingRate",
    header: ({ column }) => {
      return (
        <Button
          style={{ padding: 0 }}
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kaufland VAT
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("kauflandShippingRate")) ?? 0;
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div>{formatted}</div>;
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
