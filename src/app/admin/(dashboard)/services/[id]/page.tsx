"use client";

import { use } from "react";
import { type AdminService } from "@/lib/admin-api";
import { ErrorState, GridSkeleton, PageBody, PageHeader, useFetch } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, reload } = useFetch<AdminService>(`admin/services/${id}`);

  return (
    <>
      <PageHeader title={data ? `Edit ${data.name}` : "Edit service"} back="/admin/services" />
      <PageBody>
        {error ? <ErrorState message={error} onRetry={reload} /> : data ? <ServiceForm service={data} /> : <GridSkeleton count={2} className="h-72" />}
      </PageBody>
    </>
  );
}
