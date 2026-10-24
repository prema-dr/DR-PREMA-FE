export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/service", label: "Services" },
  { href: "/patient-stories", label: "Patient Stories" },
  { href: "/blog", label: "Blog" },
  { href: "/contact-us", label: "Contact" },
] as const;

export const WHATSAPP_URL =
  "https://wa.me/917373447104?text=" +
  encodeURIComponent("Hello Dr. Prema, I would like to book a consultation.");

export const PHONE_TEL = "tel:+917373447104";

export function whatsappLink(message: string) {
  return `https://wa.me/917373447104?text=${encodeURIComponent(message)}`;
}

// TODO: replace with the clinic's real channel/profile URLs
export const YOUTUBE_URL = "https://www.youtube.com/@dr_prema_gynaecologist_cbe";
export const INSTAGRAM_URL = "https://www.instagram.com/dr_prema_gynaecologist_cbe/";
