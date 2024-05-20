import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  checkUserIsInAuthorisedServer,
  fetchUserGuilds,
} from "./middleware.helpers";

export default clerkMiddleware(async (auth) => {
  const { userId } = auth();

  if (!userId) {
    console.error("No userId found");
    return NextResponse.next();
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      console.error("No user found");
      throw new Error("No user found");
    }

    const provider = "oauth_discord";
    const response = await clerkClient.users.getUserOauthAccessToken(
      userId,
      provider,
    );

    if (!response) {
      console.error("No OAuth access token found for provider", provider);
      throw new Error("No OAuth access token found");
    }

    const discordAccessToken =
      response?.data[0]?.token ?? "undefinedDiscordAccessToken";
    const guilds = await fetchUserGuilds(discordAccessToken);
    const isUserAuthorised = checkUserIsInAuthorisedServer(
      process.env.DISCORD_DROPSHIPPING_SERVER_ID ?? "undefinedDiscordServer",
      guilds,
    );

    return isUserAuthorised ? NextResponse.next() : NextResponse.error();
  } catch (error) {
    console.error("Failed to retrieve user or guild information:", error);
    return NextResponse.error();
  }
});

export const config = {
  matcher: ["/((?!.*..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
