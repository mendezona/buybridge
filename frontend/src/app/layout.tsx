import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "~/components/ui/toaster";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import { TRPCReactProvider } from "~/trpc/react";
import { PROJECT_NAME } from "./ui/constants";
import { figtree } from "./ui/fonts";

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
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen font-sans antialiased dark:bg-black",
          figtree.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <TRPCReactProvider>
              {children}
              <Toaster />
            </TRPCReactProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
