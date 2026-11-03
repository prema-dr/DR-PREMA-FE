"use client";

import { useState } from "react";
import { EnvelopeOpenIcon as EnvelopeOpen, EnvelopeSimpleIcon as EnvelopeSimple, PhoneIcon as Phone, TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr";
import { api, errorMessage, type AdminEnquiry } from "@/lib/admin-api";
import {
  Button, Card, ConfirmDialog, EmptyState, ErrorState, GridSkeleton, PageBody, PageHeader, Pagination, SearchInput, Select, Tag,
  useDebounced, useFetch, useToast,
} from "@/components/admin/ui";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

export default function AdminEnquiriesPage() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<AdminEnquiry | null>(null);
  const [busy, setBusy] = useState(false);
  const debounced = useDebounced(search);

  const { data, loading, error, reload } = useFetch<{
    items: AdminEnquiry[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }>("admin/enquiries", { page, limit: 12, search: debounced, isRead: state });

  async function setRead(item: AdminEnquiry, isRead: boolean) {
    try {
      await api.patch(`admin/enquiries/${item.id}`, { isRead });
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await api.remove(`admin/enquiries/${toDelete.id}`);
      toast.success("Enquiry deleted");
      setToDelete(null);
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setBusy(false);
  }

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Messages sent through the website's contact form." />
      <PageBody>
        <div className="mb-6 flex flex-wrap gap-3">
          <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, email or message…" />
          <Select value={state} onChange={(v) => { setState(v); setPage(1); }} className="!w-auto min-w-[140px]">
            <option value="">All enquiries</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </Select>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={4} className="h-32" />
        ) : !data?.items.length ? (
          <EmptyState icon={<EnvelopeSimple size={28} weight="duotone" />} title="No enquiries yet" hint="Messages sent from the contact page will appear here." />
        ) : (
          <Card className={`divide-y divide-rose-100/80 overflow-hidden ${loading ? "opacity-60" : ""}`}>
            {data.items.map((e) => (
              <div key={e.id} className={`p-5 transition-colors ${e.isRead ? "" : "bg-rose-50/50"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!e.isRead && <span aria-label="Unread" className="size-2.5 rounded-full bg-rose-500" />}
                      <p className="font-display text-base font-semibold text-rose-950">{e.name}</p>
                      {e.topic && <Tag>{e.topic}</Tag>}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-rose-900/65">
                      <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1.5 hover:text-rose-700">
                        <EnvelopeSimple size={14} /> {e.email}
                      </a>
                      {e.phone && (
                        <a href={`tel:${e.phone}`} className="inline-flex items-center gap-1.5 hover:text-rose-700">
                          <Phone size={14} /> {e.phone}
                        </a>
                      )}
                      <span className="text-xs text-rose-900/45">{when(e.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setRead(e, !e.isRead)}>
                      <EnvelopeOpen size={14} weight="bold" /> {e.isRead ? "Mark unread" : "Mark read"}
                    </Button>
                    <Button variant="danger" size="sm" aria-label="Delete" onClick={() => setToDelete(e)}><Trash size={14} weight="bold" /></Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-rose-950/80">{e.message}</p>
              </div>
            ))}
          </Card>
        )}
        {data && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} total={data.meta.total} onPage={setPage} />}
      </PageBody>

      <ConfirmDialog open={Boolean(toDelete)} title="Delete this enquiry?" message={`The message from ${toDelete?.name ?? ""} will be removed permanently.`} loading={busy} onConfirm={confirmDelete} onCancel={() => setToDelete(null)} />
    </>
  );
}
