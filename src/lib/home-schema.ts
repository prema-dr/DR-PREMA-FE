import { SITE_URL } from "@/lib/site-url";

const ID = {
  website: `${SITE_URL}/#website`,
  doctor: `${SITE_URL}/#dr-prema`,
  hospital: `${SITE_URL}/#kmch`,
  webpage: `${SITE_URL}/#webpage`,
  breadcrumb: `${SITE_URL}/#breadcrumb`,
};

const credential = (name: string, credentialCategory: string) => ({
  "@type": "EducationalOccupationalCredential",
  name,
  credentialCategory,
});

export const websiteNode = { "@type": "WebSite", "@id": ID.website, url: `${SITE_URL}/`, name: "Dr. Prema Gynaecologist", inLanguage: "en-IN" };

export const doctorNode = {
      "@type": "IndividualPhysician",
      "@id": ID.doctor,
      name: "Dr. Prema N.",
      description:
        "Consultant Obstetrician and Gynaecologist practising in Coimbatore, with clinical interests including high-risk obstetrics, VBAC, natural birthing, No-Scar Vaginal Hysterectomy and advanced laparoscopic procedures.",
      url: `${SITE_URL}/about-us`,
      telephone: "+91 73734 47104",
      email: "drpremagynaecologistcbe@gmail.com",
      medicalSpecialty: ["https://schema.org/Obstetric", "https://schema.org/Gynecologic"],
      hasCredential: [
        credential("MBBS", "Medical degree"),
        credential("MS (Obstetrics and Gynaecology)", "Postgraduate medical degree"),
        credential("DGO", "Medical diploma"),
        credential("DNB (Obstetrics and Gynaecology)", "Postgraduate medical qualification"),
        credential("FICOG", "Fellowship"),
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near KMCH Hospital, Indira Nagar, Civil Aerodrome Post",
        addressLocality: "Coimbatore",
        addressRegion: "Tamil Nadu",
        postalCode: "641014",
        addressCountry: "IN",
      },
      hospitalAffiliation: { "@id": ID.hospital },
    };

export const hospitalNode = {
      "@type": "Hospital",
      "@id": ID.hospital,
      name: "Kovai Medical Center & Hospital",
      address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    };

export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    websiteNode,
    doctorNode,
    hospitalNode,
    {
      "@type": "WebPage",
      "@id": ID.webpage,
      url: `${SITE_URL}/`,
      name: "Home",
      description: "Dr. Prema N. is a Consultant Obstetrician and Gynaecologist in Coimbatore.",
      inLanguage: "en-IN",
      isPartOf: { "@id": ID.website },
      about: { "@id": ID.doctor },
      mainEntity: { "@id": ID.doctor },
    },
    {
      "@type": "BreadcrumbList",
      "@id": ID.breadcrumb,
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }],
    },
  ],
};
