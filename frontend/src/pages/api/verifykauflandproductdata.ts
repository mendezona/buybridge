import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { kauflandApiGetProductData } from "~/scrapers/kauflandApi/kauflandApi";
import { type ProductResponse } from "~/scrapers/kauflandApi/kauflandApi.types";
import { type KauflandProductData } from "~/scrapers/kauflandScrapper/kauflandScrapper.types";
import { formatToTwoDecimalPlaces } from "~/scrapers/scrappers.helpers";
import { saveNewKauflandItem, updateProfitAndROI } from "~/server/queries";
import { type ApiReturnedData } from "../../api/api.types";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1m"),
  analytics: true,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiReturnedData>,
) {
  console.log("API called - addnewproductkaufland");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { ean }: { ean: string } = req.body;

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { success } = await rateLimit.limit(userId);
    if (!success) {
      throw new Error("Too many requests");
    }

    if (!ean || typeof ean !== "string") {
      return res.status(400).json({
        message: "EAN is required and should be a string",
        data: null,
      });
    }

    const officialKauflandSellerApiResponse = await kauflandApiGetProductData({
      ean,
    });
    const officialKauflandProductData = officialKauflandSellerApiResponse?.data
      .data as ProductResponse | null;

    if (!officialKauflandProductData) {
      return res.status(400).json({ error: "Kaufland product not found" });
    }

    const productFound = true;
    const productName = officialKauflandProductData.title;
    const kauflandProductId = officialKauflandProductData.id_product.toString();
    const kauflandLink = officialKauflandProductData.url;
    const kauflandVat = officialKauflandProductData.category.vat;
    const kauflandVariableFee =
      officialKauflandProductData.category.variable_fee;
    const kauflandFixedFee =
      officialKauflandProductData.category.fixed_fee.toString();

    let kauflandPrice: string | null = null;
    let kauflandShippingRate: string | null = null;

    if (officialKauflandProductData.units) {
      const units = Object.values(officialKauflandProductData.units);
      if (units.length > 0) {
        kauflandPrice = units[0]?.price
          ? formatToTwoDecimalPlaces(units[0]?.price).toString()
          : null;
        kauflandShippingRate = units[0]?.shipping_rate
          ? formatToTwoDecimalPlaces(units[0]?.shipping_rate)
          : null;
      }
    }

    const productData: KauflandProductData = {
      productFound,
      productName,
      kauflandProductId,
      kauflandPrice,
      kauflandLink,
      kauflandVat,
      kauflandVariableFee,
      kauflandFixedFee,
      kauflandShippingRate,
    };

    try {
      await saveNewKauflandItem(ean, productData);
      console.log("Kaufland product data saved successfully.");
    } catch (error) {
      console.error("Error saving product data:", error);
      Sentry.captureException(error);
    }

    await updateProfitAndROI(ean);

    return res.status(200).json({
      message: `Product with ${ean} successfully added to the product list`,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);

    return res.status(500).json({
      message: `There was an error adding the product ${ean} to the product list`,
      data: null,
    });
  }
}
