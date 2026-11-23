import { SITE_URL } from "@/lib/site-url";
import type { Service } from "@/lib/services";
import { doctorNode, hospitalNode, websiteNode } from "@/lib/home-schema";

// Hand-written descriptions; other services fall back to their summary.
// A string is used for both the Service and the page; an object sets them separately.
// `name` overrides the Service name (and the page name unless `pageName` is set);
// `crumb` overrides the breadcrumb label (default: the service's own name).
type Custom = { service: string; page: string; name?: string; pageName?: string; crumb?: string };
const DESCRIPTIONS: Record<string, string | Custom> = {
  "normal-delivery": "Obstetric consultation and support for vaginal birth when clinically appropriate.",
  "natural-birthing": "Guidance and support for a physiological approach to labour when medically appropriate.",
  waterbirthing: "Assessment and care for selected women considering waterbirthing.",
  "hydrotherapy-during-labour": "Warm water comfort measures and hydrotherapy options during labour.",
  "labour-pain-relief": {
    service: "Dr. Prema provides consultation and guidance on labour pain relief options based on individual pregnancy needs.",
    page: "Learn about labour pain relief options and personalised obstetric guidance from Dr. Prema in Coimbatore.",
  },
  vbac: {
    name: "VBAC (Vaginal Birth After Caesarean)",
    service: "Dr. Prema provides assessment and counselling for eligible women considering vaginal birth after a previous caesarean delivery.",
    page: "Explore VBAC assessment and counselling with Dr. Prema, a gynaecologist in Coimbatore.",
  },
  "no-scar-hysterectomy": {
    name: "No-Scar Vaginal Hysterectomy",
    pageName: "No-Scar Hysterectomy",
    crumb: "No-Scar Hysterectomy",
    service: "Dr. Prema provides assessment and consultation for No-Scar Vaginal Hysterectomy in appropriately selected cases.",
    page: "Learn about No-Scar Vaginal Hysterectomy and treatment assessment with Dr. Prema in Coimbatore.",
  },
  pcos: {
    name: "PCOS Assessment and Management",
    pageName: "PCOS Treatment and Management",
    crumb: "PCOS",
    service: "Dr. Prema provides individualised assessment and management for polycystic ovary syndrome and related women's health concerns.",
    page: "Understand PCOS assessment and personalised women's healthcare with Dr. Prema in Coimbatore.",
  },
  "fertility-treatment": {
    service: "Dr. Prema provides fertility evaluation and treatment guidance based on individual clinical assessment.",
    page: "Explore fertility evaluation and personalised reproductive healthcare guidance with Dr. Prema in Coimbatore.",
  },
  "uterine-fibroids": {
    name: "Uterine Fibroids Assessment and Treatment",
    pageName: "Uterine Fibroids Treatment",
    crumb: "Uterine Fibroids",
    service: "Dr. Prema provides assessment and guidance on appropriate treatment options for uterine fibroids.",
    page: "Learn about uterine fibroid assessment and personalised gynaecological care with Dr. Prema in Coimbatore.",
  },
  "tubal-recanalisation": {
    service: "Dr. Prema provides consultation and assessment regarding tubal recanalisation for suitable patients.",
    page: "Explore tubal recanalisation assessment and reproductive healthcare consultation with Dr. Prema in Coimbatore.",
  },
  "bleeding-menses-problems": {
    name: "Bleeding and Menstrual Problems",
    crumb: "Bleeding and Menstrual Problems",
    service: "Dr. Prema provides gynaecological assessment for irregular, heavy or painful menstrual bleeding and related concerns.",
    page: "Get information about menstrual health assessment and gynaecological care with Dr. Prema in Coimbatore.",
  },
  "postpartum-care": {
    name: "Postpartum Care and Support",
    crumb: "Postpartum Care",
    service: "Dr. Prema provides postpartum consultation and follow-up guidance for women's health and recovery after childbirth.",
    page: "Explore postpartum recovery guidance and women's healthcare consultation with Dr. Prema in Coimbatore.",
  },
  "high-risk-pregnancy-care": {
    service: "Dr. Prema provides obstetric assessment, monitoring and personalised care planning for pregnancies requiring specialised attention.",
    page: "Find specialised high-risk pregnancy assessment and obstetric care with Dr. Prema in Coimbatore.",
  },
};

export function serviceDetailSchema(service: Pick<Service, "slug" | "name" | "summary">) {
  const page = `${SITE_URL}/service/${service.slug}`;
  const custom = DESCRIPTIONS[service.slug] ?? service.summary;
  const {
    service: serviceDescription,
    page: pageDescription,
    name = service.name,
    pageName = name,
    crumb = service.name,
  }: Custom = typeof custom === "string" ? { service: custom, page: custom } : custom;

  return {
    "@context": "https://schema.org",
    "@graph": [
      websiteNode,
      doctorNode,
      hospitalNode,
      {
        "@type": "Service",
        "@id": `${page}#service`,
        name,
        serviceType: name,
        description: serviceDescription,
        provider: { "@id": doctorNode["@id"] },
        areaServed: { "@type": "City", name: "Coimbatore" },
      },
      {
        "@type": "MedicalWebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: pageName,
        description: pageDescription,
        inLanguage: "en-IN",
        isPartOf: { "@id": websiteNode["@id"] },
        about: { "@id": doctorNode["@id"] },
        mainEntity: { "@id": `${page}#service` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/service` },
          { "@type": "ListItem", position: 3, name: crumb, item: page },
        ],
      },
    ],
  };
}
