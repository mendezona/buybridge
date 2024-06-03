import { getAuth } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextApiRequest, NextApiResponse } from "next";
import { kauflandScrapper } from "~/scrapers/kauflandScrapper/kauflandScrapper";
import { type KauflandProductData } from "~/scrapers/kauflandScrapper/kauflandScrapper.types";
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
    if (!success) throw new Error("Too many requests");

    if (!ean || typeof ean !== "string") {
      return res.status(400).json({
        message: "EAN is required and should be a string",
        data: null,
      });
    }

    const kauflandProductData: KauflandProductData = await kauflandScrapper({
      ean,
    });
    if (!kauflandProductData.productFound) {
      throw new Error("Kaufland product not found");
    }

    await saveNewKauflandItem(ean, kauflandProductData);
    await updateProfitAndROI(ean);

    res.status(200).json({
      message: `Product with ${ean} successfully added to the product list`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `There was an error adding the product ${ean} to the product list`,
      data: null,
    });
  }
}
