import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  checkUserIsInAuthorisedServer,
  fetchUserGuilds,
} from "./middleware.helpers";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  } else if (userId && isProtectedRoute(req)) {
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

      return isUserAuthorised
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
      console.error("Failed to retrieve user or guild information:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
