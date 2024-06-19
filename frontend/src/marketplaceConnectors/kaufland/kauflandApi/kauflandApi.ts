import * as Sentry from "@sentry/nextjs";
import axios, { type AxiosResponse } from "axios";
import { signRequest } from "./kauflandApi.helpers";
import { type KauflandSellerProductApiResponse } from "./kauflandApi.types";

export async function kauflandApiGetProductData({
  ean,
}: {
  ean: string;
}): Promise<AxiosResponse<KauflandSellerProductApiResponse> | null> {
  console.log("Kaufland product API - request initiated for EAN:", ean);

  const baseUrl = "https://sellerapi.kaufland.com/v2";
  const clientKey = process.env.KAUFLAND_SELLER_CLIENT_KEY!;
  const secretKey = process.env.KAUFLAND_SELLER_SECRET_KEY!;
  const params = new URLSearchParams();
  params.append("storefront", "de");
  params.append("embedded", "category");
  params.append("embedded", "units");
  const uri = `${baseUrl}/products/ean/${ean}?${params.toString()}`;

  const timestamp = Math.floor(Date.now() / 1000);
  const userAgent = "test";
  const headers = {
    Accept: "application/json",
    "Shop-Client-Key": clientKey,
    "Shop-Timestamp": timestamp.toString(),
    "Shop-Signature": signRequest("GET", uri, "", timestamp, secretKey),
    "User-Agent": userAgent,
  };

  try {
    const response = await axios.get(uri, { headers });
    console.log("Kaufland Seller API Response Data:", response.data);
    if (response.data !== null) {
      return response as AxiosResponse<KauflandSellerProductApiResponse>;
    }
    return null;
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error:", error);

    return null;
  }
}
