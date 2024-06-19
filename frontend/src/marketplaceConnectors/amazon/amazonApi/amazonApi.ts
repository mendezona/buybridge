import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import {
  type AmazonProductData,
  type AmazonProductResponse,
} from "./amazonApi.types";

export async function amazonApi({
  ean,
}: {
  ean: string;
}): Promise<AmazonProductData> {
  console.log("Amazon product API - request initiated");

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
    const responseData: AmazonProductResponse =
      response.data as AmazonProductResponse;

    const amazonTitle: string | null = responseData.product.title ?? null;
    const amazonPrice: string =
      responseData.product.buybox_winner.price.value.toString() ?? null;
    const amazonLink: string | null = responseData.product.link ?? null;
    const productFound: boolean =
      !!amazonPrice || !!amazonLink || !!amazonTitle;

    if (productFound) {
      console.log("Amazon product API - product found");
      return {
        productFound,
        amazonTitle,
        amazonPrice,
        amazonLink,
      };
    } else {
      console.log("Amazon product API - product not found");
      return {
        productFound,
      };
    }
  } catch (error) {
    Sentry.captureException(error);
    console.log("Amazon product API - error occurred");
    console.error(error);

    return {
      productFound: false,
    };
  }
}
