import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PROJECT_NAME } from "~/components/constants";
import { figtree } from "~/components/fonts";
import { Toaster } from "~/components/ui/toaster";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: `%s |${PROJECT_NAME}`,
    default: `${PROJECT_NAME}`,
  },
  description: "Seamlessly Connect, Effortlessly Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body
          className={cn(
            "min-h-screen font-sans antialiased dark:bg-black",
            figtree.variable,
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
