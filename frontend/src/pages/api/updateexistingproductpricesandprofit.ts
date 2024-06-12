import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await request.json();

  for (let i = 0; i < 10; i++) {
    await fetch("https://firstqstashmessage.requestcatcher.com/test", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return Response.json({ success: true });
}

export const POST = verifySignatureAppRouter(handler);
