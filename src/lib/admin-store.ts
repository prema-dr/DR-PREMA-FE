// Browser-side data layer for the admin panel: Firestore for content, Cloudinary for images.
// It answers the same "REST-like" calls the admin pages already make (see `api` in admin-api.ts),
// so the pages stay unchanged. Security is enforced by firestore.rules, not here:
// the checks below only give the editor friendly error messages.
import {
  addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, getDocs, query as fsQuery, serverTimestamp,
  Timestamp, updateDoc, where, type DocumentData,
} from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";
import { makeExcerpt, normalizeUrlRewrite, readTimeMinutes, slugify } from "@/lib/content-text";
import { isServiceSlug } from "@/lib/services";

export class StoreError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

type Method = "GET" | "POST" | "PATCH" | "DELETE";
type Fields = Record<string, unknown>;
type Query = Record<string, string>;

/* ───────────── Field rules ───────────── */

type Rule = {
  type: "string" | "int" | "bool" | "date" | "service";
  label?: string;
  required?: boolean;
  nullable?: boolean; // empty input is stored as null
  min?: number;
  max?: number;
  pattern?: RegExp;
  patternMessage?: string;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REWRITE = /^[a-z0-9]+(?:[-/][a-z0-9]+)*$/;
// Instagram reel / post / IGTV links only: videos are linked, not hosted.
const INSTAGRAM_URL = /^https:\/\/(www\.)?instagram\.com\/(reel|reels|p|tv)\/[\w-]+\/?(\?.*)?$/i;

const service: Rule = { type: "service", required: true, label: "Service" };
const enabled: Rule = { type: "bool" };

type ResourceName = "blogs" | "testimonials" | "gallery" | "publications" | "videos";

type Resource = {
  rules: Record<string, Rule>;
  // Upload field → where the image's URL and Cloudinary public id are kept on the document.
  image?: { field: string; url: string; path: string; folder: string; requiredOnCreate?: boolean };
  searchFields: string[];
};

const RESOURCES: Record<ResourceName, Resource> = {
  blogs: {
    rules: {
      title: { type: "string", required: true, min: 3, max: 255, label: "Title" },
      serviceSlug: service,
      slug: { type: "string", pattern: SLUG, max: 180, patternMessage: "Slug must be lowercase letters, numbers and dashes", label: "Slug" },
      urlRewrite: { type: "string", nullable: true, pattern: REWRITE, max: 191, patternMessage: "URL rewrite may contain lowercase letters, numbers, dashes and slashes", label: "URL rewrite" },
      metaTitle: { type: "string", nullable: true, max: 255, label: "Meta title" },
      metaDescription: { type: "string", nullable: true, max: 500, label: "Meta description" },
      imageAlt: { type: "string", nullable: true, max: 255, label: "Alt text" },
      content: { type: "string", required: true, min: 10, label: "Content" },
      excerpt: { type: "string", max: 500, label: "Excerpt" },
      publishDate: { type: "date" },
      isPublished: { type: "bool" },
    },
    image: { field: "featuredImage", url: "featuredImageUrl", path: "featuredImagePath", folder: "blogs" },
    searchFields: ["title"],
  },
  testimonials: {
    rules: {
      name: { type: "string", required: true, min: 2, max: 160, label: "Name" },
      review: { type: "string", required: true, min: 10, max: 3000, label: "Review" },
      rating: { type: "int", min: 1, max: 5, label: "Rating" },
      serviceSlug: service,
      isEnabled: enabled,
    },
    image: { field: "image", url: "imageUrl", path: "imagePath", folder: "testimonials" },
    searchFields: ["name", "review"],
  },
  gallery: {
    rules: {
      serviceSlug: service,
      altText: { type: "string", required: true, min: 3, max: 255, label: "Alt text" },
      isEnabled: enabled,
    },
    image: { field: "image", url: "imageUrl", path: "imagePath", folder: "gallery", requiredOnCreate: true },
    searchFields: ["altText"],
  },
  publications: {
    rules: {
      title: { type: "string", required: true, min: 2, max: 255, label: "Title" },
      shortDescription: { type: "string", required: true, max: 500, label: "Description" },
      url: { type: "string", required: true, max: 500, pattern: /^https?:\/\/\S+$/i, patternMessage: "Link must start with http:// or https://", label: "Link" },
      serviceSlug: service,
      isEnabled: enabled,
    },
    searchFields: ["title", "shortDescription"],
  },
  videos: {
    rules: {
      serviceSlug: service,
      videoUrl: { type: "string", required: true, max: 500, pattern: INSTAGRAM_URL, patternMessage: "Video link must be an Instagram reel/post link (https://www.instagram.com/reel/...)", label: "Video link" },
      isEnabled: enabled,
    },
    image: { field: "thumbnail", url: "thumbnailUrl", path: "thumbnailPath", folder: "videos" },
    searchFields: ["videoUrl"],
  },
};

const isResource = (name: string): name is ResourceName => name in RESOURCES;

function parse(fields: Fields, rules: Record<string, Rule>, partial: boolean): DocumentData {
  const out: DocumentData = {};
  for (const [key, rule] of Object.entries(rules)) {
    const value = fields[key];
    const label = rule.label ?? key;
    if (value === undefined || value === null) {
      if (value === undefined && !partial && rule.required) throw new StoreError(`${label} is required`, 400);
      if (value === undefined) continue;
    }

    if (rule.type === "bool") {
      out[key] = value === true || value === "true";
    } else if (rule.type === "int") {
      const n = Number(value);
      if (!Number.isInteger(n) || n < (rule.min ?? -Infinity) || n > (rule.max ?? Infinity)) {
        throw new StoreError(`${label} must be a whole number between ${rule.min} and ${rule.max}`, 400);
      }
      out[key] = n;
    } else if (rule.type === "date") {
      const d = new Date(String(value));
      if (Number.isNaN(d.getTime())) throw new StoreError(`${label} is not a valid date`, 400);
      out[key] = Timestamp.fromDate(d);
    } else {
      const text = String(value ?? "").trim();
      if (!text) {
        if (rule.nullable) out[key] = null;
        else if (rule.required) throw new StoreError(`${label} is required`, 400);
        continue;
      }
      if (rule.type === "service" && !isServiceSlug(text)) throw new StoreError("Choose a valid service", 400);
      if (rule.min && text.length < rule.min) throw new StoreError(`${label} must be at least ${rule.min} characters`, 400);
      if (rule.max && text.length > rule.max) throw new StoreError(`${label} must be at most ${rule.max} characters`, 400);
      if (rule.pattern && !rule.pattern.test(text)) throw new StoreError(rule.patternMessage ?? `${label} is not valid`, 400);
      out[key] = text;
    }
  }
  return out;
}

/* ───────────── Documents ───────────── */

const col = (name: ResourceName) => collection(firestore(), name);

function serialize(id: string, data: DocumentData, hideContent: boolean) {
  const out: Record<string, unknown> = { id };
  for (const [key, value] of Object.entries(data)) {
    if (hideContent && key === "content") continue;
    out[key] = value instanceof Timestamp ? value.toDate().toISOString() : value;
  }
  return out;
}

async function fetchDoc(name: ResourceName, id: string, hideContent = false) {
  const snap = await getDoc(doc(firestore(), name, id));
  if (!snap.exists()) throw new StoreError("Not found", 404);
  return serialize(snap.id, snap.data(), hideContent);
}

async function fetchAll(name: ResourceName) {
  const snap = await getDocs(col(name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as DocumentData & { id: string });
}

const millis = (v: unknown) => (v instanceof Timestamp ? v.toMillis() : 0);

/* ───────────── Images ───────────── */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

async function authHeader() {
  const token = await firebaseAuth().currentUser?.getIdToken();
  if (!token) throw new StoreError("Your session has expired", 401);
  return { Authorization: `Bearer ${token}` };
}

/** Uploads straight to Cloudinary with a signature minted by /api/cloudinary/sign (the API secret stays on the server). */
async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_TYPES.includes(file.type)) throw new StoreError("Images must be JPEG, PNG or WebP", 400);
  if (file.size > MAX_BYTES) throw new StoreError("Images must be 5 MB or smaller", 400);

  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { ...(await authHeader()), "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  if (!signRes.ok) throw new StoreError("Image upload is not available right now", signRes.status);
  const { signature, timestamp, apiKey, cloudName, folder: fullFolder } = await signRes.json();

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", apiKey);
  form.set("timestamp", String(timestamp));
  form.set("signature", signature);
  form.set("folder", fullFolder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new StoreError("Image upload failed", 502);
  const result = await res.json();
  return { url: result.secure_url as string, path: result.public_id as string };
}

// Best effort: a failed cleanup must never fail the save. Images without a public id (e.g. the bundled /images/ ones) are left alone.
async function removeImage(publicId: unknown) {
  if (typeof publicId !== "string" || !publicId) return;
  try {
    await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { ...(await authHeader()), "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
  } catch {
    // An orphaned image is harmless.
  }
}

/* ───────────── Operations ───────────── */

async function list(name: ResourceName, q: Query) {
  const res = RESOURCES[name];
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(q.limit) || 12));
  const needle = q.search?.toLowerCase();

  const items = (await fetchAll(name))
    .filter((d) => !q.serviceSlug || d.serviceSlug === q.serviceSlug)
    .filter((d) => q.isEnabled === undefined || d.isEnabled === (q.isEnabled === "true"))
    .filter((d) => !q.status || d.isPublished === (q.status === "published"))
    .filter((d) => !needle || res.searchFields.some((f) => String(d[f] ?? "").toLowerCase().includes(needle)))
    .sort((a, b) => millis(b.createdAt) - millis(a.createdAt));

  const total = items.length;
  return {
    items: items.slice((page - 1) * limit, page * limit).map(({ id, ...data }) => serialize(id, data, true)),
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

async function slugTaken(field: "slug" | "urlRewrite", value: string, exceptId?: string) {
  const snap = await getDocs(fsQuery(col("blogs"), where(field, "==", value)));
  return snap.docs.some((d) => d.id !== exceptId);
}

/** Blog-only rules: unique slug / rewrite, alt text with an image, excerpt and read time derived from the body. */
async function prepareBlog(data: DocumentData, existing: DocumentData | null, id: string | undefined, hasImage: boolean) {
  if (data.slug !== undefined || !existing) {
    const wanted: string | undefined = data.slug;
    if (wanted) {
      if (wanted !== existing?.slug && (await slugTaken("slug", wanted, id))) throw new StoreError("Slug already in use", 409);
    } else {
      const root = slugify(String(data.title ?? "")) || "post";
      let candidate = root;
      for (let n = 2; await slugTaken("slug", candidate); n++) candidate = `${root}-${n}`;
      data.slug = candidate;
    }
  }

  if (data.urlRewrite !== undefined) {
    const rewrite = normalizeUrlRewrite(data.urlRewrite);
    if (rewrite && rewrite !== existing?.urlRewrite && (await slugTaken("urlRewrite", rewrite, id))) {
      throw new StoreError("URL rewrite already in use", 409);
    }
    data.urlRewrite = rewrite;
  }

  if (hasImage && !(data.imageAlt ?? existing?.imageAlt)) throw new StoreError("imageAlt is required when uploading an image", 400);

  if (typeof data.content === "string") {
    data.readTimeMinutes = readTimeMinutes(data.content);
    if (!data.excerpt) data.excerpt = makeExcerpt(data.content);
  }
  if (!existing) {
    data.publishDate ??= Timestamp.now();
    data.isPublished ??= false;
    data.urlRewrite ??= null;
  }
}

async function save(name: ResourceName, id: string | null, body: FormData | Fields) {
  const res = RESOURCES[name];
  const fields: Fields = {};
  let file: File | null = null;
  if (body instanceof FormData) {
    for (const [key, value] of body.entries()) {
      if (value instanceof File) {
        if (key === res.image?.field && value.size > 0) file = value;
      } else fields[key] = value;
    }
  } else Object.assign(fields, body);

  if (name === "blogs" && typeof fields.urlRewrite === "string") fields.urlRewrite = normalizeUrlRewrite(fields.urlRewrite) ?? "";

  const existing = id ? (await getDoc(doc(firestore(), name, id))).data() ?? null : null;
  if (id && !existing) throw new StoreError("Not found", 404);

  const data = parse(fields, res.rules, Boolean(id));
  if (name === "blogs") await prepareBlog(data, existing, id ?? undefined, Boolean(file));
  if (res.image?.requiredOnCreate && !id && !file) throw new StoreError("An image is required", 400);

  const uploaded = file && res.image ? await uploadImage(file, res.image.folder) : null;
  if (uploaded && res.image) {
    data[res.image.url] = uploaded.url;
    data[res.image.path] = uploaded.path;
  }

  try {
    if (id) {
      await updateDoc(doc(firestore(), name, id), { ...data, updatedAt: serverTimestamp() });
      if (uploaded && res.image) await removeImage(existing?.[res.image.path]);
      return fetchDoc(name, id);
    }
    const created = await addDoc(col(name), {
      ...(name === "gallery" && { sortOrder: 0 }),
      ...(name !== "blogs" && { isEnabled: true }),
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return fetchDoc(name, created.id);
  } catch (error) {
    if (uploaded) await removeImage(uploaded.path);
    throw error;
  }
}

async function remove(name: ResourceName, id: string) {
  const ref_ = doc(firestore(), name, id);
  const snap = await getDoc(ref_);
  if (!snap.exists()) throw new StoreError("Not found", 404);
  await deleteDoc(ref_);
  const image = RESOURCES[name].image;
  if (image) await removeImage(snap.data()[image.path]);
}

async function dashboard() {
  const names: [string, ResourceName][] = [
    ["blogs", "blogs"], ["testimonials", "testimonials"], ["galleryImages", "gallery"], ["publications", "publications"], ["videos", "videos"],
  ];
  const counts = await Promise.all(names.map(([, name]) => getCountFromServer(col(name))));
  return Object.fromEntries(names.map(([key], i) => [key, counts[i].data().count]));
}

/* ───────────── Entry point ───────────── */

/** Tells the public site to drop its cached pages so a change shows up straight away. Best effort. */
async function revalidateSite() {
  try {
    const token = await firebaseAuth().currentUser?.getIdToken();
    if (token) await fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  } catch {
    // The site still refreshes on its own within a minute.
  }
}

function friendly(error: unknown): never {
  const code = (error as { code?: string })?.code ?? "";
  if (error instanceof StoreError) throw error;
  if (code === "permission-denied") {
    throw new StoreError("This account isn't allowed to manage the site content", 403);
  }
  if (code === "unauthenticated") throw new StoreError("Your session has expired", 401);
  if (code === "unavailable") throw new StoreError("Cannot reach the server. Try again shortly.", 503);
  throw error;
}

/** `path` is e.g. "admin/blogs?page=1", "admin/testimonials/abc123", "admin/blogs/abc123/publish". */
export async function handleAdminRequest(method: Method, path: string, body?: unknown): Promise<unknown> {
  const [pathname, search = ""] = path.split("?");
  const [, name, id, action] = pathname.split("/");
  const q: Query = Object.fromEntries(new URLSearchParams(search));

  try {
    if (name === "dashboard" && method === "GET") return await dashboard();
    if (!name || !isResource(name)) throw new StoreError("Not found", 404);

    let result: unknown;
    if (method === "GET") return id ? await fetchDoc(name, id) : await list(name, q);
    if (method === "POST" && !id) result = await save(name, null, body as FormData | Fields);
    else if (method === "PATCH" && id && action === "publish" && name === "blogs") result = await save(name, id, { isPublished: (body as Fields).isPublished });
    else if (method === "PATCH" && id && !action) result = await save(name, id, body as FormData | Fields);
    else if (method === "DELETE" && id) await remove(name, id);
    else throw new StoreError("Not found", 404);

    await revalidateSite();
    return result;
  } catch (error) {
    friendly(error);
  }
}
