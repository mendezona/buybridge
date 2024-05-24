import { type Item } from "@prisma/client";
import { type ComparisonTableRowData } from "./comparisonTable.types";

export function convertItemToPlainObject(item: Item): ComparisonTableRowData {
  return {
    ...item,
    amazonPrice: item.amazonPrice.toNumber(),
    amazonShippingFee: item.amazonShippingFee.toNumber(),
    kauflandPrice: item.kauflandPrice.toNumber(),
    kauflandSellerFee: item.kauflandSellerFee.toNumber(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export function convertPlainObjectsToAGGridRowData(
  plainObjects: Item[],
): ComparisonTableRowData[] {
  return plainObjects.map((plainObject: Item): ComparisonTableRowData => {
    return convertItemToPlainObject(plainObject);
  });
}
