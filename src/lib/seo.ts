import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

type Entry = { title: string; description: string };

// Approved SEO titles/descriptions, keyed by path ("" = home).
const PAGES: Record<string, Entry> = {
  "": {
    title: "Dr. Prema The Best & Trusted Gynaecologist In Coimbatore.",
    description:
      "Meet Dr. Prema, best gynaecologist in Coimbatore, for pregnancy care, women’s health consultations & personalised obstetric & gynaecological support.",
  },
  "/about-us": {
    title: "Learn About Dr. Prema, Gynaecologist in Coimbatore.",
    description:
      "Know more about Dr. Prema’s qualifications, experience and approach to obstetrics and gynaecology care for women in Coimbatore.",
  },
  "/service": {
    title: "Explore Gynaecology and Pregnancy Care Services in Coimbatore.",
    description:
      "Explore obstetric and gynaecology services with Dr. Prema in Coimbatore, including pregnancy care, childbirth support and treatment for women’s health",
  },
  "/patient-stories": {
    title: "Read Patient Stories About Dr. Prema in Coimbatore.",
    description:
      "Read patient stories shared about care with Dr. Prema and learn about their experiences with pregnancy support and gynaecological consultations.",
  },
  "/blog": {
    title: "Read Women’s Health Articles by Dr. Prema.",
    description:
      "Explore informative articles by Dr. Prema about pregnancy, PCOS, menstrual health, menopause & postpartum recovery to support women’s health",
  },
  "/contact-us": {
    title: "Contact Dr. Prema, Best Gynaecologist in Coimbatore.",
    description:
      "Looking for a gynaecologist near you in Coimbatore? Contact Dr. Prema for clinic details, consultation enquiries and appointment information.",
  },
  "/service/normal-delivery": {
    title: "Get Normal Delivery Care in Coimbatore with Dr. Prema.",
    description:
      "Learn about normal delivery care with Dr. Prema in Coimbatore, including pregnancy monitoring, labour guidance & support based on your medical needs.",
  },
  "/service/natural-birthing": {
    title: "Explore Natural Birthing Support in Coimbatore.",
    description:
      "Discover natural birthing support with Dr. Prema in Coimbatore, learn how birth planning & clinical guidance can support an individual pregnancy journey.",
  },
  "/service/waterbirthing": {
    title: "Learn About Waterbirthing Options in Coimbatore.",
    description:
      "Explore waterbirthing information with Dr. Prema in Coimbatore & discuss whether this birthing approach is suitable for your pregnancy & clinical needs.",
  },
  "/service/hydrotherapy-during-labour": {
    title: "Explore Hydrotherapy During Labour in Coimbatore.",
    description:
      "Learn how hydrotherapy during labour may support comfort and discuss its suitability with Dr. Prema as part of your childbirth care in Coimbatore.",
  },
  "/service/labour-pain-relief": {
    title: "Understand Labour Pain Relief Options in Coimbatore.",
    description:
      "Explore labour pain relief options with Dr. Prema in Coimbatore & discuss suitable approaches based on your preferences.",
  },
  "/service/vbac": {
    title: "Discuss VBAC Care with Dr. Prema in Coimbatore.",
    description:
      "Considering vaginal birth after caesarean in Coimbatore? Learn about VBAC assessment and discuss your birth options with Dr. Prema.",
  },
  "/service/high-risk-pregnancy-care": {
    title: "Find High-Risk Pregnancy Care in Coimbatore.",
    description:
      "Learn about high-risk pregnancy monitoring and obstetric care with Dr. Prema in Coimbatore, with guidance tailored to individual pregnancy needs.",
  },
  "/service/no-scar-hysterectomy": {
    title: "Learn About No-Scar Hysterectomy in Coimbatore.",
    description:
      "Explore no-scar hysterectomy information with Dr. Prema in Coimbatore and discuss suitable surgical options after an individual medical evaluation.",
  },
  "/service/pcos": {
    title: "Get PCOS Guidance from a Gynaecologist in Coimbatore.",
    description:
      "Learn about PCOS symptoms, evaluation and management with Dr. Prema, a gynaecologist in Coimbatore, and seek advice suited to your health needs.",
  },
  "/service/fertility-treatment": {
    title: "Explore Fertility Treatment Guidance in Coimbatore.",
    description:
      "Explore fertility evaluation and treatment guidance with Dr. Prema in Coimbatore & understand next steps based on your individual health assessment.",
  },
  "/service/uterine-fibroids": {
    title: "Understand Uterine Fibroid Care in Coimbatore.",
    description:
      "Learn about uterine fibroid symptoms, diagnosis and treatment options with Dr. Prema in Coimbatore through an individual clinical consultation.",
  },
  "/service/tubal-recanalisation": {
    title: "Learn About Tubal Recanalisation in Coimbatore.",
    description:
      "Understand tubal recanalisation and its possible role in fertility care with Dr. Prema in Coimbatore after a detailed assessment of your medical history.",
  },
  "/service/bleeding-menses-problems": {
    title: "Get Help for Menstrual Problems in Coimbatore.",
    description:
      "Consult Dr. Prema in Coimbatore for evaluation of heavy bleeding, irregular periods and other menstrual concerns with care based on your health needs.",
  },
  "/service/postpartum-care": {
    title: "Understand Postpartum Care with Dr. Prema in Coimbatore.",
    description:
      "Learn about postpartum recovery and follow-up care with Dr. Prema in Coimbatore, including support for physical wellbeing after childbirth.",
  },
};

/** Title, description and absolute canonical for a path; undefined if no approved entry. */
export function pageMetadata(path: string): Metadata {
  const entry = PAGES[path];
  if (!entry) return {};
  const url = `${SITE_URL}${path || "/"}`;
  return {
    title: { absolute: entry.title },
    description: entry.description,
    alternates: { canonical: url },
    openGraph: { title: entry.title, description: entry.description, url, type: "website", locale: "en_IN" },
  };
}
