"use client";

import { type ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface ComparisonTableItem {
  productName?: string | null;
  profit?: string | null;
  returnOnInvestment?: string | null;
  kauflandLink?: string | null;
  amazonLink?: string | null;
  updatedAt: string;
}
