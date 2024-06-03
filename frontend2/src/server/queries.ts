import { auth } from "@clerk/nextjs/server";
import "server-only";
import { db } from "./db";
import { items } from "./db/schema";
import { type Item } from "./queries.types";

export async function getAllItemsOrderedByProfit(): Promise<Item[]> {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  const dbItems = await db.select().from(items).orderBy(items.profit);
  return dbItems;
}
