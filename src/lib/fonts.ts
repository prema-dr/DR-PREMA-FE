import localFont from "next/font/local";

// Self-hosted (variable fonts) so builds don't need network access to Google Fonts.
export const displayFont = localFont({
  src: "../assets/fonts/Outfit.woff2",
  variable: "--font-display",
  weight: "400 700",
  display: "swap",
});

export const bodyFont = localFont({
  src: "../assets/fonts/WorkSans.woff2",
  variable: "--font-body",
  weight: "400 600",
  display: "swap",
});

export const nameFont = localFont({
  src: [
    { path: "../assets/fonts/CormorantGaramond.woff2", weight: "400 600", style: "normal" },
    { path: "../assets/fonts/CormorantGaramond-Italic.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-name",
  display: "swap",
});

export const scriptFont = localFont({
  src: "../assets/fonts/DancingScript.woff2",
  variable: "--font-script",
  weight: "500 600",
  display: "swap",
});
