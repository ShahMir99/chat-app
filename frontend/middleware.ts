// middleware.ts
import { NextRequest } from "next/server";
import {
  authRoutes,
  PROTECTED_ROUTE,
  DEFAULT_LOGIN_REDIRECT,
  API_AUTH_PREFIX,
} from "@/router";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const auth = req.cookies.get("token")?.value;

  const isLoggedIn = !!auth;

  console.log("isLoggedIn", isLoggedIn)

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_PREFIX);

  
  if (isApiAuthRoute) {
    return;
  }

  if (isLoggedIn) {
    if (isAuthRoute) {
      return Response.redirect(new URL(PROTECTED_ROUTE, nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    if (!isAuthRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  return;
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|jpg|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
