import { SignInButton } from "@clerk/nextjs";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

export function DiscordLoginButton() {
  return (
    <SignInButton>
      <Button className="rounded bg-purple-600 px-4 py-2 font-bold text-white transition-colors duration-300 ease-in-out hover:bg-purple-700">
        <DiscordLogoIcon className="mr-2 h-4 w-4" />
        Sign in with Discord
      </Button>
    </SignInButton>
  );
}
