const BACKEND_FALLBACK = "https://ap1.aiuiso.site/api/v1";
const isAbsoluteHttpUrl = (url?: string) => /^https?:\/\//i.test(url ?? "");

export const normalizeBackendApiUrl = (url?: string) => {
  const resolved = (url || BACKEND_FALLBACK).replace(/\/+$/, "");
  return resolved.endsWith("/api/v1") ? resolved : `${resolved}/api/v1`;
};

export const getBackendApiUrl = () =>
  normalizeBackendApiUrl(
    process.env.BACKEND_API_URL ||
      (isAbsoluteHttpUrl(process.env.NEXT_PUBLIC_API_URL)
        ? process.env.NEXT_PUBLIC_API_URL
        : undefined),
  );
