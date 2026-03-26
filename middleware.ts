import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
 let supabaseResponse = NextResponse.next({ request });

 const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  {
   cookies: {
    async getAll() {
     return (await request.cookies.getAll()) || [];
    },
    async setAll(cookiesToSet) {
     cookiesToSet.forEach(({ name, value }) =>
      request.cookies.set(name, value)
     );

     supabaseResponse = NextResponse.next({ request });

     cookiesToSet.forEach(({ name, value, options }) =>
      supabaseResponse.cookies.set(name, value, options)
     );
    }
   }
  }
 );

 const {
  data: { user }
 } = await supabase.auth.getUser();

 const isProtected = request.nextUrl.pathname.startsWith("/app");

 if (!user && isProtected) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url);
 }

 return supabaseResponse;
}

export const config = {
 matcher: [
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
 ]
};
