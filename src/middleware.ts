import { createServerClient } from "@supabase/ssr";

import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_EMAIL } from "@/lib/constants";



const PROTECTED_ROUTES = ["/dashboard", "/mock-tests/", "/analytics", "/revise", "/syllabus", "/leaderboard", "/bookmarks"];

const AUTH_ROUTES = ["/login", "/signup"];



function isProtectedRoute(pathname: string) {

  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

}



function isAuthRoute(pathname: string) {

  return AUTH_ROUTES.some((route) => pathname.startsWith(route));

}



function copyCookies(from: NextResponse, to: NextResponse) {

  from.cookies.getAll().forEach(({ name, value }) => {

    to.cookies.set(name, value);

  });

}



export async function middleware(request: NextRequest) {

  let supabaseResponse = NextResponse.next({ request });



  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {

      cookies: {

        getAll() {

          return request.cookies.getAll();

        },

        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>

            supabaseResponse.cookies.set(name, value, options)

          );

        },

      },

    }

  );



  const {

    data: { user },

  } = await supabase.auth.getUser();



  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");



  if (isAuthRoute(pathname) && user) {

    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));

    copyCookies(supabaseResponse, redirectResponse);

    return redirectResponse;

  }



  if ((isAdminRoute || isProtectedRoute(pathname)) && !user) {

    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("next", pathname);

    const redirectResponse = NextResponse.redirect(loginUrl);

    copyCookies(supabaseResponse, redirectResponse);

    return redirectResponse;

  }



  if (isAdminRoute && user && user.email !== ADMIN_EMAIL) {

    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));

    copyCookies(supabaseResponse, redirectResponse);

    return redirectResponse;

  }



  return supabaseResponse;

}



export const config = {

  matcher: [

    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",

  ],

};


