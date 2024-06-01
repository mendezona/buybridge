import { auth } from "@clerk/nextjs/server";
import { type NextApiResponse } from "next";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";

export default async function handler(res: NextApiResponse) {
  try {
    const { userId } = auth();
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const dbItems = await db.select().from(items);
    return res.status(200).json(dbItems);
  } catch (error) {
    console.error("Error fetching comparison table data:", error);
    return res
      .status(500)
      .json({ error: "Error occurred while fetching comparison table data" });
  }
}
