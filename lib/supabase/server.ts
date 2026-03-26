import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
 const cookieStore = await cookies();
 const allCookies = cookieStore.getAll();

 return createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  {
   cookies: {
    getAll() {
     return allCookies || [];
    },
    async setAll(cookiesToSet) {
     for (const { name, value, options } of cookiesToSet) {
      await cookieStore.set(name, value, options);
     }
    }
   }
  }
 );
}
