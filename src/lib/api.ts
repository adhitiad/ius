import axios from "axios";

/**
 * Axios instance for UIS-OTAK API
 */
const normalizeBaseUrl = (url?: string) => {
  const fallback = "/api/backend/api/v1";
  let resolved = (url || fallback).trim().replace(/\/+$/, "");
  
  // If it's a relative path (starts with /), we don't need to do much
  if (resolved.startsWith("/")) {
    if (resolved.includes("/api/v1")) return resolved;
    return `${resolved}/api/v1`.replace(/\/+/g, "/");
  }

  // If it's an absolute URL
  try {
    const urlObj = new URL(resolved);
    if (urlObj.pathname.endsWith("/api/v1")) return resolved;
    urlObj.pathname = `${urlObj.pathname}/api/v1`.replace(/\/+/g, "/");
    return urlObj.toString().replace(/\/$/, "");
  } catch (e) {
    // Fallback if URL is malformed
    return resolved.endsWith("/api/v1") ? resolved : `${resolved}/api/v1`;
  }
};

const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL),
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Helper to get cookie by name on client side
 */
const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
};

// Request Interceptor: Inject JWT Token
  api.interceptors.request.use(
    (config) => {
      let token: string | null = null;

      // 1. Try to get from Cookie first (for SSR compatibility)
      token = getCookie("auth_token") || null;

      // Removed localStorage fallback to prevent SSR hydration errors
      // Only use cookies for token storage in SSR context

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const isSecure = typeof location !== 'undefined' && location.protocol === "https:";
        document.cookie = `auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict${isSecure ? "; Secure" : ""}`;
        // Dispatch event untuk sinkronisasi state auth store
        window.dispatchEvent(new Event("auth:logout"));
        // Redirect only if not on landing page
        if (window.location.pathname !== "/") {
          window.location.href = "/login?expired=true";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
