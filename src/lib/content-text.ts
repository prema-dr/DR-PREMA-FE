// Dependency-free text helpers for the admin forms (imported by client code).
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 150);
}

export function normalizeUrlRewrite(value: string | null | undefined): string | null {
  const cleaned = (value ?? "").trim().toLowerCase().replace(/^\/+|\/+$/g, "");
  return cleaned || null;
}

export function htmlToText(html: string): string {
  return html
    .replace(/<\/(p|h[1-6]|li|div|blockquote|tr)>|<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function makeExcerpt(html: string, max = 160): string {
  const text = htmlToText(html);
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export const readTimeMinutes = (html: string) => Math.max(1, Math.ceil(htmlToText(html).split(" ").filter(Boolean).length / 200));
