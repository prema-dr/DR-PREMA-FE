"use client";

import { use } from "react";
import { type AdminBlog } from "@/lib/admin-api";
import { ErrorState, GridSkeleton, PageBody, PageHeader, useFetch } from "@/components/admin/ui";
import { BlogForm } from "@/components/admin/BlogForm";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, error, reload } = useFetch<AdminBlog>(`admin/blogs/${id}`);

  if (data) return <BlogForm blog={data} />;
  return (
    <>
      <PageHeader title="Edit blog post" back="/admin/blog" />
      <PageBody>{error ? <ErrorState message={error} onRetry={reload} /> : <GridSkeleton count={2} className="h-80" />}</PageBody>
    </>
  );
}
