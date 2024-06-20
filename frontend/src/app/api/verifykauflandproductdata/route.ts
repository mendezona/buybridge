import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { type KauflandProductData } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper.types";
import { kauflandSellerApiGetProductData } from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi";
import { type ProductResponse } from "~/marketplaceConnectors/kaufland/kauflandSellerApi/kauflandSellerApi.types";
import { formatToTwoDecimalPlaces } from "~/marketplaceConnectors/scrappers.helpers";
import { saveNewKauflandItem, updateProfitAndROI } from "~/server/queries";

const verifyKauflandProductDataSchema = z.object({
  ean: z.string(),
});

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1m"),
  analytics: true,
});

export async function POST(request: Request) {
  console.log("API called - verifykauflandproductdata");
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const { success } = await rateLimit.limit(userId);
    if (!success) {
      throw new Error("Too many requests");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await request.json();
    const { ean } = verifyKauflandProductDataSchema.parse(json);

    const officialKauflandSellerApiResponse =
      await kauflandSellerApiGetProductData({
        ean,
      });
    const officialKauflandProductData = officialKauflandSellerApiResponse?.data
      .data as ProductResponse | null;
    if (!officialKauflandProductData) {
      return new Response(
        JSON.stringify({ error: "Kaufland product not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
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
    await saveNewKauflandItem(ean, productData);
    await updateProfitAndROI(ean);

    return new Response(
      JSON.stringify({
        message: `Product with ${ean} successfully added to the product list`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    Sentry.captureException(error);
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          detauks: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }
}
