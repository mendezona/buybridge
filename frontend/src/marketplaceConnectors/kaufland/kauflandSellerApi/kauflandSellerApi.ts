import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import dayjs from "dayjs";
import {
  KAUFLAND_DE_STOREFRONT,
  KAUFLAND_SELLER_API_BASE_URL,
  KAUFLAND_SELLER_API_USER_AGENT,
} from "./kauflandSellerApi.constants";
import { kauflandSellerApiSignRequest } from "./kauflandSellerApi.helpers";
import {
  KauflandSellerApiFulfillmentType,
  KauflandSellerApiRequestMethod,
  type KauflandProductListing,
  type KauflandSellerApiDeleteAllUnitsUsingProductIds,
  type KauflandSellerApiGetProductDataByEANParams,
  type KauflandSellerApiGetUnitByEANResponse,
  type KauflandSellerApiGetUnitsByEANParams,
  type KauflandSellerApiProductDataResponse,
  type KauflandSellerApiUnit,
} from "./kauflandSellerApi.types";

/**
 * Gets product data from Kaufland Seller API for a given EAN.
 *
 * @param tradingViewSymbol - The stock or crypto ticker symbol.
 *
 * @returns The product data from Kaufland Seller API.
 */
export async function kauflandSellerApiGetProductDataByEAN({
  ean,
}: KauflandSellerApiGetProductDataByEANParams): Promise<KauflandSellerApiProductDataResponse | null> {
  console.log(
    "kauflandSellerApiGetProductData - request initiated for EAN:",
    ean,
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const timestamp = dayjs().unix();
  const params = new URLSearchParams();
  params.append("storefront", KAUFLAND_DE_STOREFRONT);
  params.append("embedded", "category");
  params.append("embedded", "units");
  const url = `${KAUFLAND_SELLER_API_BASE_URL}/products/ean/${ean}?${params.toString()}`;

  const headers = {
    Accept: "application/json",
    "Shop-Client-Key": clientKey,
    "Shop-Timestamp": timestamp,
    "Shop-Signature": kauflandSellerApiSignRequest({
      method: KauflandSellerApiRequestMethod.GET,
      url,
      timestamp,
      secretKey,
    }),
    "User-Agent": KAUFLAND_SELLER_API_USER_AGENT,
  };

  try {
    const response = await axios.get(url, { headers });
    console.log(
      "kauflandSellerApiGetProductData - Kaufland Seller API Response Data:",
      response.data as KauflandSellerApiProductDataResponse,
    );
    if (response.data !== null) {
      return null;
    }
    return null;
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSellerApiGetProductData - Error:", error);
    throw error;
  }
}

/**
 * Creates a new unit listing in the Kaufland Seller API.
 *
 * @param productData - The product data used to create the unit listing.
 */
export async function kauflandSellerApiCreateNewUnit(
  productData: KauflandProductListing,
) {
  console.log(
    "kauflandSellerApiCreateNewListing - new inventory listing created",
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("storefront", KAUFLAND_DE_STOREFRONT);
  const url = `${KAUFLAND_SELLER_API_BASE_URL}/units?${params.toString()}`;
  const timestamp = dayjs().unix();
  const body = JSON.stringify(productData);

  const signature = kauflandSellerApiSignRequest({
    method: KauflandSellerApiRequestMethod.POST,
    url,
    body,
    timestamp,
    secretKey,
  });

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Shop-Client-Key": clientKey,
    "Shop-Signature": signature,
    "Shop-Timestamp": timestamp.toString(),
    "User-Agent": KAUFLAND_SELLER_API_USER_AGENT,
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      console.log(
        "kauflandSellerApiCreateNewListing - Product listed successfully.",
      );
    } else {
      console.log(
        `kauflandSellerApiCreateNewListing - Unexpected response: ${response.status}`,
      );
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSellerApiCreateNewListing - Error:", error);
    throw error;
  }
}

/**
 * Get the unit listings for a given EAN from the Kaufland Seller API.
 *
 * @param ean - The EAN of the product to get the unit listings for.
 * @param limit - The number of unit listings to return.
 * @param offset - The offset of the unit listings to return.
 * @param storefront - The storefront to get the unit listings for.
 * @param fulfillment_type - The fulfillment type to get the unit listings for.
 * @param embedded - The embedded data to get the unit listings for.
 *
 * @returns The unit listings for the given EAN.
 */
export async function kauflandSellerApiGetUnitsByEAN({
  ean,
  limit = 10,
  offset = 0,
  storefront = KAUFLAND_DE_STOREFRONT,
  fulfillment_type = KauflandSellerApiFulfillmentType.MERCHANT,
  embedded = "",
}: KauflandSellerApiGetUnitsByEANParams): Promise<KauflandSellerApiUnit[]> {
  console.log("kauflandSellerApiGetUnitsByEAN - get units by EAN initiated");
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const timestamp = dayjs().unix();
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  params.append("storefront", storefront);
  params.append("ean", ean);
  params.append("embedded", embedded);
  params.append("fulfillment_type", fulfillment_type);
  const url = `${KAUFLAND_SELLER_API_BASE_URL}/units?${params.toString()}`;

  const signature = kauflandSellerApiSignRequest({
    method: KauflandSellerApiRequestMethod.GET,
    url,
    body: "",
    timestamp,
    secretKey,
  });

  const headers = {
    Accept: "application/json",
    "Shop-Client-Key": clientKey,
    "Shop-Signature": signature,
    "Shop-Timestamp": timestamp.toString(),
    "User-Agent": KAUFLAND_SELLER_API_USER_AGENT,
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      console.log("kauflandSellerApiGetUnitsByEAN - data:", response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const responseData =
        response.data as KauflandSellerApiGetUnitByEANResponse;
      console.log(
        "kauflandSellerApiGetUnitsByEAN - Listed products found successfully.",
      );
      return responseData.data;
    } else {
      console.log(
        `kauflandSellerApiGetUnitsByEAN - Unexpected response: ${response.status}`,
      );
      throw new Error("Unexpected response");
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSellerApiGetUnitsByEAN - Error:", error);
    throw error;
  }
}

export const kauflandSellerApiDeleteAllUnitsUsingProductIds = async ({
  unitIds,
}: KauflandSellerApiDeleteAllUnitsUsingProductIds): Promise<void> => {
  console.log(
    "kauflandSellerApiDeleteAllUnitsUsingProductIds - delete all units initiated",
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  try {
    await Promise.all(
      unitIds.map(async (unitId: string) => {
        const timestamp = dayjs().unix();
        const params = new URLSearchParams();
        params.append("storefront", KAUFLAND_DE_STOREFRONT);
        const url = `${KAUFLAND_SELLER_API_BASE_URL}/units/${unitId}?${params.toString()}`;

        const signature = kauflandSellerApiSignRequest({
          method: KauflandSellerApiRequestMethod.DELETE,
          url,
          timestamp,
          secretKey,
        });

        const headers = {
          Accept: "*/*",
          "Shop-Client-Key": clientKey,
          "Shop-Signature": signature,
          "Shop-Timestamp": timestamp.toString(),
          "User-Agent": KAUFLAND_SELLER_API_USER_AGENT,
        };

        await axios.delete(url, { headers });
      }),
    );
  } catch (error) {
    Sentry.captureException(error);
    console.error(
      "kauflandSellerApiDeleteAllUnitsUsingProductIds - Error:",
      error,
    );
    throw error;
  }
};
