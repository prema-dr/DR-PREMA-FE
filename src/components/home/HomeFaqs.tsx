"use client";

import { useState } from "react";
import { MinusIcon as Minus, PlusIcon as Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/shared/Reveal";

// Answers draw on the About page and the individual service pages.
const FAQS = [
  {
    q: "Who is Dr. Prema N. and what does she specialise in?",
    a: "Dr. Prema N. is a Consultant Obstetrician and Gynaecologist (MBBS, MS (OBG), DGO, DNB (OBG), FICOG) with over two decades of experience in women's healthcare. Her specialised experience includes high-risk obstetrics, VBAC, natural and bio-mimic birthing, No Scar Vaginal Hysterectomy (NOVA) and advanced laparoscopic gynaecological procedures. She practises at Kovai Medical Center & Hospital, Coimbatore.",
  },
  {
    q: "Is normal delivery possible in every pregnancy?",
    a: "Not always. Some medical conditions, placental problems, foetal positions or complications during labour may make a caesarean section the safer option. Where it is suitable, Dr. Prema supports normal delivery, natural birthing and vaginal birth after caesarean (VBAC). The safest mode of delivery depends on the health of the mother and baby.",
  },
  {
    q: "Can I have a normal delivery with a high-risk pregnancy?",
    a: "Some women with high-risk pregnancies can deliver vaginally. The safest mode of delivery depends on the specific condition and how the mother and baby are doing, which is why high-risk pregnancies are monitored closely throughout.",
  },
  {
    q: "Are irregular periods normal, and when should I see a doctor?",
    a: "Some variation is common, particularly during adolescence and perimenopause. However, persistent irregularity, very heavy bleeding, severe period pain or a prolonged absence of periods should be evaluated, as they can point to conditions such as PCOS, fibroids or other hormonal problems that can often be managed effectively.",
  },
  {
    q: "What is a no-scar (NOVA) hysterectomy?",
    a: "In a no-scar vaginal hysterectomy, the uterus is removed through the vagina without an external abdominal incision. It is not the best option for every patient: vaginal, laparoscopic and abdominal hysterectomy each have specific indications, and the safest suitable route is chosen after an individual assessment.",
  },
];

export function HomeFaqs() {
  const [open, setOpen] = useState<number | null>(0);

  // -mb-24 cancels the footer's top margin so the FAQ band meets the footer; pb-44 keeps
  // the content clear of the footer that overlaps it.
  return (
    <section className="-mb-24 bg-rose-50/60 pb-44 pt-20">
      <Reveal className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-[22px] md:px-8 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16 lg:px-10">
        <div>
          <span className="inline-flex rounded-full border border-rose-400 px-3 py-1 text-xs font-semibold text-rose-600">
            FAQ
          </span>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-rose-950 md:text-5xl">
            Frequently
            <span className="block text-rose-600">Asked Questions</span>
          </h2>
          <p className="mt-5 text-rose-950/60">Your questions, answered.</p>
        </div>

        <ul className="space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = open === index;
            return (
              <li
                key={item.q}
                className={`rounded-2xl border bg-white transition-colors duration-300 ${
                  isOpen ? "border-rose-400 shadow-[0_14px_30px_-18px_rgba(225,29,72,0.35)]" : "border-rose-100"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-4 text-left"
                  >
                    <span className="text-[15.5px] font-semibold leading-snug text-rose-950">{item.q}</span>
                    <span className="shrink-0 text-rose-600">
                      {isOpen ? <Minus size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-rose-950/65">{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
