// Vercel's production domain wins over NEXT_PUBLIC_SITE_URL so a localhost
// value copied from .env.local into the Vercel project cannot leak into links.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
