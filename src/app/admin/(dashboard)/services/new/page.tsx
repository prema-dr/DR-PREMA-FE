import { PageBody, PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <>
      <PageHeader title="Add service" subtitle="Create a new service page." back="/admin/services" />
      <PageBody>
        <ServiceForm />
      </PageBody>
    </>
  );
}
