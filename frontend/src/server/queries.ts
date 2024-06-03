import "server-only";

import { eq, sql } from "drizzle-orm";
import { type AmazonProductData } from "~/scrapers/amazonScrapper/amazonScrapper.types";
import { type KauflandProductData } from "~/scrapers/kauflandScrapper/kauflandScrapper.types";
import { detectAndConvertPrice } from "~/scrapers/scrappers.helpers";
import { db } from "./db";
import { items } from "./db/schema";
import { type Item } from "./queries.types";

export async function getAllItemsOrderedByProfit(): Promise<Item[]> {
  const dbItems = await db.select().from(items).orderBy(items.profit);
  return dbItems;
}

export async function saveNewKauflandItem(
  ean: string,
  kauflandProductData: KauflandProductData,
): Promise<void> {
  const existingItem = await db.select().from(items).where(eq(items.ean, ean));
  if (existingItem.length > 0) {
    await db
      .update(items)
      .set({
        productName: kauflandProductData.productName,
        kauflandPrice:
          kauflandProductData.kauflandPrice &&
          detectAndConvertPrice(kauflandProductData.kauflandPrice),
        kauflandLink: kauflandProductData.kauflandLink,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(items.ean, ean));
  } else {
    await db.insert(items).values({
      ean,
      productName: kauflandProductData.productName,
      kauflandPrice:
        kauflandProductData.kauflandPrice &&
        detectAndConvertPrice(kauflandProductData.kauflandPrice),
      kauflandLink: kauflandProductData.kauflandLink,
      updatedAt: sql`CURRENT_TIMESTAMP`,
      createdAt: sql`CURRENT_TIMESTAMP`,
    });
  }

  console.log("Kaufland product information added sucessfully");
  return;
}

export async function saveNewAmazonItem(
  ean: string,
  amazonProductData: AmazonProductData,
): Promise<void> {
  const existingItem = await db.select().from(items).where(eq(items.ean, ean));
  if (existingItem.length > 0) {
    await db
      .update(items)
      .set({
        productName: amazonProductData.amazonTitle,
        amazonPrice:
          amazonProductData.amazonPrice &&
          detectAndConvertPrice(amazonProductData.amazonPrice),
        amazonLink: amazonProductData.amazonLink ?? "",
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(items.ean, ean));
  } else {
    await db.insert(items).values({
      ean,
      productName: amazonProductData.amazonTitle,
      amazonPrice:
        amazonProductData.amazonPrice &&
        detectAndConvertPrice(amazonProductData.amazonPrice),
      amazonLink: amazonProductData.amazonLink,
      updatedAt: sql`CURRENT_TIMESTAMP`,
      createdAt: sql`CURRENT_TIMESTAMP`,
    });
  }

  console.log("Amazon product information added sucessfully");
  return;
}

export async function updateProfitAndROI(ean: string): Promise<void> {
  const existingItem = await db.select().from(items).where(eq(items.ean, ean));
  if (existingItem.length > 0) {
    const profit =
      existingItem[0]?.amazonPrice && existingItem[0]?.kauflandPrice
        ? (
            parseFloat(existingItem[0]?.amazonPrice) -
            parseFloat(existingItem[0]?.kauflandPrice)
          ).toString()
        : null;
    const roi =
      profit && existingItem[0]?.amazonPrice
        ? (
            parseFloat(profit) / parseFloat(existingItem[0]?.amazonPrice)
          ).toString()
        : null;

    await db
      .update(items)
      .set({
        profit: profit,
        roi: roi,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(items.ean, ean));
  }

  console.log("Profit and ROI information added sucessfully");
  return;
}
