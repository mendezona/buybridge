import "server-only";

import * as Sentry from "@sentry/nextjs";
import { and, desc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { type AmazonProductData } from "~/marketplaceConnectors/amazon/amazonApi/amazonApi.types";
import { type KauflandProductData } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper.types";
import { detectAndConvertPrice } from "~/marketplaceConnectors/scrappers.helpers";
import { db } from "./db";
import { items } from "./db/schema";
import { convertToDecimal } from "./queries.helpers";
import { type Item } from "./queries.types";

export async function getAllItemsWithRecentDataOrderedByProfit(): Promise<
  Item[]
> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dbItems = await db
    .select()
    .from(items)
    .where(
      and(
        isNotNull(items.profit),
        gt(items.profitUpdatedAt, oneDayAgo),
        gt(items.amazonDataUpdatedAt, oneDayAgo),
        gt(items.kauflandDataUpdatedAt, oneDayAgo),
      ),
    )
    .orderBy(desc(items.profit));

  return dbItems;
}

export async function getKauflandProductIdFromEAN(
  ean: string,
): Promise<Item[]> {
  try {
    const dbItems = await db.select().from(items).where(eq(items.ean, ean));
    return dbItems;
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function saveNewKauflandItem(
  ean: string,
  kauflandProductData: KauflandProductData,
): Promise<void> {
  try {
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.ean, ean));
    if (existingItem.length > 0) {
      await db
        .update(items)
        .set({
          productName: kauflandProductData.productName,
          kauflandProductId: kauflandProductData.kauflandProductId,
          kauflandPrice: kauflandProductData.kauflandPrice,
          kauflandLink: kauflandProductData.kauflandLink,
          kauflandVat: kauflandProductData.kauflandVat,
          kauflandVariableFee: kauflandProductData.kauflandVariableFee,
          kauflandFixedFee: kauflandProductData.kauflandFixedFee,
          kauflandShippingRate: kauflandProductData.kauflandShippingRate,
          kauflandDataUpdatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(items.ean, ean));
    } else {
      await db.insert(items).values({
        ean,
        productName: kauflandProductData.productName,
        kauflandProductId: kauflandProductData.kauflandProductId,
        kauflandPrice: kauflandProductData.kauflandPrice,
        kauflandLink: kauflandProductData.kauflandLink,
        kauflandVat: kauflandProductData.kauflandVat,
        kauflandVariableFee: kauflandProductData.kauflandVariableFee,
        kauflandFixedFee: kauflandProductData.kauflandFixedFee,
        kauflandShippingRate: kauflandProductData.kauflandShippingRate,
        kauflandDataUpdatedAt: sql`CURRENT_TIMESTAMP`,
        createdAt: sql`CURRENT_TIMESTAMP`,
      });
    }

    console.log(
      "Kaufland product information added successfully",
      kauflandProductData,
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function saveNewAmazonItem(
  ean: string,
  amazonProductData: AmazonProductData,
): Promise<void> {
  try {
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.ean, ean));
    if (existingItem.length > 0) {
      await db
        .update(items)
        .set({
          productName: amazonProductData.amazonTitle,
          amazonPrice:
            amazonProductData.amazonPrice &&
            detectAndConvertPrice(amazonProductData.amazonPrice),
          amazonLink: amazonProductData.amazonLink ?? "",
          amazonDataUpdatedAt: sql`CURRENT_TIMESTAMP`,
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
        amazonDataUpdatedAt: sql`CURRENT_TIMESTAMP`,
        createdAt: sql`CURRENT_TIMESTAMP`,
      });
    }

    console.log("Amazon product information added successfully");
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function updateProfitAndROI(ean: string): Promise<void> {
  try {
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.ean, ean));
    if (existingItem.length > 0) {
      const kauflandPriceAsNumber = parseFloat(
        existingItem[0]?.kauflandPrice ?? "0",
      );
      const kauflandVATReduction =
        kauflandPriceAsNumber *
        convertToDecimal(parseInt(existingItem[0]?.kauflandVat ?? "0"));
      const kauflandCategoryFeeReduction =
        kauflandPriceAsNumber *
        convertToDecimal(parseInt(existingItem[0]?.kauflandVariableFee ?? "0"));
      const kauflandFixedFeeReduction =
        kauflandPriceAsNumber *
        convertToDecimal(parseInt(existingItem[0]?.kauflandFixedFee ?? "0"));
      const kauflandShippingRateReduction = convertToDecimal(
        parseInt(existingItem[0]?.kauflandShippingRate ?? "0"),
      );

      const profit =
        existingItem[0]?.amazonPrice && existingItem[0]?.kauflandPrice
          ? (
              parseFloat(existingItem[0]?.kauflandPrice) -
              parseFloat(existingItem[0]?.amazonPrice) -
              kauflandVATReduction -
              kauflandCategoryFeeReduction -
              kauflandFixedFeeReduction -
              kauflandShippingRateReduction
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
          profitUpdatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(items.ean, ean));
    }

    console.log("Profit and ROI information added successfully");
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}
