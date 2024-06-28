import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { ZodError } from "zod";
import {
  asinDataProductDataApiResponseSchema,
  type AmazonProductData,
} from "./asinDataApi.types";

/**
 * Gets the product data for an Amazon product from the ASIN Data Product Data API.
 *
 * @param ean - EAN of the product to get data for.

 * @returns - An Amazon Product Data object containing the product data.
 *
 */
export const asinDataProductDataApiAGetProductData = async (
  ean: string,
): Promise<AmazonProductData> => {
  console.log("asinDataProductDataApi - request initiated for EAN:", ean);

  const params = {
    api_key: process.env.ASIN_DATA_API_KEY,
    amazon_domain: process.env.ASIN_DATA_API_COUNTRY,
    type: "product",
    gtin: ean,
    output: "json",
    include_summarization_attributes: "false",
    include_html: "false",
    language: "en_GB",
  };

  try {
    const response = await axios.get("https://api.asindataapi.com/request", {
      params,
    });
    const responseData = asinDataProductDataApiResponseSchema.parse(
      response.data,
    );
    const amazonTitle: string | null = responseData?.product?.title ?? null;
    const amazonPrice: string | null =
      responseData?.product?.buybox_winner?.price?.value?.toString() ?? null;
    const amazonLink: string | null = responseData?.product?.link ?? null;
    const productFound: boolean =
      !!amazonPrice || !!amazonLink || !!amazonTitle;

    if (productFound) {
      console.log("asinDataProductDataApi - product found for EAN", ean);
      return {
        productFound,
        amazonTitle,
        amazonPrice,
        amazonLink,
      };
    } else {
      console.log("asinDataProductDataApi- product not found for EAN", ean);
      return {
        productFound,
      };
    }
  } catch (error) {
    Sentry.captureException(error);
    if (error instanceof ZodError) {
      console.error(
        "asinDataProductDataApi - validation failed with ZodError:",
        error.errors,
      );
    } else {
      console.log("asinDataProductDataApi - error occurred", error);
    }
    throw error;
  }
};
