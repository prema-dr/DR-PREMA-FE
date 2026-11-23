import { SITE_URL } from "@/lib/site-url";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

const PAGE = `${SITE_URL}/about-us`;

export const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": "AboutPage",
      "@id": `${PAGE}#webpage`,
      url: PAGE,
      name: "About Dr. Prema",
      description:
        "Learn about Dr. Prema N., her medical qualifications, experience and clinical interests in obstetrics and gynaecology.",
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteNode["@id"] },
      about: { "@id": doctorNode["@id"] },
      mainEntity: { "@id": doctorNode["@id"] },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "About Dr. Prema", item: PAGE },
      ],
    },
  ],
};
