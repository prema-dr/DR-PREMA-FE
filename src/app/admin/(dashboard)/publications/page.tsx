"use client";

import { useState, type FormEvent } from "react";
import { ArrowSquareOutIcon as ArrowSquareOut, BooksIcon as Books, PencilSimpleIcon as PencilSimple, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminPublication } from "@/lib/admin-api";
import { serviceName } from "@/lib/services";
import {
  Button, Card, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, PageBody, PageHeader, Pagination,
  ServiceSelect, StatusPill, Tag, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam,
} from "@/components/admin/ui";

function PublicationForm({ item, onClose, onSaved }: { item: AdminPublication | null; onClose: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [serviceId, setServiceId] = useState(item ? item.serviceSlug : "");
  const [shortDescription, setShortDescription] = useState(item?.shortDescription ?? "");
  const [url, setUrl] = useState(item?.url ?? "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!serviceId) return;
    const body = { title, serviceSlug: serviceId, shortDescription, url, isEnabled };
    save(() => (item ? api.patch(`admin/publications/${item.id}`, body) : api.post("admin/publications", body)), item ? "Publication updated" : "Publication added");
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={item ? "Edit publication" : "Add publication"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="publication-form" loading={saving}>{item ? "Save changes" : "Add publication"}</Button>
        </>
      }
    >
      <form id="publication-form" onSubmit={submit} className="space-y-5">
        <Field label="Title" required>
          <input required minLength={3} maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Service" required>
          <ServiceSelect value={serviceId} onChange={setServiceId} />
        </Field>
        <Field label="Short description" required hint={`${shortDescription.length}/500`}>
          <textarea required minLength={5} maxLength={500} rows={4} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={`${inputClass} resize-none`} />
        </Field>
        <Field label="Publication link" required hint="Google Scholar, journal page, etc. Opens in a new tab.">
          <input required type="url" maxLength={500} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={inputClass} />
        </Field>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled publications are hidden from the site." />
      </form>
    </Drawer>
  );
}

export default function AdminPublicationsPage() {
  const m = useModule<AdminPublication>("publications", "Publication");
  const { data, loading, error, reload } = m.list;
  useNewParam(() => m.setEditing("new"));

  return (
    <>
      <PageHeader
        title="Publications"
        subtitle="Research papers and articles linked from service pages."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Add publication</Button>}
      />
      <PageBody>
        <FilterBar placeholder="Search publications…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={4} className="h-28" />
        ) : !data?.items.length ? (
          <EmptyState icon={<Books size={28} weight="duotone" />} title="No publications found" hint="Add a publication link or adjust your filters." action={<Button onClick={() => m.setEditing("new")}>Add publication</Button>} />
        ) : (
          <Card className={`divide-y divide-rose-100/80 overflow-hidden ${loading ? "opacity-60" : ""}`}>
            {data.items.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-4 p-5 transition-colors hover:bg-rose-50/40">
                <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 sm:flex">
                  <Books size={22} weight="duotone" />
                </span>
                <div className="min-w-0 flex-1 basis-64">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold text-rose-950">{p.title}</p>
                    <StatusPill on={p.isEnabled} />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-rose-900/60">{p.shortDescription}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <Tag>{serviceName(p.serviceSlug)}</Tag>
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[16rem] items-center gap-1 truncate text-rose-600 hover:text-rose-800">
                      <ArrowSquareOut size={13} /> <span className="truncate">{p.url.replace(/^https?:\/\//, "")}</span>
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Toggle checked={p.isEnabled} onChange={(v) => m.toggle(p, v)} label={`Enable ${p.title}`} />
                  <Button variant="secondary" size="sm" aria-label="Edit" onClick={() => m.setEditing(p)}><PencilSimple size={14} weight="bold" /> Edit</Button>
                  <Button variant="danger" size="sm" aria-label="Delete" onClick={() => m.setToDelete(p)}><Trash size={14} weight="bold" /></Button>
                </div>
              </div>
            ))}
          </Card>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={m.setPage} />}
      </PageBody>

      {m.editing && (
        <PublicationForm
          key={m.editing === "new" ? "new" : m.editing.id}
          item={m.editing === "new" ? null : m.editing}
          onClose={() => m.setEditing(null)}
          onSaved={() => {
            m.setEditing(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog open={Boolean(m.toDelete)} title="Delete this publication?" message={`"${m.toDelete?.title}" will be removed permanently.`} loading={m.busy} onConfirm={m.confirmDelete} onCancel={() => m.setToDelete(null)} />
    </>
  );
}
