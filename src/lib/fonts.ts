import { Cormorant_Garamond, Dancing_Script, Outfit, Work_Sans } from "next/font/google";

export const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const bodyFont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const nameFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-name",
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
  display: "swap",
});

export const scriptFont = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["500", "600"],
  display: "swap",
});
