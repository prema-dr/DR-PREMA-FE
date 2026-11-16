"use client";

import { useState, type FormEvent } from "react";
import { PencilSimpleIcon as PencilSimple, PlayIcon as Play, PlayCircleIcon as PlayCircle, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, type AdminVideo } from "@/lib/admin-api";
import { serviceName } from "@/lib/services";
import {
  Button, ConfirmDialog, Drawer, EmptyState, ErrorState, Field, FilterBar, GridSkeleton, PageBody, PageHeader, Pagination,
  ServiceSelect, Tag, Toggle, ToggleRow, inputClass, useDrawerSave, useModule, useNewParam,
} from "@/components/admin/ui";

type Platform = "youtube" | "instagram";

const TABS: { id: Platform; label: string }[] = [
  { id: "youtube", label: "YouTube Shorts" },
  { id: "instagram", label: "Instagram Reels" },
];

const youTubeId = (url: string) =>
  (url.match(/youtu\.be\/([\w-]+)/) ?? url.match(/youtube\.com\/(?:shorts|embed|live)\/([\w-]+)/) ?? url.match(/[?&]v=([\w-]+)/))?.[1];

function instagramEmbedUrl(url: string) {
  const m = url.match(/instagram\.com\/(reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/);
  return m ? `https://www.instagram.com/${m[1] === "reels" ? "reel" : m[1]}/${m[2]}/embed/` : url;
}

// Same crop as the site's reel card: the Instagram embed is 336px wide with the 240x423 video at (48, 54).
const IG_BOX = 252;
const IG_SCALE = IG_BOX / 240;

/** The video's own preview: YouTube's thumbnail, or the Instagram embed cropped to just the video. */
function VideoPreview({ url, dimmed }: { url: string; dimmed: boolean }) {
  const yt = youTubeId(url);
  const fade = dimmed ? "grayscale opacity-60" : "";
  if (yt) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`} alt="" loading="lazy" className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${fade}`} />;
  }
  return (
    <span className={`block size-full overflow-hidden bg-black ${fade}`}>
      <iframe
        src={instagramEmbedUrl(url)}
        title="Instagram reel preview"
        loading="lazy"
        scrolling="no"
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 border-0"
        style={{ width: 336, height: 800, transformOrigin: "0 0", transform: `scale(${IG_SCALE}) translate(-48px, -54px)` }}
      />
    </span>
  );
}

function VideoForm({ item, onClose, onSaved }: { item: AdminVideo | null; onClose: () => void; onSaved: () => void }) {
  const [serviceId, setServiceId] = useState(item ? item.serviceSlug : "");
  const [videoUrl, setVideoUrl] = useState(item?.videoUrl ?? "");
  const [isEnabled, setIsEnabled] = useState(item?.isEnabled ?? true);
  const { saving, save } = useDrawerSave(onSaved);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!serviceId) return;
    const form = new FormData();
    form.set("serviceSlug", serviceId);
    form.set("videoUrl", videoUrl);
    form.set("isEnabled", String(isEnabled));
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
        <Field label="Video link" required hint="An Instagram reel/post or a YouTube video/short link">
          <input required type="url" maxLength={500} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.instagram.com/reel/… or https://www.youtube.com/watch?v=…" className={inputClass} />
        </Field>
        <Field label="Service" required>
          <ServiceSelect value={serviceId} onChange={setServiceId} />
        </Field>
        <ToggleRow checked={isEnabled} onChange={setIsEnabled} title="Enabled" hint="Disabled videos are hidden from the site." />
      </form>
    </Drawer>
  );
}

export default function AdminVideosPage() {
  const [platform, setPlatform] = useState<Platform>("youtube");
  const m = useModule<AdminVideo>("videos", "Video", 12, { platform });
  const { data, loading, error, reload } = m.list;
  useNewParam(() => m.setEditing("new"));

  return (
    <>
      <PageHeader
        title="Videos"
        subtitle="YouTube Shorts and Instagram reels shown on the home and service pages."
        actions={<Button onClick={() => m.setEditing("new")}><Plus size={16} weight="bold" /> Add video</Button>}
      />
      <PageBody>
        <div role="tablist" aria-label="Video type" className="mb-6 inline-flex gap-1 rounded-full border border-rose-100 bg-white p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={platform === t.id}
              onClick={() => {
                setPlatform(t.id);
                m.setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${platform === t.id ? "bg-rose-600 text-white" : "text-rose-900/70 hover:bg-rose-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <FilterBar placeholder="Search…" search={m.search} onSearch={m.setSearch} serviceId={m.serviceId} onService={m.setServiceId} state={m.state} onState={m.setState} />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={8} className="h-80" />
        ) : !data?.items.length ? (
          <EmptyState icon={<PlayCircle size={28} weight="duotone" />} title={platform === "youtube" ? "No YouTube Shorts found" : "No Instagram reels found"} hint="Add a link to show it on the website." action={<Button onClick={() => m.setEditing("new")}>Add video</Button>} />
        ) : (
          <div className={`grid gap-5 [grid-template-columns:repeat(auto-fill,252px)] ${loading ? "opacity-60" : ""}`}>
            {data.items.map((v) => (
              <div key={v.id} className="group overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-[0_2px_15px_-3px_rgba(232,64,122,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(232,64,122,0.35)]">
                <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" aria-label="Open video" className="relative block overflow-hidden bg-rose-50" style={{ aspectRatio: "240 / 423" }}>
                  <VideoPreview url={v.videoUrl} dimmed={!v.isEnabled} />
                  <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-rose-950/40 to-transparent">
                    <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-lg transition-transform group-hover:scale-110">
                      <Play size={20} weight="fill" />
                    </span>
                  </span>
                  {!v.isEnabled && <span className="absolute left-3 top-3 rounded-full bg-stone-900/70 px-2.5 py-1 text-[11px] font-semibold text-white">Disabled</span>}
                </a>
                <div className="flex items-center justify-between gap-2 p-3.5">
                  <Tag>{serviceName(v.serviceSlug)}</Tag>
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
