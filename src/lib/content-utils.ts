// Blog helpers shared by the admin store (excerpt, read time, slugs) and the public site (sanitising).
import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "p", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li",
  "blockquote", "a", "img", "hr", "table", "thead", "tbody", "tr", "th", "td", "figure", "figcaption",
];

/** Run when an article is rendered: admins write the HTML straight from the browser, so it is never trusted as-is. */
export function sanitizeBlogHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "title", "width", "height"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  });
}
