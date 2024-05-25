import { type Item } from "@prisma/client";
import { type ComparisonTableItem } from "./comparisonTable.types";

export function convertDatabaseItemToPlainObjectType(
  item: Item,
): ComparisonTableItem {
  console.log("item", item);

  const kauflandPrice: number = item.kauflandPrice.toNumber();
  const profit: number =
    item.kauflandPrice.toNumber() - item.amazonPrice.toNumber();
  const returnOnInvestment: number = profit / kauflandPrice;
  const updatedAt: string = item.updatedAt.toString();

  return {
    ...item,
    profit,
    returnOnInvestment,
    updatedAt,
  };
}

export function convertToPlainObjects(
  plainObjects: Item[],
): ComparisonTableItem[] {
  return plainObjects.map((plainObject: Item): ComparisonTableItem => {
    return convertDatabaseItemToPlainObjectType(plainObject);
  });
}
