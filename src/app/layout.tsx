import type { Metadata } from "next";
import { displayFont, bodyFont, nameFont, scriptFont } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr Prema | Gynecology & Women's Health",
  description:
    "Dr Prema's practice offers gynecology, obstetrics, and women's health care with unhurried, honest attention at every stage of life.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} ${nameFont.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
