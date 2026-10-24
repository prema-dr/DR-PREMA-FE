"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownIcon as ArrowDown,
  ArrowUpIcon as ArrowUp,
  FirstAidKitIcon as FirstAidKit,
  PencilSimpleIcon as PencilSimple,
  PlusIcon as Plus,
} from "@phosphor-icons/react/dist/ssr";
import { api, errorMessage, type AdminService } from "@/lib/admin-api";
import {
  Card, EmptyState, ErrorState, GridSkeleton, PageBody, PageHeader, StatusPill, Toggle, buttonClass, useFetch, useToast,
} from "@/components/admin/ui";

export default function AdminServicesPage() {
  const { data, loading, error, reload } = useFetch<AdminService[]>("admin/services");
  const [busy, setBusy] = useState<number | null>(null);
  const toast = useToast();

  async function toggle(service: AdminService, isEnabled: boolean) {
    setBusy(service.id);
    try {
      await api.patch(`admin/services/${service.id}`, { isEnabled });
      toast.success(`${service.name} ${isEnabled ? "enabled" : "disabled"}`);
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setBusy(null);
  }

  async function move(index: number, direction: -1 | 1) {
    if (!data) return;
    const ids = data.map((s) => s.id);
    [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
    setBusy(-1);
    try {
      await api.patch("admin/services/reorder", { ids });
      toast.success("Display order updated");
      reload();
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setBusy(null);
  }

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Each service has its own page; content you add elsewhere appears on the matching service."
        actions={
          <Link href="/admin/services/new" className={buttonClass()}>
            <Plus size={16} weight="bold" /> Add service
          </Link>
        }
      />
      <PageBody>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading && !data ? (
          <GridSkeleton count={5} className="h-24" />
        ) : !data?.length ? (
          <EmptyState icon={<FirstAidKit size={28} weight="duotone" />} title="No services yet" hint="Create your first service to start adding content." />
        ) : (
          <Card className="divide-y divide-rose-100/80 overflow-hidden">
            {data.map((service, index) => (
              <div key={service.id} className="flex flex-wrap items-center gap-4 p-4 transition-colors hover:bg-rose-50/40 sm:gap-5 sm:p-5">
                <div className="flex flex-col">
                  <button
                    type="button"
                    aria-label={`Move ${service.name} up`}
                    disabled={index === 0 || busy !== null}
                    onClick={() => move(index, -1)}
                    className="rounded-md p-1 text-rose-900/40 hover:bg-rose-100 hover:text-rose-700 disabled:opacity-25"
                  >
                    <ArrowUp size={14} weight="bold" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${service.name} down`}
                    disabled={index === data.length - 1 || busy !== null}
                    onClick={() => move(index, 1)}
                    className="rounded-md p-1 text-rose-900/40 hover:bg-rose-100 hover:text-rose-700 disabled:opacity-25"
                  >
                    <ArrowDown size={14} weight="bold" />
                  </button>
                </div>

                <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-rose-50">
                  {service.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.imageUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-rose-300">
                      <FirstAidKit size={26} weight="duotone" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 basis-56">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base font-semibold text-rose-950">{service.name}</p>
                    <StatusPill on={service.isEnabled} />
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-sm text-rose-900/60">{service.summary}</p>
                  <p className="mt-1 text-xs text-rose-900/40">/service/{service.slug}</p>
                </div>

                <div className="flex items-center gap-4">
                  <Toggle checked={service.isEnabled} disabled={busy === service.id} label={`Enable ${service.name}`} onChange={(v) => toggle(service, v)} />
                  <Link href={`/admin/services/${service.id}`} className={buttonClass("secondary", "sm")}>
                    <PencilSimple size={14} weight="bold" /> Edit
                  </Link>
                </div>
              </div>
            ))}
          </Card>
        )}
        {data && data.length > 1 && <p className="mt-4 text-xs text-rose-900/45">Use the arrows to change the order services appear in.</p>}
      </PageBody>
    </>
  );
}
