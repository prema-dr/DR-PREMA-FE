export type ArticleHeading = { id: string; text: string };

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').trim();

/**
 * Adds anchor ids to the article's h2 headings and collects them for the "In this article" list.
 * The HTML is sanitised by the backend before it is stored.
 */
export function prepareArticle(html: string): { html: string; headings: ArticleHeading[] } {
  const headings: ArticleHeading[] = [];
  const withIds = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const id = `section-${headings.length}`;
    headings.push({ id, text: stripTags(inner) });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: withIds, headings };
}

// Styling lives in `.article-prose` (globals.css): numbered h2s, a drop cap on the first paragraph,
// and blockquotes rendered as the highlighted callout.
export function ArticleContent({ html }: { html: string }) {
  return <div className="article-prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
