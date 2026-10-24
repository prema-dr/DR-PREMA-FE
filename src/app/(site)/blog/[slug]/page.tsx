import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleProgress } from "@/components/blog/ArticleProgress";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleContent, prepareArticle } from "@/components/blog/ArticleContent";
import { ArticleAside } from "@/components/blog/ArticleAside";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ServiceFinalCta } from "@/components/service/detail/ServiceCta";
import { getBlogArticle, getBlogPosts } from "@/lib/site-api";

// Posts published later in the admin panel are rendered on first visit.
export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogArticle(slug);
  if (!post) return {};

  return {
    title: `${post.metaTitle || post.title} | Dr Prema`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogArticle(slug);
  if (!post) notFound();

  const [article, allPosts] = [prepareArticle(post.contentHtml), await getBlogPosts()];

  return (
    <>
      <ArticleProgress />
      <ArticleHeader post={post} />

      <section className="mx-auto mt-16 max-w-[90rem] px-[22px] md:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[74rem] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,46rem)_20rem] lg:justify-center lg:gap-16">
          <article>
            <ArticleContent html={article.html} />
            <AuthorBox />
          </article>
          <ArticleAside title={post.title} headings={article.headings} />
        </div>
      </section>

      <RelatedPosts current={post} all={allPosts} />
      <ServiceFinalCta
        serviceName={post.category}
        message="Send us a note or call the clinic, and we'll help you think through your next step, with no pressure to decide anything today."
      />
    </>
  );
}
