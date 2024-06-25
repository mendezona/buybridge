import * as Sentry from "@sentry/nextjs";
import {
  kauflandSellerApiDeleteAllUnitsUsingUnitIds,
  kauflandSellerApiGetUnitsByEAN,
} from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi";
import { updateKauflandUnitListing } from "~/server/queries";

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
    const kauflandListedUnitsForSale = await kauflandSellerApiGetUnitsByEAN({
      ean,
    });

    console.log("kauflandListedUnitesForSale", kauflandListedUnitsForSale);

    const unitIds = kauflandListedUnitsForSale.map((unit) =>
      unit.id_unit.toString(),
    );
    await kauflandSellerApiDeleteAllUnitsUsingUnitIds({ unitIds });
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
