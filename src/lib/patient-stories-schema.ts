import { SITE_URL } from "@/lib/site-url";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

const PAGE = `${SITE_URL}/patient-stories`;

export const patientStoriesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": "CollectionPage",
      "@id": `${PAGE}#webpage`,
      url: PAGE,
      name: "Patient Stories",
      description: "Read patient stories shared with permission about care received from Dr. Prema N.",
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteNode["@id"] },
      about: { "@id": doctorNode["@id"] },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Patient Stories", item: PAGE },
      ],
    },
  ],
};
