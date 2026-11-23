import type { Metadata } from "next";
import { displayFont, bodyFont, nameFont, scriptFont } from "@/lib/fonts";
import Script from "next/script";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const GTM_ID = "GTM-TZCWLLPN";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Dr. Prema The Best & Trusted Gynaecologist In Coimbatore.",
  description:
    "Meet Dr. Prema, best gynaecologist in Coimbatore, for pregnancy care, women’s health consultations & personalised obstetric & gynaecological support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      style={{ colorScheme: "light" }}
      className={`${displayFont.variable} ${bodyFont.variable} ${nameFont.variable} ${scriptFont.variable} h-full bg-white antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <Script id="gtm" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({"gtm.start":new Date().getTime(),event:"gtm.js"});`}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`} strategy="afterInteractive" />
        {children}
      </body>
    </html>
  );
}
