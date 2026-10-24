"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRightIcon as ArrowRight,
  CheckCircleIcon as CheckCircle,
  EnvelopeSimpleIcon as EnvelopeSimple,
  LockKeyIcon as LockKey,
  PaperPlaneTiltIcon as PaperPlaneTilt,
  PhoneIcon as Phone,
  UserIcon as User,
} from "@phosphor-icons/react/dist/ssr";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ["Pregnancy care", "Delivery options", "PCOS & periods", "Fertility", "Surgery", "Something else"];

const FIELD =
  "w-full rounded-2xl border border-rose-100 bg-rose-50/40 py-3.5 pl-12 pr-4 text-[15px] text-rose-950 outline-none transition-all placeholder:text-rose-950/40 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)] aria-[invalid=true]:border-rose-500";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [topic, setTopic] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    const nextErrors: Errors = {};
    if (!name) nextErrors.name = "Please share your name.";
    if (!email) nextErrors.email = "Please share an email address.";
    else if (!EMAIL_PATTERN.test(email)) nextErrors.email = "That email address doesn't look right.";
    if (!message) nextErrors.message = "Let us know what you'd like to ask.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSentTo(name.split(" ")[0]);
    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  }

  if (status === "success") {
    return (
      <div className="relative flex min-h-[32rem] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-rose-100 bg-white p-10 text-center shadow-[0_40px_80px_-44px_rgba(159,18,57,0.5)]">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-emerald-100/60 blur-3xl" />
        <span className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_18px_34px_-12px_rgba(16,185,129,0.7)] ring-8 ring-emerald-50">
          <CheckCircle size={44} weight="fill" />
        </span>
        <p className="relative mt-6 font-display text-3xl font-bold text-rose-950">Thank you, {sentTo}</p>
        <p className="relative mt-3 max-w-sm text-[15px] leading-relaxed text-rose-950/65">
          Your message has been sent. Our team typically replies within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setTopic(null);
          }}
          className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-50 active:scale-[0.98]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white shadow-[0_40px_80px_-44px_rgba(159,18,57,0.5)]"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-rose-700 to-rose-800 px-7 py-7 md:px-10">
        <PaperPlaneTilt size={130} weight="light" aria-hidden className="pointer-events-none absolute -right-4 -top-4 rotate-12 text-white/10" />
        <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-rose-100">Send a message</p>
        <h2 className="relative mt-1.5 font-display text-2xl font-bold text-white md:text-3xl">How can we help you?</h2>
      </div>

      <div className="flex flex-col gap-6 p-7 md:p-10">
        <fieldset>
          <legend className="text-sm font-semibold text-rose-950">What is your question about?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = t === topic;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTopic(on ? null : t)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                    on
                      ? "border-rose-600 bg-rose-600 text-white shadow-[0_10px_20px_-10px_rgba(225,29,72,0.7)]"
                      : "border-rose-200 bg-white text-rose-700 hover:border-rose-300 hover:bg-rose-50"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-semibold text-rose-950">Name</label>
            <div className="relative mt-2">
              <User size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input id="name" name="name" type="text" autoComplete="name" className={FIELD} placeholder="Your full name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            </div>
            {errors.name && <p id="name-error" className="mt-1.5 text-xs font-medium text-rose-700">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-semibold text-rose-950">
              Phone <span className="font-normal text-rose-950/45">(optional)</span>
            </label>
            <div className="relative mt-2">
              <Phone size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={FIELD} placeholder="+91" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-semibold text-rose-950">Email</label>
          <div className="relative mt-2">
            <EnvelopeSimple size={20} weight="light" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
            <input id="email" name="email" type="email" autoComplete="email" className={FIELD} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
          </div>
          {errors.email && <p id="email-error" className="mt-1.5 text-xs font-medium text-rose-700">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-semibold text-rose-950">Your question</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="mt-2 w-full resize-none rounded-2xl border border-rose-100 bg-rose-50/40 px-5 py-3.5 text-[15px] text-rose-950 outline-none transition-all placeholder:text-rose-950/40 focus:border-rose-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(244,63,94,0.12)] aria-[invalid=true]:border-rose-500"
            placeholder={topic ? `Tell us about your ${topic.toLowerCase()} question…` : "What would you like to ask?"}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && <p id="message-error" className="mt-1.5 text-xs font-medium text-rose-700">{errors.message}</p>}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-rose-600 px-8 py-4 text-sm font-bold text-white shadow-[0_16px_30px_-12px_rgba(225,29,72,0.7)] transition-all hover:-translate-y-0.5 hover:bg-rose-700 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-70"
          >
            {status === "submitting" ? "Sending…" : "Send Message"}
            <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-rose-950/55 sm:max-w-[16rem]">
            <LockKey size={16} weight="light" className="mt-0.5 shrink-0 text-rose-400" />
            General questions only. This form does not book or schedule appointments.
          </p>
        </div>
      </div>
    </form>
  );
}
