import { SITE_URL } from "@/lib/site-url";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

const PAGE = `${SITE_URL}/blog`;

export const blogSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": ["Blog", "CollectionPage"],
      "@id": `${PAGE}#blog`,
      url: PAGE,
      name: "Blog",
      description: "Read educational articles about gynaecology, pregnancy and women's health.",
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteNode["@id"] },
      about: { "@id": doctorNode["@id"] },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: PAGE },
      ],
    },
  ],
};
