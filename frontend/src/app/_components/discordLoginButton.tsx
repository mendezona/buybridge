"use client";

import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import {
  DiscordLogoIcon,
  PaperPlaneIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export function DiscordLoginButton() {
  const ClerkLoaded = useClerk();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ClerkLoaded && !isLoading) {
      setIsLoading(true);
    }
  }, [ClerkLoaded, isLoading]);

  return (
    <div className="mr-2 h-9 w-full">
      {isLoading && (SignedIn || SignedOut) ? (
        <div className="w-full">
          <SignedIn>
            <Button
              variant="secondary"
              className="w-full rounded border border-border bg-purple-600 font-bold text-white transition-colors duration-300 ease-in-out hover:bg-purple-700"
            >
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button className="w-full rounded border border-border bg-purple-600  font-bold text-white transition-colors duration-300 ease-in-out hover:bg-purple-700">
                <DiscordLogoIcon className="mr-2 h-4 w-4" />
                Sign in with Discord
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      ) : (
        <Button
          disabled
          className="w-full rounded border border-border font-bold text-white transition-colors duration-300 ease-in-out"
        >
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          Loading Discord Login...
        </Button>
      )}
    </div>
  );
}
