import { SITE_URL } from "@/lib/site-url";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

const PAGE = `${SITE_URL}/contact-us`;

export const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": "ContactPage",
      "@id": `${PAGE}#webpage`,
      url: PAGE,
      name: "Contact Us",
      description: "Contact Dr. Prema's team in Coimbatore to enquire about consultations and appointments.",
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteNode["@id"] },
      about: { "@id": doctorNode["@id"] },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Contact Us", item: PAGE },
      ],
    },
  ],
};
