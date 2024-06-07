import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { type Item } from "~/server/queries.types";
import { type ComparisonTableItem } from "./comparisonTable.types";

dayjs.extend(relativeTime);

export function convertDatabaseItemToPlainObjectType(
  item: Item,
): ComparisonTableItem {
  const profitUpdatedAt: string = dayjs(item.profitUpdatedAt).fromNow();

  return {
    productName: item.productName,
    profit: item.profit,
    returnOnInvestment: item.roi,
    amazonPrice: item.amazonPrice,
    kauflandPrice: item.kauflandPrice,
    kauflandVAT: item.kauflandVat,
    kauflandVariableFee: item.kauflandVariableFee,
    kauflandFixedFee: item.kauflandFixedFee,
    kauflandShippingRate: item.kauflandShippingRate,
    kauflandLink: item.kauflandLink,
    amazonLink: item.amazonLink,
    profitUpdatedAt,
  };
}

export function convertToPlainObjects(
  plainObjects: Item[],
): ComparisonTableItem[] {
  return plainObjects.map((plainObject: Item): ComparisonTableItem => {
    return convertDatabaseItemToPlainObjectType(plainObject);
  });
}

export function convertDecimalToPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}%`;
}

export function convertToPercentageDEFormat(num: number): string {
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num / 100);

  return formatted;
}
