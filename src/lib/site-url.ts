// Set NEXT_PUBLIC_SITE_URL in the deployment env to the real production domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://drpremagynaecologistcbe.in").replace(/\/$/, "");
