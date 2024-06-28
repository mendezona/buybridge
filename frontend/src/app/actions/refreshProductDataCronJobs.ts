import * as Sentry from "@sentry/nextjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  getProductEANsThatNeedPriceDataRefresh,
  updateProfitAndROI,
  updateTimeOfLastAttemptedPriceRefreshForAListOfEANs,
} from "~/server/queries";
import { DEFAULT_GERMANY_TIMEZONE } from "./actions.constants";
import { addOrRefreshAmazonProductData } from "./amazonActions";
import { kauflandUpdateProductData } from "./kauflandActions";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Fetches updated product data from Amazon and Kaufland and updates the database.
 *
 * @params eans - The EANS of the products refresh product data for
 */
export const refreshProductDataAndUpdateUnitListings = async (
  eans?: string[],
): Promise<void> => {
  // TODO: Wrap function in timer for 50 seconds, and create cron job to continue where it left off
  try {
    const startOfToday: Date = dayjs()
      .tz(DEFAULT_GERMANY_TIMEZONE)
      .startOf("day")
      .toDate();
    const productEANs: string[] = eans
      ? eans
      : await getProductEANsThatNeedPriceDataRefresh(startOfToday);

    if (productEANs.length > 0) {
      await updateTimeOfLastAttemptedPriceRefreshForAListOfEANs(productEANs);

      const pricingRefreshQueries: Promise<void>[] = productEANs.map(
        async (ean) => {
          await Promise.all([
            await addOrRefreshAmazonProductData(ean),
            await kauflandUpdateProductData(ean),
            await updateProfitAndROI(ean),
          ]);
        },
      );
      await Promise.all(pricingRefreshQueries);

      // TODO: find listed products that are profitable or unprofitable
      // TODO: delete or add listings on Kaufland based on profitability status
      // TODO: If not done, create a new cron job to hit the endpoint again
      // TODO: Update table and listed units if both Amazon and Kaufland values were updated recently
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error("refreshProductDataAndUpdateUnitListings - Error:", error);
    throw error;
  }
};
