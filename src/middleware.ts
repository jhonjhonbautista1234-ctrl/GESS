import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const publicAdminRoutes = new Set(["/admin/login", "/admin/register"]);

export async function middleware(request: NextRequest) {
  if (publicAdminRoutes.has(request.nextUrl.pathname)) return NextResponse.next({ request });
  let response = NextResponse.next({ request });
  type CookieUpdate = { name: string; value: string; options: Parameters<typeof response.cookies.set>[2] };
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (updates: CookieUpdate[]) => {
        updates.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        updates.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { const login = new URL("/admin/login", request.url); login.searchParams.set("next", request.nextUrl.pathname); return NextResponse.redirect(login); }
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return profile?.role === "admin" ? response : NextResponse.redirect(new URL("/", request.url));
}

export const config = { matcher: ["/admin/:path*"] };
