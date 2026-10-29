This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase backend

The site and admin panel run on Firebase; the NestJS backend (`../DR-BE`) is no longer used.

- **Auth**: admin sign-in is Firebase Email/Password. Create the admin user(s) in the console.
- **Firestore**: collections `blogs`, `testimonials`, `gallery`, `publications`, `videos`, each document holding a `serviceSlug`
  (the 14 services themselves are fixed, in `src/data/services.json`). The public site reads them over the REST API
  (`src/lib/firestore-rest.ts`, cached 60 s); the admin panel uses the SDK in the browser (`src/lib/admin-store.ts`).
- **Images**: Cloudinary. The admin browser uploads straight to it with a signature from `/api/cloudinary/sign`, so
  `CLOUDINARY_API_SECRET` stays server-side; replaced/deleted images are removed through `/api/cloudinary/delete`.
- **Rules**: `firestore.rules` allows public reads of published/enabled content and writes only for the
  admin emails listed in it. Keep that list in sync with `ADMIN_EMAILS` in `.env.local` (copy `.env.example`).

One-time setup: create the Firestore database (production mode), then `firebase deploy --only firestore`
(or paste `firestore.rules` into the console).

Importing the old MySQL data:

```bash
cd ../DR-BE && node scripts/export-for-firebase.mjs /tmp/export.json
cd ../DR-FE && ADMIN_EMAIL=you@clinic.com ADMIN_PASSWORD=... node --env-file=.env.local scripts/import-to-firestore.mjs /tmp/export.json
```
