// One-off: copies the content exported from MySQL (DR-BE/scripts/export-for-firebase.mjs) into Firestore.
//
//   ADMIN_EMAIL=you@clinic.com ADMIN_PASSWORD=... \
//     node --env-file=.env.local scripts/import-to-firestore.mjs <export.json>
//
// It signs in as the admin (creating the Firebase account first if it doesn't exist yet), so the
// Firestore rules in firestore.rules must already be published. Documents keep their old numeric id as
// their Firestore id, so running it twice just rewrites the same documents.
// Images stay on Cloudinary: documents keep their image URL and Cloudinary public id.
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";

const file = process.argv[2];
const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!file || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Usage: ADMIN_EMAIL=… ADMIN_PASSWORD=… node --env-file=.env.local scripts/import-to-firestore.mjs <export.json>");
}

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
const auth = getAuth(app);
const db = getFirestore(app);

try {
  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
} catch (error) {
  if (error.code !== "auth/user-not-found" && error.code !== "auth/invalid-credential") throw error;
  console.log("Sign-in failed, trying to create the admin account…");
  await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
}
console.log(`Signed in as ${ADMIN_EMAIL}`);

const ts = (v) => Timestamp.fromDate(new Date(v));
const bool = (v) => v === true || v === 1 || v === "1";
const common = (r) => ({ serviceSlug: r.serviceSlug, createdAt: ts(r.createdAt), updatedAt: ts(r.updatedAt) });

const mappers = {
  blogs: (r) => ({
    ...common(r), title: r.title, slug: r.slug, urlRewrite: r.urlRewrite ?? null, metaTitle: r.metaTitle ?? null,
    metaDescription: r.metaDescription ?? null, excerpt: r.excerpt, content: r.content, readTimeMinutes: Number(r.readTimeMinutes),
    featuredImageUrl: r.featuredImageUrl ?? null, featuredImagePath: r.featuredImagePublicId ?? null, imageAlt: r.imageAlt ?? null,
    isPublished: bool(r.isPublished), publishDate: ts(r.publishDate),
  }),
  testimonials: (r) => ({
    ...common(r), name: r.name, review: r.review, rating: Number(r.rating), imageUrl: r.imageUrl ?? null, imagePath: r.imagePublicId ?? null, isEnabled: bool(r.isEnabled),
  }),
  gallery: (r) => ({
    ...common(r), imageUrl: r.imageUrl, imagePath: r.publicId ?? null, altText: r.altText, sortOrder: Number(r.sortOrder), isEnabled: bool(r.isEnabled),
  }),
  publications: (r) => ({
    ...common(r), title: r.title, shortDescription: r.shortDescription, url: r.url, isEnabled: bool(r.isEnabled),
  }),
  videos: (r) => ({
    ...common(r), videoUrl: r.videoUrl, thumbnailUrl: r.thumbnailUrl ?? null, thumbnailPath: r.thumbnailPublicId ?? null, isEnabled: bool(r.isEnabled),
  }),
};

const data = JSON.parse(readFileSync(file, "utf8"));
for (const [name, map] of Object.entries(mappers)) {
  const rows = data[name] ?? [];
  for (const row of rows) await setDoc(doc(db, name, String(row.id)), map(row));
  console.log(`${name}: ${rows.length}`);
}
process.exit(0);
