import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";

const handler = async (_req: Request) => {
  try {
    console.log(
      "Cron job executed - Update Existing Product Prices and Profit",
    );
    return NextResponse.json(
      { message: "Cron job executed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Error executing cron job - Update Existing Product Prices and Profit:",
      error,
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};

export const POST = verifySignatureAppRouter(handler);
