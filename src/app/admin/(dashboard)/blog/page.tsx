"use client";

import Link from "next/link";
import { useState } from "react";
import { NotePencilIcon as NotePencil, PencilSimpleIcon as PencilSimple, PlusIcon as Plus, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, errorMessage, formatDate, type AdminBlog, type Paginated } from "@/lib/admin-api";
import { serviceName } from "@/lib/services";
import {
  Card, ConfirmDialog, EmptyState, ErrorState, GridSkeleton, PageBody, PageHeader, Pagination, SearchInput, Select, ServiceSelect, StatusPill, Tag,
  Toggle, buttonClass, useDebounced, useFetch, useToast, Button,
} from "@/components/admin/ui";

export default function AdminBlogListPage() {
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<AdminBlog | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const debounced = useDebounced(search);
  const { data, loading, error, reload } = useFetch<Paginated<AdminBlog>>("admin/blogs", {
    page, limit: 10, search: debounced, serviceSlug: serviceId, status,
  });

  const filter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  async function togglePublish(blog: AdminBlog, isPublished: boolean) {
    try {
      await api.patch(`admin/blogs/${blog.id}/publish`, { isPublished });
      toast.success(isPublished ? "Post published" : "Post moved to drafts");
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api.remove(`admin/blogs/${toDelete.id}`);
      toast.success("Blog post deleted");
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setBusy(false);
  }

  return (
    <>
      <PageHeader
        title="Blogs"
        subtitle="Articles shown on the Blog page and their service pages."
        actions={
          <Link href="/admin/blog/new" className={buttonClass()}>
            <Plus size={16} weight="bold" /> New post
          </Link>
        }
      />
      <PageBody>
        <div className="mb-6 flex flex-wrap gap-3">
          <SearchInput value={search} onChange={filter(setSearch)} placeholder="Search by title…" />
          <ServiceSelect value={serviceId} onChange={filter(setServiceId)} allLabel="All services" className="!w-auto min-w-[180px]" />
          <Select value={status} onChange={filter(setStatus)} className="!w-auto min-w-[140px]">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </Select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={5} className="h-24" />
        ) : !data?.items.length ? (
          <EmptyState
            icon={<NotePencil size={28} weight="duotone" />}
            title="No blog posts found"
            hint={search || serviceId || status ? "Try changing your filters." : "Write your first article to get started."}
            action={<Link href="/admin/blog/new" className={buttonClass()}>New post</Link>}
          />
        ) : (
          <Card className={`divide-y divide-rose-100/80 overflow-hidden transition-opacity ${loading ? "opacity-60" : ""}`}>
            {data.items.map((blog) => (
              <div key={blog.id} className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-rose-50/40 sm:gap-5 sm:p-5">
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-rose-50">
                  {blog.featuredImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={blog.featuredImageUrl} alt={blog.imageAlt ?? ""} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-rose-300">
                      <NotePencil size={24} weight="duotone" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 basis-60">
                  <Link href={`/admin/blog/${blog.id}`} className="line-clamp-1 font-display text-base font-semibold text-rose-950 hover:text-rose-600">
                    {blog.title}
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-sm text-rose-900/55">{blog.excerpt}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-rose-900/50">
                    <Tag>{serviceName(blog.serviceSlug)}</Tag>
                    <span>{formatDate(blog.publishDate)}</span>
                    <span>· {blog.readTimeMinutes} min read</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {blog.isPublished && new Date(blog.publishDate) > new Date() ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Scheduled</span>
                  ) : (
                    <StatusPill on={blog.isPublished} onLabel="Published" offLabel="Draft" />
                  )}
                  <Toggle checked={blog.isPublished} onChange={(v) => togglePublish(blog, v)} label={`Publish ${blog.title}`} />
                  <Link href={`/admin/blog/${blog.id}`} aria-label="Edit" className={buttonClass("secondary", "sm")}>
                    <PencilSimple size={14} weight="bold" /> Edit
                  </Link>
                  <Button variant="danger" size="sm" aria-label={`Delete ${blog.title}`} onClick={() => setToDelete(blog)}>
                    <Trash size={14} weight="bold" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={setPage} />}
      </PageBody>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this post?"
        message={`"${toDelete?.title}" will be removed permanently.`}
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
