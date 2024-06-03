import { type NextFontWithVariable } from "next/dist/compiled/@next/font";
import { Figtree } from "next/font/google";

export const figtree: NextFontWithVariable = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});
