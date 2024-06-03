import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Item } from "~/server/queries.types";
import { type ComparisonTableItem } from "./comparisonTable.types";

dayjs.extend(relativeTime);

export function convertDatabaseItemToPlainObjectType(
  item: Item,
): ComparisonTableItem {
  const updatedAt: string = dayjs(item.updatedAt).fromNow();

  return {
    productName: item.productName,
    profit: item.profit,
    returnOnInvestment: item.roi && decimalToPercentage(item.roi),
    kauflandLink: item.kauflandLink,
    amazonLink: item.amazonLink,
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

export function decimalToPercentage(
  decimal: number | string,
  precision = 2,
): string {
  const number = typeof decimal === "number" ? decimal : parseFloat(decimal);
  return `${(number * 100).toFixed(precision)}%`;
}
