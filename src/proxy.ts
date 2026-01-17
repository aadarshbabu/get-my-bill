import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import createMiddleware from "next-intl/middleware";

import { AllLocales, AppConfig } from "./utils/AppConfig";

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/:locale/dashboard(.*)",
  "/onboarding(.*)",
  "/:locale/onboarding(.*)",
  "/api(.*)",
  "/:locale/api(.*)",
]);
const EXTERNAL_DOMAIN = process.env.NEXT_PUBLIC_EXTERNAL_DOMAIN;

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/activate-plan") {
    const redirectUrl = `${EXTERNAL_DOMAIN}?${searchParams}`;
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/sign-up") {
    if (EXTERNAL_DOMAIN) {
      const redirectUrl = `${EXTERNAL_DOMAIN}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname === "/sign-in") {
    if (EXTERNAL_DOMAIN) {
      const redirectUrl = `${EXTERNAL_DOMAIN}`;
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Apply Clerk Middleware for Auth pages, Protected App pages, AND API routes
  if (
    request.nextUrl.pathname.includes("/sign-in") ||
    request.nextUrl.pathname.includes("/sign-up") ||
    isProtectedRoute(request) ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/trpc")
  ) {
    return clerkMiddleware(async (auth, req) => {
      // For API routes, we just allow them to pass through.
      // Clerk has already populated the auth state in the request.
      // We do NOT want to run intlMiddleware or redirects for APIs.
      if (req.nextUrl.pathname.startsWith("/api") || req.nextUrl.pathname.startsWith("/trpc")) {
         return NextResponse.next();
      }

      const authObj = await auth();

      if (isProtectedRoute(req)) {
        const locale =
          req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? "";

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        if (!authObj.userId) {
          return NextResponse.redirect(signInUrl);
        }
      }

      if (
        authObj.userId &&
        !authObj.orgId &&
        req.nextUrl.pathname.includes("/dashboard") &&
        !req.nextUrl.pathname.endsWith("/organization-selection")
      ) {
        const orgSelection = new URL(
          "/onboarding/organization-selection",
          req.url
        );

        return NextResponse.redirect(orgSelection);
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|monitoring).*)", "/", "/(api|trpc)(.*)"], // Also exclude tunnelRoute used in Sentry from the matcher
};
