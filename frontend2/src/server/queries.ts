import { auth } from "@clerk/nextjs/server";
import "server-only";
import { db } from "./db";
import { items } from "./db/schema";

export async function getAllItems() {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");
  const dbItems = await db.select().from(items).orderBy(items.profit);
  return dbItems;
}
