import { getAuth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { amazonApi } from "~/scrapers/amazonApi/amazonApi";
import { type AmazonProductData } from "~/scrapers/amazonApi/amazonApi.types";
import { saveNewAmazonItem, updateProfitAndROI } from "~/server/queries";
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
  console.log("API called - addnewproductamazon");

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
        error: "EAN is required and should be a string",
      });
    }

    const amazonProductData: AmazonProductData = await amazonApi({ ean });
    if (!amazonProductData.productFound) {
      return res.status(400).json({ error: "Amazon product not found" });
    }

    await saveNewAmazonItem(ean, amazonProductData);
    await updateProfitAndROI(ean);

    return res.status(200).json({
      message: `Product with ${ean} successfully added to the product list`,
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);

    return res.status(500).json({
      error: `There was an error adding the product ${ean} to the product list`,
    });
  }
}
