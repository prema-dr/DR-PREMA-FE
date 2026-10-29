// Shape of a service's landing-page body, stored in src/data/service-content.json.
export type ServiceBlock =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "labels"; items: { label: string; text: string }[] };

export type ServiceSection = { heading: string; blocks: ServiceBlock[] };

export type ServiceContent = {
  sections: ServiceSection[];
  faqs: { q: string; a: string }[];
  closing: string[];
};
