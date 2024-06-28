import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import dayjs from "dayjs";
import { ZodError } from "zod";
import {
  KAUFLAND_DE_STOREFRONT,
  KAUFLAND_SELLER_API_BASE_URL,
  KAUFLAND_SELLER_API_USER_AGENT,
} from "./kauflandSellerApi.constants";
import { kauflandSellerApiSignRequest } from "./kauflandSellerApi.helpers";
import {
  KauflandSellerApiFulfillmentType,
  KauflandSellerApiProductResponseSchema,
  KauflandSellerApiRequestMethod,
  type KauflandProductDataSchemaType,
  type KauflandProductListing,
  type KauflandSellerApiGetUnitByEANResponse,
  type KauflandSellerApiGetUnitsByEANParams,
  type KauflandSellerApiUnit,
} from "./kauflandSellerApi.types";

/**
 * Gets product data from Kaufland Seller API for a given EAN.
 *
 * @param ean - The EAN of the product to get data for.
 *
 * @returns The product data from Kaufland Seller API.
 */
export const kauflandSellerApiGetProductDataByEAN = async (
  ean: string,
): Promise<KauflandProductDataSchemaType | null> => {
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
      response.data,
    );

    const parasedResponse = KauflandSellerApiProductResponseSchema.parse(
      response.data,
    );

    return parasedResponse.data ? parasedResponse.data : null;
  } catch (error) {
    Sentry.captureException(error);
    if (error instanceof ZodError) {
      console.error(
        "kauflandSellerApiGetProductData - validation failed with ZodError:",
        error.errors,
      );
    } else {
      console.log("kauflandSellerApiGetProductData - error occurred", error);
    }
    return null;
  }
};

/**
 * Creates a new unit listing in the Kaufland Seller API.
 *
 * @param productData - The product data used to create the unit listing.
 */
export const kauflandSellerApiCreateNewUnit = async (
  productData: KauflandProductListing,
): Promise<void> => {
  console.log(
    "kauflandSellerApiCreateNewListing - new unit listing beginning to be created",
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("storefront", KAUFLAND_DE_STOREFRONT);
  const url = `${KAUFLAND_SELLER_API_BASE_URL}/units?${params.toString()}`;
  const timestamp = dayjs().unix();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { storefront, ...filteredProductData } = productData;
  const body = JSON.stringify(filteredProductData);

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
};

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
 * @returns An array of unit listings for the given EAN.
 */
export const kauflandSellerApiGetUnitsByEAN = async ({
  ean,
  limit = 10,
  offset = 0,
  storefront = KAUFLAND_DE_STOREFRONT,
  fulfillment_type = KauflandSellerApiFulfillmentType.MERCHANT,
  embedded = "",
}: KauflandSellerApiGetUnitsByEANParams): Promise<KauflandSellerApiUnit[]> => {
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
};

/**
 * Deletes the unit listings for a given EAN from the Kaufland Seller API.
 */
export const kauflandSellerApiDeleteAllUnitsUsingUnitIds = async (
  unitIds: string[],
): Promise<void> => {
  console.log(
    "kauflandSellerApiDeleteAllUnitsUsingProductIds - delete all units initiated",
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;

  try {
    const deleteUnitRequests: Promise<void>[] = unitIds.map(
      async (unitId: string) => {
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
      },
    );
    await Promise.all(deleteUnitRequests);
  } catch (error) {
    Sentry.captureException(error);
    console.error(
      "kauflandSellerApiDeleteAllUnitsUsingProductIds - Error:",
      error,
    );
    throw error;
  }
};
