import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Must run before returning the response: it refreshes an expired access token
  // and writes the new cookies onto both the request and the response.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && isAppPath(pathname)) {
    return redirectWithSessionCookies(request, response, "/login");
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return redirectWithSessionCookies(request, response, "/wallet");
  }

  return response;
}

const APP_PREFIXES = ["/plan", "/wallet", "/bookings", "/results", "/book"];

function isAppPath(pathname: string) {
  return APP_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function redirectWithSessionCookies(request: NextRequest, response: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirectResponse = NextResponse.redirect(url);
  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }
  return redirectResponse;
}
