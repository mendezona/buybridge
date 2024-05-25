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

export const columns: ColumnDef<ComparisonTableItem>[] = [
  {
    accessorKey: "productName",
    header: "Product",
  },
  {
    accessorKey: "profit",
    header: "Profit",
  },
  {
    accessorKey: "returnOnInvestment",
    header: "ROI",
  },
  {
    accessorKey: "rank",
    header: "Rank",
  },
  {
    accessorKey: "kauflandLink",
    header: "Kaufland Link",
  },
  {
    accessorKey: "amazonLink",
    header: "Amazon Link",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="text-right font-medium">{formatted}</div>;
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
