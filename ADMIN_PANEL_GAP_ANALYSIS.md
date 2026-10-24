# Admin Panel: Gap Analysis vs Client Requirement

Source: "Dr Prema Admin Panel – Required Modules.pdf"
Scope: what is built today, what is missing, and what to implement or enhance. **No code has been changed.**

---

## 1. Current state (what exists)

| Area | Status |
|---|---|
| Auth | Single shared password (`ADMIN_PASSWORD`) → cookie `admin_session` equals a static secret. Route guard in `src/proxy.ts`. 8h expiry. |
| Sidebar | Only **Blog Posts** and **Testimonials**. |
| Blog | List + "new" form (title, category, cover image, content). Create/delete only. |
| Testimonials | List + "new" form (name, category, quote). Create/delete only. |
| Data layer | **None.** `AdminDataContext` is in-memory React state seeded from `src/lib/*.ts`. Changes vanish on refresh and **never reach the public site** (the pages say "Not connected to the live site yet"). |
| Services | Static in `src/lib/services.ts` + `service-content.ts` (1,600 lines of hardcoded copy). Not editable. |
| Publications | Hardcoded per service. No admin. |
| Videos | Hardcoded arrays: `instagram-reels.ts` and `youtube-shorts.ts`. No admin. |
| Gallery | Does not exist on the site or admin. |
| Dashboard | Does not exist (`/admin` redirects to `/admin/blog`). |
| Service page | Already has sections for Blogs, Testimonials, Publications, Videos (`components/service/detail/*`), but fed from static files. **No Gallery section.** |

**Bottom line:** the admin is a UI prototype. The biggest gap is not any single screen, it is that there is no database, no persistence and no link between admin and the public site.

---

## 2. Requirement vs status

| # | Module | Required | Status |
|---|---|---|---|
| 1 | Dashboard | 6 total-count cards | Missing |
| 2 | Services | View / Add / Edit / Enable-Disable / Display order; own landing page per service | Missing in admin (pages exist, static) |
| 3 | Blogs | View / Create / Edit / Delete / Publish-Unpublish + 10 fields | Partial (create+delete only, 3 of 10 fields) |
| 4 | Testimonials | View / Add / Edit / Delete / Enable-Disable + 5 fields | Partial (create+delete only, no rating/image/toggle) |
| 5 | Gallery | View / Add / Edit / Delete / Enable-Disable; category, image upload, alt text | Missing entirely |
| 6 | Publications | View / Add / Edit / Delete / Enable-Disable; title, category, description, URL | Missing in admin |
| 7 | Videos | View / Add / Edit / Delete / Enable-Disable; category, URL, thumbnail | Missing in admin |
| – | Menu "only" 7 items | Dashboard, Services, Blogs, Testimonials, Gallery, Publications, Videos | 2 of 7 |
| – | Common category mapping | Admin picks a service → content auto-appears on that service page | Not wired (static) |

---

## 3. Foundation work (must come first)

Everything else depends on these.

1. **Persistent storage.** Choose a database and ORM. Suggested: Postgres (Neon/Supabase) + Prisma or Drizzle. A CMS (Sanity/Strapi) would also fit but adds a second system for a 7-module panel.
2. **Image storage.** Uploads for blog featured image, testimonial patient photo, gallery images, video thumbnails. Suggested: Cloudinary, S3 or Supabase Storage. Today files are only a browser `blob:` URL preview.
3. **Data model** (one shared `service` table drives every mapping):
   - `Service`: id, name, slug, summary, hero heading/sub, image, icon, status (enabled), sortOrder, plus page content (see §4.2)
   - `Blog`: id, title, serviceId, metaTitle, metaDescription, slug, urlRewrite, featuredImage, imageAlt, content (rich text), publishDate, status (published/draft)
   - `Testimonial`: id, name, review, rating (1-5), serviceId, image (optional), enabled
   - `GalleryImage`: id, serviceId, imageUrl, altText, enabled
   - `Publication`: id, title, serviceId, shortDescription, url, enabled
   - `Video`: id, serviceId, videoUrl, thumbnailUrl, enabled
4. **API / server actions** with validation (zod) for all CRUD. Replace `AdminDataContext`.
5. **Public site reads from the DB** (server components, with `revalidateTag` / ISR on admin save so changes go live without a redeploy). Remove the static data dependencies in `lib/*.ts` after migrating the content in as seed data.
6. **Admin auth hardening.** The cookie holds the same secret for everyone, so the secret is the session. Move to a signed/expiring session (e.g. `jose` JWT or Auth.js), add login rate-limiting, and compare passwords in constant time. Consider named admin user(s) instead of a single shared password.

---

## 4. Module-by-module work

### 4.1 Dashboard (new, `/admin`)
- Six count cards: Total Services, Blogs, Testimonials, Gallery Images, Publications, Videos.
- Make each card link to its module.
- Optional enhancement: show enabled vs disabled split on each card.
- Change `proxy.ts` so `/admin` renders the dashboard instead of redirecting to `/admin/blog`.

### 4.2 Services (new)
- List with status toggle, display-order control (drag and drop or up/down arrows), edit, add.
- Add/Edit form: name, slug, summary, hero heading, hero subtext, image, enable flag.
- **Decision needed:** how much of the service page body is admin-editable? Today each page has long structured copy (sections → paragraphs/bullets/labelled items, FAQs, closing text). The PDF only lists View/Add/Edit/Enable/Order, but "Add New Service" needs *some* way to author page content. Options:
  - A. Simple: hero + a rich-text body + FAQ repeater (recommended).
  - B. Full structured section builder matching `ServiceContent`.
- Dynamic route `/service/[slug]` fetches from DB; disabled services return 404 and disappear from nav, the services list, and the footer.
- Service icon is currently a Phosphor component chosen in code. Needs an icon picker or a fixed set keyed by string.
- **Slug safety:** warn on slug change (breaks inbound links); consider auto-redirect from the old slug.
- Deleting a service that has content: block it or reassign. (PDF lists no Delete for services, so disable only is a reasonable reading. Confirm with client.)

### 4.3 Blogs (enhance)
Missing actions: **Edit, Publish/Unpublish**.
Missing fields (have 3 of 10): Meta Title, Meta Description, Slug (auto-generate from title, editable, uniqueness check), URL Rewrite, Image Alt Text, Publish Date (supports scheduling), Featured Image upload.
- Replace the plain textarea with a **rich-text editor** (Tiptap or similar). The current public renderer expects `ContentBlock[]` (paragraph/heading/callout), so decide on one storage format (HTML or JSON) and update `ArticleContent.tsx`.
- `readTime` and `excerpt` are derived today; auto-calculate them from the content on save.
- Wire the SEO fields into `generateMetadata` on `/blog/[slug]` (title, description, OG image, canonical).
- **Clarify "URL Rewrite":** likely a custom URL path distinct from the slug, or a 301 from an old URL. Needs client confirmation before building.
- Mapping: blog appears on `/service/<category>` Blogs section (only published ones) and in the main `/blog` listing.
- Add search, filter by service and status, and pagination to the list; confirm dialog on delete.

### 4.4 Testimonials (enhance)
Missing: Edit, Enable/Disable, Star Rating, optional Patient Image.
- Rename "quote" → "review"; add the 1-5 rating input (the `StarRating` component already exists).
- Optional image upload with fallback avatar.
- Mapping: show under the matching service page. **Service is not displayed on the card** (client explicitly said so), so remove the category label from the `TestimonialCard` on the front end where it currently shows.
- Decide whether enabled testimonials also feed the home carousel and `/patient-stories`.

### 4.5 Gallery (new)
- Admin: grid view with thumbnail, service, alt text, toggle, edit, delete; add form with service select, image upload, alt text.
- Support multi-file upload (several images at once) as a usability win.
- Image validation (type, max size) and automatic optimisation/resizing on upload.
- **Front end:** build a new Gallery section on the service page (grid + lightbox) since none exists. Optionally a global `/gallery` page.

### 4.6 Publications (new admin)
- Admin: list + form (title, service, short description, URL, enable).
- Validate URL as `http(s)`.
- Front end card: title, description, "View Publication" button; opens in a new tab with `rel="noopener noreferrer"` (already done in `ServicePublications.tsx`). Make the whole card clickable per the PDF.
- Note: the PDF says the card should show "View Publication button/link"; the current design is a list row with an arrow icon, so add an explicit button label.

### 4.7 Videos (new admin)
- Admin: list + form (service, Instagram URL, thumbnail upload, enable).
- Validate the URL is an Instagram reel/post link.
- Front end: thumbnail card (with play overlay) that opens the Instagram URL in a new tab, no embed or hosting required.
- Currently the site uses Instagram **embeds** (`InstagramReels.tsx`) and **YouTube Shorts**. The client's scope is Instagram links only. **Decide:** keep YouTube Shorts on the homepage as is, or fold it into the same Videos module with a platform field.
- Home page reels: add a "Show on home page" flag, or pick the latest N enabled videos.

### 4.8 Navigation and layout
- Sidebar: exactly the 7 items in the specified order, with icons. Remove nothing else because nothing else exists.
- Update the `proxy.ts` matcher: it currently lists only `/admin/blog` and `/admin/testimonials`, so **new admin routes would be unprotected** unless added (use `/admin/:path*` with an exclusion for `/admin/login`).
- Responsive sidebar: it is fixed at 240px with no mobile layout. Add a collapsible drawer.

---

## 5. Cross-cutting enhancements

- **Single shared service/category selector** component used by Blogs, Testimonials, Gallery, Publications and Videos, reading from the DB (replaces `SERVICE_NAMES` constants). Only enabled services appear in the picker.
- **Category-by-name coupling:** content is currently linked by service *name string* (e.g. "Bleeding & Menses Problems"). Move to `serviceId` so renaming a service doesn't orphan content.
- **Disabled service behaviour:** define what happens to its blogs/testimonials/etc. (hidden everywhere vs still visible in global listings).
- **Empty states:** a service page section should hide when it has no enabled content (already done for Publications; make consistent).
- **Common list UX:** search, filter by service, enable toggle inline, delete confirmation, success/error toasts, loading and empty states.
- **Form UX:** validation messages, unsaved-changes warning, disabled submit while saving, edit pages pre-filled.
- **Accessibility/SEO:** alt text required on all images (the client asks for it on Blog and Gallery). Add sitemap entries generated from DB content and keep `robots.txt` blocking `/admin`.
- **Security:** CSRF protection on mutating routes, server-side auth check inside every API/action (not only in the proxy), sanitise rich-text HTML before rendering, restrict upload MIME types and size, set `noindex` on the admin.
- **Content migration:** a one-off seed script that moves the existing static services, blogs, testimonials, publications and reels into the DB so nothing is lost at launch.

---

## 6. Suggested build order

1. Foundation: DB + ORM, image storage, schema, seed/migration script, auth hardening.
2. Services module + dynamic service pages from DB (it is the mapping backbone).
3. Shared service selector + admin shell (7-item sidebar, proxy matcher, dashboard).
4. Blogs (full fields, editor, SEO, publish).
5. Testimonials (rating, image, toggle, edit).
6. Publications, then Videos.
7. Gallery (admin + new service-page section).
8. Wire every service page section to DB content; remove static data files.
9. QA pass: mapping per service, disabled behaviour, mobile admin, security checks.

Rough effort guide: foundation is the largest single chunk. The five content modules after it are similar CRUD and move fast once the shared pieces exist.

---

## 7. Questions to confirm with the client

1. How should a **new service's page content** be authored (simple rich text vs full section builder)?
2. What exactly is **"URL Rewrite"** on blogs (custom path or redirect)?
3. Can services be **deleted**, or only disabled? What happens to their linked content?
4. Videos: Instagram **only**, or keep YouTube Shorts too? Should some videos also appear on the home page?
5. Should the **Gallery** also have a standalone public page, or only appear on service pages?
6. Do testimonials/blogs also show on global pages (home, `/patient-stories`, `/blog`), or only on service pages?
7. How many admin users, and is a single shared password acceptable?
8. Blog publish date: should a **future date schedule** the post automatically?
9. Hosting target and preferred DB / media storage (affects the foundation choices).
