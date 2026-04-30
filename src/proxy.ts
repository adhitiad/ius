import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ADMIN_ROLES = new Set(["owner", "pengelola"]);
const PREMIUM_PLANS = new Set([
  "pro",
  "bisnis",
  "enterprise",
  "owner",
  "pengelola",
]);
const PREMIUM_ROUTES = ["/signals", "/backtester", "/intelligence"];
const PROTECTED_ROUTES = [
  "/dashboard",
  "/admin",
  "/signals",
  "/backtester",
  "/intelligence",
  "/screener",
  "/chat",
  "/settings",
  "/ticker",
];

type JwtClaims = {
  role?: string;
  plan?: string;
  exp?: number;
};

const getJwtKey = () => {
  const secret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  return secret ? new TextEncoder().encode(secret) : null;
};

const clearCookieAndRedirect = (url: URL) => {
  const response = NextResponse.redirect(url);
  response.cookies.delete("auth_token");
  return response;
};

const isExpired = (claims: JwtClaims) => {
  if (!claims.exp) return false;
  return Date.now() >= claims.exp * 1000;
};

const getClaims = async (token: string): Promise<JwtClaims | null> => {
  const key = getJwtKey();
  if (!key) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload as JwtClaims;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  const isProtectedPath = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token) {
    return NextResponse.next();
  }

  const claims = await getClaims(token);

  if (!claims || isExpired(claims)) {
    return clearCookieAndRedirect(new URL("/login?expired=true", request.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const userRole = claims.role ?? "user";
  const userPlan = (claims.plan ?? "free").toLowerCase();

  if (pathname.startsWith("/admin") && !ADMIN_ROLES.has(userRole)) {
    return NextResponse.redirect(
      new URL("/dashboard?error=admin_only", request.url),
    );
  }

  const isPremiumRoute = PREMIUM_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const isPremiumPlan = PREMIUM_PLANS.has(userPlan);

  if (isPremiumRoute && !isPremiumPlan) {
    return NextResponse.redirect(
      new URL("/pricing?reason=premium_required", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
    "/signals/:path*",
    "/backtester/:path*",
    "/intelligence/:path*",
    "/screener/:path*",
    "/chat/:path*",
    "/settings/:path*",
    "/ticker/:path*",
  ],
};
