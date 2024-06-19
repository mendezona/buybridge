import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { amazonApi } from "~/marketplaceConnectors/amazon/amazonApi/amazonApi";
import { type AmazonProductData } from "~/marketplaceConnectors/amazon/amazonApi/amazonApi.types";
import { saveNewAmazonItem, updateProfitAndROI } from "~/server/queries";

const addNewProductAmazonSchema = z.object({
  ean: z.string(),
});

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1m"),
  analytics: true,
});

export async function POST(request: Request) {
  console.log("API called - addnewproductamazon");
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
    const { ean } = addNewProductAmazonSchema.parse(json);

    const amazonProductData: AmazonProductData = await amazonApi({ ean });
    if (!amazonProductData.productFound) {
      return new Response(
        JSON.stringify({
          message: "Amazon product not found",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await saveNewAmazonItem(ean, amazonProductData);
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
