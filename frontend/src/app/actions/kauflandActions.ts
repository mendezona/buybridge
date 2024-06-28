import * as Sentry from "@sentry/nextjs";
import { type KauflandProductData } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper.types";
import {
  kauflandSellerApiDeleteAllUnitsUsingUnitIds,
  kauflandSellerApiGetProductDataByEAN,
  kauflandSellerApiGetUnitsByEAN,
} from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi";
import {
  type KauflandProductDataSchemaType,
  type KauflandSellerApiUnit,
} from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi.types";
import { formatToTwoDecimalPlaces } from "~/marketplaceConnectors/scrappers.helpers";
import {
  saveOrUpdateKauflandItemProductData,
  updateKauflandUnitListing,
} from "~/server/queries";

export const kauflandUpdateListedUnitsToDatabaseForAUser = async (
  userId: string,
  ean: string,
  unitCurrentlyListed: boolean,
): Promise<void> => {
  try {
    const kauflandListedUnitsForSale = await kauflandSellerApiGetUnitsByEAN({
      ean,
    });

    console.log("kauflandListedUnitesForSale", kauflandListedUnitsForSale);
    const updatePromises = kauflandListedUnitsForSale.map(async (unit) => {
      const kauflandUnitId = unit.id_unit.toString();
      await updateKauflandUnitListing(
        userId,
        ean,
        kauflandUnitId,
        unitCurrentlyListed,
      );
    });

    console.log("updatePromises", updatePromises);

    await Promise.all(updatePromises);
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSaveListedUnitsToDatabase - Error:", error);
    throw error;
  }
};

export const kauflandRemoveListedUnitsForASingleUser = async (
  userId: string,
  ean: string,
): Promise<void> => {
  try {
    const kauflandListedUnitsForSale: KauflandSellerApiUnit[] =
      await kauflandSellerApiGetUnitsByEAN({
        ean,
      });

    console.log("kauflandListedUnitesForSale", kauflandListedUnitsForSale);

    const unitIds: string[] = kauflandListedUnitsForSale.map((unit) =>
      unit.id_unit.toString(),
    );
    await kauflandSellerApiDeleteAllUnitsUsingUnitIds(unitIds);
    const updatedPromises = unitIds.map(async (unitId) => {
      await updateKauflandUnitListing(userId, ean, unitId, false);
    });

    await Promise.all(updatedPromises);
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSaveListedUnitsToDatabase - Error:", error);
    throw error;
  }
};

/**
 * Update the Kaufland product data for a given EAN.
 *
 * @param ean - The EAN of the product to get data for.
 * */
export const kauflandUpdateProductData = async (
  ean: string,
): Promise<boolean> => {
  try {
    const kauflandProductData: KauflandProductDataSchemaType | null =
      await kauflandSellerApiGetProductDataByEAN(ean);

    if (kauflandProductData?.units[0]) {
      const kauflandProductDataForDatabase: KauflandProductData = {
        productFound: true,
        kauflandProductId: kauflandProductData.id_product.toString(),
        productName: kauflandProductData.title,
        kauflandPrice: formatToTwoDecimalPlaces(
          kauflandProductData.units[0].price,
        ).toString(),
        kauflandLink: kauflandProductData.url,
        kauflandVat: kauflandProductData.category.vat.toString(),
        kauflandVariableFee:
          kauflandProductData.category.variable_fee.toString(),
        kauflandFixedFee: kauflandProductData.category.fixed_fee.toString(),
        kauflandShippingRate: formatToTwoDecimalPlaces(
          kauflandProductData.units[0].shipping_rate,
        ).toString(),
      };

      await saveOrUpdateKauflandItemProductData(
        ean,
        kauflandProductDataForDatabase,
      );
      return true;
    }
    return false;
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandUpdateProductData - Error:", error);
    throw error;
  }
};
