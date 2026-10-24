"use client";

import { useState, type FormEvent } from "react";
import { InstagramLogoIcon as InstagramLogo, PencilSimpleIcon as PencilSimple, PlayIcon as Play, PlayCircleIcon as PlayCircle, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminVideo } from "@/lib/admin-api";
import {
  Button, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, ImagePicker, PageBody, PageHeader, Pagination,
  ServiceSelect, Tag, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam,
} from "@/components/admin/ui";

function VideoForm({ item, onClose, onSaved }: { item: AdminVideo | null; onClose: () => void; onSaved: () => void }) {
  const [serviceId, setServiceId] = useState(item ? String(item.serviceId) : "");
  const [videoUrl, setVideoUrl] = useState(item?.videoUrl ?? "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!serviceId) return;
    const form = new FormData();
    form.set("serviceId", serviceId);
    form.set("videoUrl", videoUrl);
    form.set("isEnabled", String(isEnabled));
    if (thumbnail) form.set("thumbnail", thumbnail);
    save(() => (item ? api.patch(`admin/videos/${item.id}`, form) : api.post("admin/videos", form)), item ? "Video updated" : "Video added");
  }

  return (
    <Drawer
      open
      onClose={onClose}
      title={item ? "Edit video" : "Add video"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="video-form" loading={saving}>{item ? "Save changes" : "Add video"}</Button>
        </>
      }
    >
      <form id="video-form" onSubmit={submit} className="space-y-5">
        <Field label="Instagram link" required hint="A reel or post link: https://www.instagram.com/reel/…">
          <input required type="url" maxLength={500} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.instagram.com/reel/…" className={inputClass} />
        </Field>
        <Field label="Service" required>
          <ServiceSelect value={serviceId} onChange={setServiceId} />
        </Field>
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-rose-950">Thumbnail <span className="font-normal text-rose-900/45">(optional)</span></span>
          <ImagePicker url={item?.thumbnailUrl} onFile={setThumbnail} aspect="aspect-[9/12]" />
        </div>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled videos are hidden from the site." />
      </form>
    </Drawer>
  );
}

export default function AdminVideosPage() {
  const m = useModule<AdminVideo>("videos", "Video", 12);
  const { data, loading, error, reload } = m.list;
  useNewParam(() => m.setEditing("new"));

  return (
    <>
      <PageHeader
        title="Videos"
        subtitle="Instagram reels linked from service pages."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Add video</Button>}
      />
      <PageBody>
        <FilterBar placeholder="Search…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={8} className="h-80" />
        ) : !data?.items.length ? (
          <EmptyState icon={<PlayCircle size={28} weight="duotone" />} title="No videos found" hint="Add an Instagram reel link to show it on the website." action={<Button onClick={() => m.setEditing("new")}>Add video</Button>} />
        ) : (
          <div className={`grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {data.items.map((v) => (
              <div key={v.id} className="group overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-[0_2px_15px_-3px_rgba(232,64,122,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(232,64,122,0.35)]">
                <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Open video on Instagram" className="relative block aspect-[9/12] overflow-hidden bg-rose-50">
                  {v.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.thumbnailUrl} alt="" className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${v.isEnabled ? "" : "grayscale opacity-60"}`} />
                  ) : (
                    <span className={`flex size-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 text-rose-400 ${v.isEnabled ? "" : "grayscale opacity-60"}`}>
                      <InstagramLogo size={40} weight="duotone" />
                      <span className="px-4 text-center text-xs text-rose-900/50">{v.videoUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}</span>
                    </span>
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-rose-950/40 to-transparent">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-lg transition-transform group-hover:scale-110">
                      <Play size={20} weight="fill" />
                    </span>
                  </span>
                  {!v.isEnabled && <span className="absolute left-3 top-3 rounded-full bg-stone-900/70 px-2.5 py-1 text-[11px] font-semibold text-white">Disabled</span>}
                </a>
                <div className="flex items-center justify-between gap-2 p-3.5">
                  <Tag>{v.service.name}</Tag>
                  <div className="flex items-center gap-1.5">
                    <Toggle checked={v.isEnabled} onChange={(on) => m.toggle(v, on)} label="Enable video" />
                    <Button variant="ghost" size="sm" aria-label="Edit" onClick={() => m.setEditing(v)}><PencilSimple size={15} weight="bold" /></Button>
                    <Button variant="ghost" size="sm" aria-label="Delete" onClick={() => m.setToDelete(v)}><Trash size={15} weight="bold" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={m.setPage} />}
      </PageBody>

      {m.editing && (
        <VideoForm
          key={m.editing === "new" ? "new" : m.editing.id}
          item={m.editing === "new" ? null : m.editing}
          onClose={() => m.setEditing(null)}
          onSaved={() => {
            m.setEditing(null);
            reload();
          }}
        />
      )}
      <ConfirmDialog open={Boolean(m.toDelete)} title="Delete this video?" message="The video will be removed from the website." loading={m.busy} onConfirm={m.confirmDelete} onCancel={() => m.setToDelete(null)} />
    </>
  );
}
