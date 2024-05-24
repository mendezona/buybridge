"use client";

import { type ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import { useMemo } from "react";
import { type ComparisonTableRowData } from "./comparisonTable.types";

export function ComparisonTable({
  rowData,
}: {
  rowData: ComparisonTableRowData[];
}) {
  const GridExample = () => {
    const columnDefs = useMemo(
      () => [
        { headerName: "ID", field: "id" },
        { headerName: "Name", field: "name" },
        { headerName: "EAN", field: "ean" },
        { headerName: "FBM Seller", field: "fbmSeller" },
        { headerName: "FBA", field: "fba" },
        { headerName: "Amazon Price", field: "amazonPrice" },
        { headerName: "Amazon Stock Level", field: "amazonStockLevel" },
        { headerName: "Amazon Shipping Fee", field: "amazonShippingFee" },
        { headerName: "Kaufland Price", field: "kauflandPrice" },
        { headerName: "Kaufland Offer", field: "kauflandOffer" },
        { headerName: "Kaufland Seller Fee", field: "kauflandSellerFee" },
        { headerName: "Created At", field: "createdAt" },
        { headerName: "Updated At", field: "updatedAt" },
      ],
      [],
    );

    const defaultColDef: ColDef = {
      flex: 1,
    };

    // Container: Defines the grid's theme & dimensions.
    return (
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ width: "70vw", height: 500 }} // the grid will fill the size of the parent container
      >
        <h1>This is the grid</h1>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        />
      </div>
    );
  };

  return (
    <div>
      <GridExample />
    </div>
  );
}
