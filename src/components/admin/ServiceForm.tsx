"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, errorMessage, type AdminService } from "@/lib/admin-api";
import { Button, Card, Field, ImagePicker, SectionTitle, ToggleRow, inputClass, useToast } from "@/components/admin/ui";

const ICONS = ["baby", "heart", "stethoscope", "flower", "drop", "pill", "first-aid", "shield-check", "calendar-check", "sparkle"];
const EMPTY_CONTENT = JSON.stringify({ sections: [], faqs: [], closing: [] }, null, 2);

export function ServiceForm({ service }: { service?: AdminService }) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(service);

  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [summary, setSummary] = useState(service?.summary ?? "");
  const [heroHeading, setHeroHeading] = useState(service?.heroHeading ?? "");
  const [heroSub, setHeroSub] = useState(service?.heroSub ?? "");
  const [iconKey, setIconKey] = useState(service?.iconKey ?? "");
  const [isEnabled, setIsEnabled] = useState(service?.isEnabled ?? true);
  const [content, setContent] = useState(service?.content ? JSON.stringify(service.content, null, 2) : EMPTY_CONTENT);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error();
    } catch {
      toast.error("Page content must be valid JSON object, e.g. { \"sections\": [] }");
      return;
    }

    const form = new FormData();
    form.set("name", name);
    form.set("summary", summary);
    form.set("heroHeading", heroHeading);
    form.set("heroSub", heroSub);
    form.set("iconKey", iconKey);
    form.set("isEnabled", String(isEnabled));
    form.set("content", JSON.stringify(parsed));
    if (slug) form.set("slug", slug);
    if (image) form.set("image", image);

    setSaving(true);
    try {
      if (service) await api.patch(`admin/services/${service.id}`, form);
      else await api.post("admin/services", form);
      toast.success(editing ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } catch (e) {
      toast.error(errorMessage(e));
      setSaving(false);
    }
  }

  return (
    <form id="service-form" onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6">
        <Card className="p-6">
          <SectionTitle title="Basics" hint="Shown on the service card and in navigation." />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Service name" required>
              <input required minLength={2} maxLength={160} value={name} onChange={(e) => setName(e.target.value)} placeholder="Normal Delivery" className={inputClass} />
            </Field>
            <Field
              label="URL slug"
              hint={editing ? "Changing the slug breaks existing links to this page." : "Leave empty to generate it from the name."}
            >
              <input pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Lowercase letters, numbers and dashes" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="normal-delivery" className={inputClass} />
            </Field>
            <Field label="Summary" required className="sm:col-span-2" hint={`${summary.length}/500`}>
              <textarea required maxLength={500} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Page hero" hint="The heading block at the top of the service page." />
          <div className="grid gap-5">
            <Field label="Hero heading" required>
              <input required maxLength={255} value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Hero subtext" required hint={`${heroSub.length}/500`}>
              <textarea required maxLength={500} rows={3} value={heroSub} onChange={(e) => setHeroSub(e.target.value)} className={`${inputClass} resize-none`} />
            </Field>
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Page content" hint="Sections, FAQs and closing text as JSON. Edit carefully; it is validated before saving." />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            rows={16}
            aria-label="Page content JSON"
            className={`${inputClass} resize-y font-mono text-[13px] leading-relaxed`}
          />
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <SectionTitle title="Service image" />
          <ImagePicker url={service?.imageUrl} onFile={setImage} />
        </Card>

        <Card className="space-y-5 p-6">
          <SectionTitle title="Settings" />
          <Field label="Icon key" hint="Name of the icon used on the website.">
            <input list="icon-keys" value={iconKey} onChange={(e) => setIconKey(e.target.value)} maxLength={60} placeholder="baby" className={inputClass} />
            <datalist id="icon-keys">
              {ICONS.map((i) => (
                <option key={i} value={i} />
              ))}
            </datalist>
          </Field>
          <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled services are hidden from the site." />
        </Card>

        <Button type="submit" form="service-form" loading={saving} className="w-full !py-3">
          {editing ? "Save changes" : "Create service"}
        </Button>
      </div>
    </form>
  );
}
