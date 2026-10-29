"use client";

import { useState, type FormEvent } from "react";
import { ImagesIcon as Images, PencilSimpleIcon as PencilSimple, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminGalleryImage } from "@/lib/admin-api";
import { serviceName } from "@/lib/services";
import {
  Button, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, ImagePicker, PageBody, PageHeader, Pagination,
  ServiceSelect, Tag, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam, useToast,
} from "@/components/admin/ui";

function GalleryForm({ item, onClose, onSaved }: { item: AdminGalleryImage | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [serviceId, setServiceId] = useState(item ? item.serviceSlug : "");
  const [altText, setAltText] = useState(item?.altText ?? "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const [image, setImage] = useState<File | null>(null);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!item && !image) return toast.error("Choose an image to upload");
    if (!serviceId) return;
    const form = new FormData();
    form.set("serviceSlug", serviceId);
    form.set("altText", altText);
    form.set("isEnabled", String(isEnabled));
    if (image) form.set("image", image);
    save(() => (item ? api.patch(`admin/gallery/${item.id}`, form) : api.post("admin/gallery", form)), item ? "Image updated" : "Image uploaded");
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={item ? "Edit image" : "Upload image"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="gallery-form" loading={saving}>{item ? "Save changes" : "Upload"}</Button>
        </>
      }
    >
      <form id="gallery-form" onSubmit={submit} className="space-y-5">
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-rose-950">Image {!item && <span className="text-rose-600">*</span>}</span>
          <ImagePicker url={item?.imageUrl} onFile={setImage} aspect="aspect-[4/3]" />
        </div>
        <Field label="Service" required>
          <ServiceSelect value={serviceId} onChange={setServiceId} />
        </Field>
        <Field label="Alt text" required hint="Describe the image for accessibility and SEO.">
          <input required minLength={3} maxLength={255} value={altText} onChange={(e) => setAltText(e.target.value)} className={inputClass} />
        </Field>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled images are hidden from the site." />
      </form>
    </Drawer>
  );
}

export default function AdminGalleryPage() {
  const m = useModule<AdminGalleryImage>("gallery", "Image", 15);
  const { data, loading, error, reload } = m.list;
  useNewParam(() => m.setEditing("new"));

  return (
    <>
      <PageHeader
        title="Gallery"
        subtitle="Photos displayed on each service page."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Upload image</Button>}
      />
      <PageBody>
        <FilterBar placeholder="Search alt text…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={8} className="h-64" />
        ) : !data?.items.length ? (
          <EmptyState icon={<Images size={28} weight="duotone" />} title="No images yet" hint="Upload photos and assign them to a service." action={<Button onClick={() => m.setEditing("new")}>Upload image</Button>} />
        ) : (
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {data.items.map((img) => (
              <figure key={img.id} className="group overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-[0_2px_15px_-3px_rgba(232,64,122,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(232,64,122,0.35)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-rose-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt={img.altText} className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${img.isEnabled ? "" : "grayscale opacity-60"}`} />
                  {!img.isEnabled && <span className="absolute left-3 top-3 rounded-full bg-stone-900/70 px-2.5 py-1 text-[11px] font-semibold text-white">Disabled</span>}
                  <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button variant="secondary" size="sm" aria-label="Edit" onClick={() => m.setEditing(img)}><PencilSimple size={14} weight="bold" /></Button>
                    <Button variant="danger" size="sm" aria-label="Delete" onClick={() => m.setToDelete(img)}><Trash size={14} weight="bold" /></Button>
                  </div>
                </div>
                <figcaption className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-rose-950">{img.altText}</p>
                    <div className="mt-1.5"><Tag>{serviceName(img.serviceSlug)}</Tag></div>
                  </div>
                  <Toggle checked={img.isEnabled} onChange={(v) => m.toggle(img, v)} label={`Enable ${img.altText}`} />
                </figcaption>
              </figure>
            ))}
          </div>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={m.setPage} />}
      </PageBody>

      {m.editing && (
        <GalleryForm
          key={m.editing === "new" ? "new" : m.editing.id}
          item={m.editing === "new" ? null : m.editing}
          onClose={() => m.setEditing(null)}
          onSaved={() => {
            m.setEditing(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog open={Boolean(m.toDelete)} title="Delete this image?" message="The image will be removed permanently from the gallery." loading={m.busy} onConfirm={m.confirmDelete} onCancel={() => m.setToDelete(null)} />
    </>
  );
}
