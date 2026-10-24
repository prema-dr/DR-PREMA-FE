"use client";

import Link from "next/link";
import {
  ArrowUpRightIcon as ArrowUpRight,
  BooksIcon as Books,
  ChatCircleTextIcon as ChatCircleText,
  FirstAidKitIcon as FirstAidKit,
  ImagesIcon as Images,
  NotePencilIcon as NotePencil,
  PlayCircleIcon as PlayCircle,
  PlusIcon as Plus,
} from "@phosphor-icons/react/dist/ssr";
import { formatDate, type AdminBlog, type DashboardCounts, type Paginated } from "@/lib/admin-api";
import { ErrorState, PageBody, PageHeader, Skeleton, StatusPill, Card, SectionTitle, buttonClass, useFetch } from "@/components/admin/ui";

const CARDS = [
  { key: "services", label: "Services", href: "/admin/services", icon: FirstAidKit, tint: "from-rose-500 to-rose-600" },
  { key: "blogs", label: "Blog posts", href: "/admin/blog", icon: NotePencil, tint: "from-fuchsia-500 to-rose-500" },
  { key: "testimonials", label: "Testimonials", href: "/admin/testimonials", icon: ChatCircleText, tint: "from-amber-400 to-rose-400" },
  { key: "galleryImages", label: "Gallery images", href: "/admin/gallery", icon: Images, tint: "from-sky-400 to-blue-500" },
  { key: "publications", label: "Publications", href: "/admin/publications", icon: Books, tint: "from-emerald-400 to-teal-500" },
  { key: "videos", label: "Videos", href: "/admin/videos", icon: PlayCircle, tint: "from-violet-400 to-purple-500" },
] as const;

const QUICK = [
  { href: "/admin/blog/new", label: "Write a blog post" },
  { href: "/admin/services/new", label: "Add a service" },
  { href: "/admin/testimonials?new=1", label: "Add a testimonial" },
  { href: "/admin/gallery?new=1", label: "Upload gallery image" },
];

export default function AdminDashboardPage() {
  const counts = useFetch<DashboardCounts>("admin/dashboard");
  const recent = useFetch<Paginated<AdminBlog>>("admin/blogs", { limit: 5, page: 1 });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="A quick look at everything on the website." />
      <PageBody>
        {counts.error ? (
          <ErrorState message={counts.error} onRetry={counts.reload} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {CARDS.map((card) => {
              const Icon = card.icon;
              const value = counts.data?.[card.key];
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group relative overflow-hidden rounded-3xl border border-rose-100/80 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(232,64,122,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-12px_rgba(232,64,122,0.3)]"
                >
                  <div className="flex items-start justify-between">
                    <span className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tint} text-white shadow-md`}>
                      <Icon size={24} weight="duotone" />
                    </span>
                    <ArrowUpRight size={18} className="text-rose-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-600" />
                  </div>
                  {value === undefined ? (
                    <Skeleton className="mt-6 h-12 w-20" />
                  ) : (
                    <p className="mt-6 font-display text-5xl font-semibold tracking-tight text-rose-950">{value}</p>
                  )}
                  <p className="mt-1 text-sm font-medium text-rose-900/60">Total {card.label.toLowerCase()}</p>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <SectionTitle title="Recent blog posts" hint="Latest articles you've created." />
              <Link href="/admin/blog" className="text-sm font-medium text-rose-600 hover:text-rose-800">
                View all
              </Link>
            </div>
            {recent.loading && !recent.data ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : recent.data?.items.length ? (
              <ul className="divide-y divide-rose-100/80">
                {recent.data.items.map((blog) => (
                  <li key={blog.id}>
                    <Link href={`/admin/blog/${blog.id}`} className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-rose-600">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-rose-950">{blog.title}</p>
                        <p className="mt-0.5 text-xs text-rose-900/50">
                          {blog.service.name} · {formatDate(blog.publishDate)}
                        </p>
                      </div>
                      <StatusPill on={blog.isPublished} onLabel="Published" offLabel="Draft" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-rose-900/55">No blog posts yet.</p>
            )}
          </Card>

          <Card className="p-6">
            <SectionTitle title="Quick actions" />
            <div className="flex flex-col gap-2.5">
              {QUICK.map((q) => (
                <Link key={q.href} href={q.href} className={`${buttonClass("secondary")} !justify-start`}>
                  <Plus size={15} weight="bold" className="text-rose-500" />
                  {q.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
