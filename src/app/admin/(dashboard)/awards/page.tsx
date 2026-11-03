"use client";

import { useState, type FormEvent } from "react";
import { TrophyIcon as Trophy, PencilSimpleIcon as PencilSimple, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminAward } from "@/lib/admin-api";
import {
  Button, Card, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, ImagePicker, PageBody, PageHeader, Pagination,
  StatusPill, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam,
} from "@/components/admin/ui";

function AwardForm({ item, onClose, onSaved }: { item: AdminAward | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [awardedBy, setAwardedBy] = useState(item?.awardedBy ?? "");
  
  const [year, setYear] = useState(item?.year ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const [image, setImage] = useState<File | null>(null);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    const form = new FormData();
    const body: Record<string, string> = { title, awardedBy, year, description };
    for (const [key, value] of Object.entries(body)) form.set(key, value);
    form.set("isEnabled", String(isEnabled));
    if (image) form.set("image", image);
    save(() => (item ? api.patch(`admin/awards/${item.id}`, form) : api.post("admin/awards", form)), item ? "Award updated" : "Award added");
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={item ? "Edit award" : "Add award"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="award-form" loading={saving}>{item ? "Save changes" : "Add award"}</Button>
        </>
      }
    >
      <form id="award-form" onSubmit={submit} className="space-y-5">
        <Field label="Award title" required>
          <input required minLength={2} maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Best Outgoing Doctor" className={inputClass} />
        </Field>
        <Field label="Awarded by" hint="Organisation that gave the award">
          <input maxLength={255} value={awardedBy} onChange={(e) => setAwardedBy(e.target.value)} placeholder="Indian Medical Association" className={inputClass} />
        </Field>
        <Field label="Year" hint="Shown on the card. Newest year is listed first.">
          <input maxLength={40} value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" className={inputClass} />
        </Field>
        <Field label="Description" hint={`${description.length}/1000`}>
          <textarea maxLength={1000} rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-rose-950">Photo <span className="font-normal text-rose-900/45">(optional)</span></span>
          <ImagePicker url={item?.imageUrl} onFile={setImage} />
        </div>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled entries are hidden from the About page." />
      </form>
    </Drawer>
  );
}

export default function AdminAwardsPage() {
  const m = useModule<AdminAward>("awards", "Award");
  const { data, loading, error, reload } = m.list;
  useNewParam(() => m.setEditing("new"));

  return (
    <>
      <PageHeader
        title="Awards"
        subtitle="Awards and honours shown on the About page."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Add award</Button>}
      />
      <PageBody>
        <FilterBar hideService placeholder="Search awards…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={4} className="h-28" />
        ) : !data?.items.length ? (
          <EmptyState icon={<Trophy size={28} weight="duotone" />} title="No awards yet" hint="Add one to show it on the About page." action={<Button onClick={() => m.setEditing("new")}>Add award</Button>} />
        ) : (
          <Card className={`divide-y divide-rose-100/80 overflow-hidden ${loading ? "opacity-60" : ""}`}>
            {data.items.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-rose-50/40">
                <span className="hidden size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-rose-50 text-rose-500 sm:flex">
                  {a.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <Trophy size={24} weight="duotone" />
                  )}
                </span>
                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold text-rose-950">{a.title}</p>
                    <StatusPill on={a.isEnabled} />
                  </div>
                  <p className="mt-0.5 text-sm text-rose-900/60">
                    {[a.awardedBy, a.year].filter(Boolean).join(" · ")}
                  </p>
                  {a.description && <p className="mt-1 line-clamp-2 text-sm text-rose-900/50">{a.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={a.isEnabled} onChange={(v) => m.toggle(a, v)} label={`Enable ${a.title}`} />
                  <Button variant="secondary" size="sm" aria-label="Edit" onClick={() => m.setEditing(a)}><PencilSimple size={14} weight="bold" /> Edit</Button>
                  <Button variant="danger" size="sm" aria-label="Delete" onClick={() => m.setToDelete(a)}><Trash size={14} weight="bold" /></Button>
                </div>
              </div>
            ))}
          </Card>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={m.setPage} />}
      </PageBody>

      {m.editing && (
        <AwardForm
          key={m.editing === "new" ? "new" : m.editing.id}
          item={m.editing === "new" ? null : m.editing}
          onClose={() => m.setEditing(null)}
          onSaved={() => {
            m.setEditing(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog open={Boolean(m.toDelete)} title="Delete this award?" message={`"${m.toDelete?.title}" will be removed permanently.`} loading={m.busy} onConfirm={m.confirmDelete} onCancel={() => m.setToDelete(null)} />
    </>
  );
}
