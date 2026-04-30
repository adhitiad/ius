import { getBackendApiUrl } from "@/lib/backend-url";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const createBackendUrl = (baseUrl: string, path: string[] = [], requestUrl: string) => {
  const cleanPath =
    path[0] === "api" && path[1] === "v1" ? path.slice(2) : path;
  const target = new URL(`${baseUrl}/${cleanPath.map(encodeURIComponent).join("/")}`);
  target.search = new URL(requestUrl).search;
  return target;
};

const createForwardHeaders = (request: Request) => {
  const headers = new Headers(request.headers);

  for (const header of Array.from(headers.keys())) {
    if (HOP_BY_HOP_HEADERS.has(header.toLowerCase())) {
      headers.delete(header);
    }
  }

  return headers;
};

async function handler(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const target = createBackendUrl(getBackendApiUrl(), path, request.url);
  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);

  const response = await fetch(target, {
    method,
    headers: createForwardHeaders(request),
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
