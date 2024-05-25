import { type Item } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type ComparisonTableItem } from "./comparisonTable.types";

dayjs.extend(relativeTime);

export function convertDatabaseItemToPlainObjectType(
  item: Item,
): ComparisonTableItem {
  console.log("item", item);

  const kauflandPrice: number = item.kauflandPrice.toNumber();
  const profit: number =
    item.kauflandPrice.toNumber() - item.amazonPrice.toNumber();
  const returnOnInvestment: number = profit / kauflandPrice;
  const updatedAt: string = dayjs(item.updatedAt).fromNow();

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
