import * as Sentry from "@sentry/nextjs";
import axios, { type AxiosResponse } from "axios";
import dayjs from "dayjs";
import {
  KAUFLAND_DE_STOREFRONT,
  KAUFLAND_SELLER_API_BASE_URL,
  KAUFLAND_SELLER_API_USER_AGENT,
} from "./kauflandSellerApi.constants";
import { kauflandSellerApiSignRequest } from "./kauflandSellerApi.helpers";
import {
  KauflandSellerApiRequestMethod,
  type KauflandProductListing,
  type KauflandSellerApiGetProductDataByEANParams,
  type KauflandSellerApiProductDataResponse,
} from "./kauflandSellerApi.types";

export async function kauflandSellerApiGetProductDataByEAN({
  ean,
}: KauflandSellerApiGetProductDataByEANParams): Promise<AxiosResponse<KauflandSellerApiProductDataResponse> | null> {
  console.log(
    "kauflandSellerApiGetProductData - request initiated for EAN:",
    ean,
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("storefront", KAUFLAND_DE_STOREFRONT);
  params.append("embedded", "category");
  params.append("embedded", "units");
  const uri = `${KAUFLAND_SELLER_API_BASE_URL}/products/ean/${ean}?${params.toString()}`;

  const timestamp = dayjs().unix();
  const headers = {
    Accept: "application/json",
    "Shop-Client-Key": clientKey,
    "Shop-Timestamp": timestamp,
    "Shop-Signature": kauflandSellerApiSignRequest({
      method: KauflandSellerApiRequestMethod.GET,
      uri,
      body: "",
      timestamp,
      secretKey,
    }),
    "User-Agent": KAUFLAND_SELLER_API_USER_AGENT,
  };

  try {
    const response = await axios.get(uri, { headers });
    console.log(
      "kauflandSellerApiGetProductData - Kaufland Seller API Response Data:",
      response.data,
    );
    if (response.data !== null) {
      return response as AxiosResponse<KauflandSellerApiProductDataResponse>;
    }
    return null;
  } catch (error) {
    Sentry.captureException(error);
    console.error("kauflandSellerApiGetProductData - Error:", error);
    throw error;
  }
}

export async function kauflandSellerApiCreateNewListing(
  productData: KauflandProductListing,
) {
  console.log(
    "kauflandSellerApiCreateNewListing - new inventory listing created",
  );
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("storefront", KAUFLAND_DE_STOREFRONT);
  const uri = `${KAUFLAND_SELLER_API_BASE_URL}/units?${params.toString()}`;
  const timestamp = dayjs().unix();
  const body = JSON.stringify(productData);

  const signature = kauflandSellerApiSignRequest({
    method: KauflandSellerApiRequestMethod.POST,
    uri,
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
    const response = await axios.post(uri, body, { headers });
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
