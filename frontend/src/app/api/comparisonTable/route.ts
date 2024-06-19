import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { db } from "~/server/db";
import { items } from "~/server/db/schema";

export async function POST(_request: Request) {
  console.log("API called - comparisonTable");
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dbItems = await db.select().from(items);

    return new Response(JSON.stringify(dbItems), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error fetching comparison table data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
