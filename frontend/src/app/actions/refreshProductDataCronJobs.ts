import * as Sentry from "@sentry/nextjs";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import {
  getProductEANsThatNeedPriceDataRefresh,
  updateTimeOfLastAttemptedPriceRefreshForAListOfEANs,
} from "~/server/queries";
import { DEFAULT_GERMANY_TIMEZONE } from "./actions.constants";

dayjs.extend(utc);
dayjs.extend(timezone);

export const refreshProductData = async (): Promise<void> => {
  // TODO: Could also add count here and send it back to cron job so it maxs out after 1.2 cycles or something
  try {
    // TODO: Wrap functions in timer for 50 seconds

    // TODO: Get 100 items
    const startOfToday: Date = dayjs()
      .tz(DEFAULT_GERMANY_TIMEZONE)
      .startOf("day")
      .toDate();
    const productEANs =
      await getProductEANsThatNeedPriceDataRefresh(startOfToday);

    console.log("productEANs", productEANs);

    // TODO: Update their time
    if (productEANs.length === 0) {
      console.log(
        "refreshProductData - no products requiring updated price data found",
      );
      return;
    }
    await updateTimeOfLastAttemptedPriceRefreshForAListOfEANs(productEANs);

    // // TODO: refresh all data for Amazon and Kaufland in batches of 100
    // // TODO: update profit and roi for all rows
    // const pricingRefreshQueries = productEANs.map(async (ean) => {
    //   await Promise.all([
    //     await asinDataProductDataApiAddNewProduct(ean),
    //     await kauflandSellerApiGetProductDataByEAN(ean),
    //   ]);
    //   await updateProfitAndROI(ean);
    // });
    // await Promise.all(pricingRefreshQueries);

    // TODO: find listed products that are profitable or unprofitable
    // TODO: delete or add listings on Kaufland based on profitability status
    // TODO: If not done, create a new cron job to hit the endpoint again

    // TODO: Update table and listed units if both Amazon and Kaufland values were updated recently
    // const kauflandListedUnitsForSale = await kauflandSellerApiGetUnitsByEAN({
    //   ean,
    // });
    // console.log("kauflandListedUnitesForSale", kauflandListedUnitsForSale);
    // const unitIds = kauflandListedUnitsForSale.map((unit) =>
    //   unit.id_unit.toString(),
    // );
    // await kauflandSellerApiDeleteAllUnitsUsingUnitIds({ unitIds });
    // const updatedPromises = unitIds.map(async (unitId) => {
    //   await updateKauflandUnitListing(userId, ean, unitId, false);
    // });
    // await Promise.all(updatedPromises);
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSaveListedUnitsToDatabase - Error:", error);
    throw error;
  }
};
