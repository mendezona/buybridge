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
  amazonPrice?: string | null;
  kauflandPrice?: string | null;
  kauflandVAT?: string | null;
  kauflandVariableFee?: string | null;
  kauflandFixedFee?: string | null;
  kauflandShippingRate?: string | null;
  kauflandLink?: string | null;
  amazonLink?: string | null;
  profitUpdatedAt?: string | null;
}
