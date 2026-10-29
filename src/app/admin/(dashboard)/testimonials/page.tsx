"use client";

import { useState, type FormEvent } from "react";
import { ChatCircleTextIcon as ChatCircleText, PencilSimpleIcon as PencilSimple, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminTestimonial } from "@/lib/admin-api";
import { serviceName } from "@/lib/services";
import {
  Button, Card, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, ImagePicker, PageBody, PageHeader, Pagination,
  ServiceSelect, StarInput, Stars, StatusPill, Tag, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam,
} from "@/components/admin/ui";

function TestimonialForm({ item, onClose, onSaved }: { item: AdminTestimonial | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item?.name ?? "");
  const [review, setReview] = useState(item?.review ?? "");
  const [rating, setRating] = useState(item?.rating ?? 5);
  const [serviceId, setServiceId] = useState(item ? item.serviceSlug : "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const [image, setImage] = useState<File | null>(null);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!serviceId) return;
    const form = new FormData();
    form.set("name", name);
    form.set("review", review);
    form.set("rating", String(rating));
    form.set("serviceSlug", serviceId);
    form.set("isEnabled", String(isEnabled));
    if (image) form.set("image", image);
    save(() => (item ? api.patch(`admin/testimonials/${item.id}`, form) : api.post("admin/testimonials", form)), item ? "Testimonial updated" : "Testimonial added");
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={item ? "Edit testimonial" : "Add testimonial"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="testimonial-form" loading={saving}>{item ? "Save changes" : "Add testimonial"}</Button>
        </>
      }
    >
      <form id="testimonial-form" onSubmit={submit} className="space-y-5">
        <Field label="Patient name" required>
          <input required minLength={2} maxLength={160} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ritu S." className={inputClass} />
        </Field>
        <Field label="Service" required hint="Decides which service page it appears on. Not shown on the card.">
          <ServiceSelect value={serviceId} onChange={setServiceId} />
        </Field>
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-rose-950">Rating</span>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <Field label="Review" required hint={`${review.length}/3000`}>
          <textarea required minLength={10} maxLength={3000} rows={6} value={review} onChange={(e) => setReview(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-rose-950">Patient photo <span className="font-normal text-rose-900/45">(optional)</span></span>
          <ImagePicker url={item?.imageUrl} onFile={setImage} aspect="aspect-[16/8]" />
        </div>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled reviews are hidden from the site." />
      </form>
    </Drawer>
  );
}

export default function AdminTestimonialsPage() {
  const m = useModule<AdminTestimonial>("testimonials", "Testimonial");
  const { data, loading, error, reload } = m.list;
  useNewParam(() => {
    m.setEditing("new");
  });

  return (
    <>
      <PageHeader
        title="Testimonials"
        subtitle="Patient stories shown on service pages and the Patient Stories page."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Add testimonial</Button>}
      />
      <PageBody>
        <FilterBar placeholder="Search name or review…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton />
        ) : !data?.items.length ? (
          <EmptyState icon={<ChatCircleText size={28} weight="duotone" />} title="No testimonials found" hint="Add a patient review or adjust your filters." action={<Button onClick={() => m.setEditing("new")}>Add testimonial</Button>} />
        ) : (
          <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
            {data.items.map((t) => (
              <Card key={t.id} className="flex flex-col p-6 transition-shadow hover:shadow-[0_18px_36px_-14px_rgba(232,64,122,0.3)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-rose-300 to-rose-500 font-display text-base font-semibold text-white">
                      {t.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.imageUrl} alt="" className="size-full object-cover" />
                      ) : (
                        t.name[0]?.toUpperCase()
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-rose-950">{t.name}</p>
                      <Stars value={t.rating} />
                    </div>
                  </div>
                  <StatusPill on={t.isEnabled} />
                </div>
                <p className="mt-4 line-clamp-5 flex-1 text-sm leading-relaxed text-rose-900/75">&ldquo;{t.review}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between gap-2 border-t border-rose-100/80 pt-4">
                  <Tag>{serviceName(t.serviceSlug)}</Tag>
                  <div className="flex items-center gap-2">
                    <Toggle checked={t.isEnabled} onChange={(v) => m.toggle(t, v)} label={`Enable testimonial from ${t.name}`} />
                    <Button variant="secondary" size="sm" aria-label="Edit" onClick={() => m.setEditing(t)}><PencilSimple size={14} weight="bold" /></Button>
                    <Button variant="danger" size="sm" aria-label="Delete" onClick={() => m.setToDelete(t)}><Trash size={14} weight="bold" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={m.setPage} />}
      </PageBody>

      {m.editing && (
        <TestimonialForm
          key={m.editing === "new" ? "new" : m.editing.id}
          item={m.editing === "new" ? null : m.editing}
          onClose={() => m.setEditing(null)}
          onSaved={() => {
            m.setEditing(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog open={Boolean(m.toDelete)} title="Delete this testimonial?" message={`The review from ${m.toDelete?.name} will be removed permanently.`} loading={m.busy} onConfirm={m.confirmDelete} onCancel={() => m.setToDelete(null)} />
    </>
  );
}
