"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, errorMessage, type AdminBlog } from "@/lib/admin-api";
import {
  Button, Card, Field, ImagePicker, PageBody, PageHeader, SectionTitle, ServiceSelect, ToggleRow, inputClass, useToast,
} from "@/components/admin/ui";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

function toLocalInput(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").trim();

export function BlogForm({ blog }: { blog?: AdminBlog }) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(blog);

  const [title, setTitle] = useState(blog?.title ?? "");
  const [serviceId, setServiceId] = useState(blog ? blog.serviceSlug : "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [urlRewrite, setUrlRewrite] = useState(blog?.urlRewrite ?? "");
  const [metaTitle, setMetaTitle] = useState(blog?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(blog?.metaDescription ?? "");
  const [imageAlt, setImageAlt] = useState(blog?.imageAlt ?? "");
  const [publishDate, setPublishDate] = useState(toLocalInput(blog?.publishDate));
  const [isPublished, setIsPublished] = useState(blog?.isPublished ?? false);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [now] = useState(() => Date.now());
  const scheduled = isPublished && new Date(publishDate).getTime() > now;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (stripTags(content).length < 10) return toast.error("Write at least a sentence of content");
    if (!serviceId) return toast.error("Choose a service");
    if (image && !imageAlt.trim()) return toast.error("Add alt text for the featured image");

    const form = new FormData();
    form.set("title", title);
    form.set("serviceSlug", serviceId);
    form.set("content", content);
    form.set("publishDate", new Date(publishDate).toISOString());
    form.set("isPublished", String(isPublished));
    form.set("metaTitle", metaTitle);
    form.set("metaDescription", metaDescription);
    form.set("imageAlt", imageAlt);
    form.set("urlRewrite", urlRewrite);
    if (slug) form.set("slug", slug);
    if (excerpt.trim()) form.set("excerpt", excerpt);
    if (image) form.set("featuredImage", image);

    setSaving(true);
    try {
      if (blog) await api.patch(`admin/blogs/${blog.id}`, form);
      else await api.post("admin/blogs", form);
      toast.success(editing ? "Blog post updated" : "Blog post created");
      router.push("/admin/blog");
      router.refresh();
    } catch (e) {
      toast.error(errorMessage(e));
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        title={editing ? "Edit blog post" : "New blog post"}
        subtitle={editing ? blog?.title : "Write an article for the blog and its service page."}
        back="/admin/blog"
        actions={
          <Button type="submit" form="blog-form" loading={saving}>
            {editing ? "Save changes" : isPublished ? (scheduled ? "Schedule post" : "Publish post") : "Save draft"}
          </Button>
        }
      />
      <PageBody>
        <form id="blog-form" onSubmit={submit} className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <Card className="space-y-5 p-6">
              <Field label="Title" required>
                <input required minLength={3} maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What is PCOS and how is it managed?" className={`${inputClass} !py-3 font-display text-lg`} />
              </Field>
              <div>
                <span className="mb-1.5 block text-[13px] font-medium text-rose-950">
                  Content <span className="text-rose-600">*</span>
                </span>
                <RichTextEditor initialHtml={blog?.content ?? ""} onChange={setContent} />
              </div>
              <Field label="Excerpt" hint={`${excerpt.length}/500 · leave empty to generate it from the content.`}>
                <textarea maxLength={500} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={`${inputClass} resize-none`} />
              </Field>
            </Card>

            <Card className="p-6">
              <SectionTitle title="Search & links" hint="How this post appears on Google and in its URL." />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Meta title" hint={`${metaTitle.length}/255`}>
                  <input maxLength={255} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Slug" hint="Lowercase letters, numbers and dashes. Auto-generated if empty.">
                  <input pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Lowercase letters, numbers and dashes" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Meta description" className="sm:col-span-2" hint={`${metaDescription.length}/500`}>
                  <textarea maxLength={500} rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={`${inputClass} resize-none`} />
                </Field>
                <Field label="URL rewrite" className="sm:col-span-2" hint="Optional custom path, e.g. pcos/what-is-pcos">
                  <input value={urlRewrite} onChange={(e) => setUrlRewrite(e.target.value)} placeholder="pcos/what-is-pcos" className={inputClass} />
                </Field>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="space-y-5 p-6">
              <SectionTitle title="Publishing" />
              <Field label="Service" required hint="The post appears on this service's page.">
                <ServiceSelect value={serviceId} onChange={setServiceId} />
              </Field>
              <Field label="Publish date" hint={scheduled ? "Future date: goes live automatically." : undefined}>
                <input type="datetime-local" required value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className={inputClass} />
              </Field>
              <ToggleRow checked={isPublished} onChange={setIsPublished} title={isPublished ? "Published" : "Draft"} hint={isPublished ? "Visible on the website." : "Only visible here."} />
            </Card>

            <Card className="space-y-5 p-6">
              <SectionTitle title="Featured image" />
              <ImagePicker url={blog?.featuredImageUrl} onFile={setImage} />
              <Field label="Image alt text" required={Boolean(image)} hint="Describes the image for accessibility and SEO.">
                <input maxLength={255} value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className={inputClass} />
              </Field>
            </Card>
          </div>
        </form>
      </PageBody>
    </>
  );
}
