import * as Sentry from "@sentry/nextjs";
import { asinDataProductDataApiAGetProductData } from "~/marketplaceConnectors/amazon/asinDataApi/asinDataProductDataApi";
import { saveOrUpdateAmazonItemProductData } from "~/server/queries";

/**
 * Sends a query to the ASIN Data API to get the product data for an Amazon product.
 * If the product is found, it saves the product data to the database.
 *
 * @param ean - The EAN of the product to get data for.
 *
 * @returns A boolean indicating whether the product was found and added to the database.
 */
export const addOrRefreshAmazonProductData = async (
  ean: string,
): Promise<boolean> => {
  try {
    const amazonProductData = await asinDataProductDataApiAGetProductData(ean);
    if (amazonProductData.productFound) {
      await saveOrUpdateAmazonItemProductData(ean, amazonProductData);
      return true;
    }
    return false;
  } catch (error) {
    Sentry.captureException(error);
    console.error("addOrRefreshAmazonProductData - Error:", error);
    throw error;
  }
};
