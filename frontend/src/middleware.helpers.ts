import { type DiscordGuild } from "./middleware.types";

export async function fetchUserGuilds(
  accessToken: string,
): Promise<DiscordGuild[]> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user guilds from Discord");
  }

  return (await response.json()) as Promise<DiscordGuild[]>;
}

export function checkUserIsInAuthorisedServer(
  authorisedServer: string,
  guilds: DiscordGuild[],
): boolean {
  return guilds.some((guild) => guild.id === authorisedServer);
}
