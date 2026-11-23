import { SITE_URL } from "@/lib/site-url";
import { services } from "@/lib/services";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

const PAGE = `${SITE_URL}/service`;

export const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": "CollectionPage",
      "@id": `${PAGE}#webpage`,
      url: PAGE,
      name: "Services",
      description: `Explore ${services.length} obstetric, pregnancy, fertility and gynaecology services offered by Dr. Prema N. in Coimbatore.`,
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteNode["@id"] },
      about: { "@id": doctorNode["@id"] },
      mainEntity: {
        "@type": "ItemList",
        name: "Obstetrics and Gynaecology Services",
        numberOfItems: services.length,
        itemListElement: services.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `${PAGE}/${s.slug}`,
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Services", item: PAGE },
      ],
    },
  ],
};
