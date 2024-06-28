import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { kauflandScrapper } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper";
import { type KauflandProductData } from "~/marketplaceConnectors/kaufland/kauflandScrapper/kauflandScrapper.types";
import {
  saveOrUpdateKauflandItemProductData,
  updateProfitAndROI,
} from "~/server/queries";

const addNewProductKauflandSchema = z.object({
  ean: z.string(),
});

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1m"),
  analytics: true,
});

/**
 * Endpoint to add new Kaufland product data to the database
 */
export async function POST(request: Request) {
  console.log("API called - addnewproductkaufland");
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
    const { ean } = addNewProductKauflandSchema.parse(json);

    const kauflandProductData: KauflandProductData = await kauflandScrapper({
      ean,
    });
    if (!kauflandProductData.productFound) {
      return new Response(
        JSON.stringify({ error: "Kaufland product not found" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    await saveOrUpdateKauflandItemProductData(ean, kauflandProductData);
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
}
