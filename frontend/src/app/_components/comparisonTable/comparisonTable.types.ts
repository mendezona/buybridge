"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type RouterOutputs } from "~/trpc/react";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export type DatabaseItem = RouterOutputs["items"]["getAll"];

export interface ComparisonTableItem {
  productName: string;
  profit: number;
  returnOnInvestment: number;
  kauflandLink: string;
  amazonLink: string;
  updatedAt: string;
}
