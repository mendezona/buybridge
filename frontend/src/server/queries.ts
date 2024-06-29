import "server-only";

import * as Sentry from "@sentry/nextjs";
import Decimal from "decimal.js";
import {
  and,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { type AmazonProductData } from "~/marketplaceConnectors/amazon/asinDataApi/asinDataApi.types";
import { type KauflandProductData } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper.types";
import { detectAndConvertPrice } from "~/marketplaceConnectors/scrappers.helpers";
import { db } from "./db";
import { items, listings } from "./db/schema";
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

export const saveOrUpdateKauflandItemProductData = async (
  ean: string,
  kauflandProductData: KauflandProductData,
): Promise<void> => {
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
};

/**
 * Saves the details of a new Amazon product to the database.
 *
 * @param ean - EAN of the product to save.
 * @param amazonProductData - The product data to save.
 */
export const saveOrUpdateAmazonItemProductData = async (
  ean: string,
  amazonProductData: AmazonProductData,
): Promise<void> => {
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
};

/**
 * Updates the profit and ROI for a product
 *
 * @param ean - EAN of the product to update
 */
export async function updateProfitAndROI(
  ean: string,
  freeShippping = true,
): Promise<void> {
  try {
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.ean, ean));
    if (
      existingItem.length > 0 &&
      existingItem[0]?.amazonPrice &&
      existingItem[0]?.kauflandPrice &&
      existingItem[0].kauflandVat &&
      existingItem[0].kauflandVariableFee &&
      existingItem[0].kauflandFixedFee &&
      existingItem[0].kauflandShippingRate
    ) {
      const amazonPrice: Decimal = new Decimal(existingItem[0].amazonPrice);
      const kauflandPrice: Decimal = new Decimal(existingItem[0].kauflandPrice);
      const kauflandVATReduction: Decimal = new Decimal(
        existingItem[0].kauflandVat,
      ).div(100);
      const kauflandCategoryFeeReduction: Decimal = new Decimal(
        existingItem[0].kauflandVariableFee,
      ).div(100);
      const kauflandFixedFeeReduction: Decimal = new Decimal(
        existingItem[0].kauflandFixedFee,
      );
      const kauflandShippingRateReduction: Decimal = freeShippping
        ? new Decimal(0)
        : new Decimal(existingItem[0].kauflandShippingRate);

      const netBuy: Decimal = amazonPrice.div(kauflandVATReduction.plus(1));
      const netSell: Decimal = kauflandPrice.div(kauflandVATReduction.plus(1));
      const kauflandCategoryFees: Decimal = kauflandPrice.times(
        kauflandCategoryFeeReduction,
      );

      const profit: Decimal = netSell
        .minus(netBuy)
        .minus(kauflandCategoryFees)
        .minus(kauflandFixedFeeReduction)
        .minus(kauflandShippingRateReduction)
        .toDecimalPlaces(2, Decimal.ROUND_DOWN);
      const roi: Decimal = profit
        .div(amazonPrice)
        .toDecimalPlaces(2, Decimal.ROUND_DOWN);

      await db
        .update(items)
        .set({
          profit: profit.toString(),
          roi: roi.toString(),
          profitUpdatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(items.ean, ean));
      console.log(
        "updateProfitAndROI - Profit and ROI information added successfully for ean:",
        ean,
      );
    } else {
      console.log(
        "updateProfitAndROI - Error information for profit calculation missing for ean:",
        ean,
      );
    }
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

export async function updateKauflandUnitListing(
  userId: string,
  ean: string,
  kauflandUnitId: string,
  unitCurrentlyListed: boolean,
): Promise<void> {
  try {
    const existingItem = await db
      .select()
      .from(listings)
      .where(
        and(
          eq(listings.userId, userId),
          eq(listings.ean, ean),
          eq(listings.kauflandUnitId, kauflandUnitId),
        ),
      );

    if (existingItem.length > 0) {
      await db
        .update(listings)
        .set({ unitCurrentlyListed, lastUpdatedAt: sql`CURRENT_TIMESTAMP` })
        .where(
          and(
            eq(listings.userId, userId),
            eq(listings.ean, ean),
            eq(listings.kauflandUnitId, kauflandUnitId),
          ),
        );
    } else {
      await db.insert(listings).values({
        userId,
        ean,
        kauflandUnitId,
        unitCurrentlyListed,
        lastUpdatedAt: sql`CURRENT_TIMESTAMP`,
      });
    }

    console.log("updateKauflandUnitListing - updated unit listing for", ean);
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
}

/**
 * Get a list of EANs that need to be refreshed based on a time to compare to
 *
 * @param timeToCompareTo - The time to compare the last attempted refresh to.
 * @param maxResults - The maximum number of results to return.
 *
 * @returns An array of EANs that need pricing refreshed.
 */
export const getProductEANsThatNeedPriceDataRefresh = async (
  timeToCompareTo: Date,
  maxResults = 100,
): Promise<string[]> => {
  try {
    const existingItems = await db
      .select({
        ean: items.ean,
      })
      .from(items)
      .where(
        or(
          lt(items.productDataLastAttemptedRefreshAt, timeToCompareTo),
          isNull(items.productDataLastAttemptedRefreshAt),
        ),
      )
      .limit(maxResults);

    if (existingItems.length > 0) {
      console.log(
        `getProductEANsThatNeedPriceDataRefresh - ${existingItems.length} products requiring updated price data found`,
      );
      return existingItems.map((item) => item.ean);
    }

    console.log(
      "getProductEANsThatNeedPriceDataRefresh - no products requiring updated price data found",
    );
    return [];
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

/**
 * Update the time of the last attempted refresh for a list of EANs
 *
 * @param productEANs - An array of EANs to update the last attempted refresh time for.
 */
export const updateTimeOfLastAttemptedPriceRefreshForAListOfEANs = async (
  productEANs: string[],
): Promise<void> => {
  try {
    await db
      .update(items)
      .set({
        productDataLastAttemptedRefreshAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(inArray(items.ean, productEANs));

    console.log(
      "updateTimeOfLastAttemptedPriceRefreshForAListOfEANs - timestamp of last pricing refresh updated successfully",
    );
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};
