import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(12), inviteSecret: z.string().min(1) });
const same = (value: string, expected: string) => { const a = Buffer.from(value); const b = Buffer.from(expected); return a.length === b.length && timingSafeEqual(a, b); };

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  const inviteSecret = process.env.ADMIN_INVITE_SECRET;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!parsed.success || !inviteSecret || !same(parsed.data.inviteSecret, inviteSecret)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!url || !serviceRoleKey) return NextResponse.json({ error: "Server configuration is incomplete" }, { status: 500 });
  const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase.auth.admin.createUser({ email: parsed.data.email, password: parsed.data.password, email_confirm: true });
  if (error || !data.user) return NextResponse.json({ error: "Unable to create administrator" }, { status: 400 });
  const { error: roleError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", data.user.id);
  if (roleError) { await supabase.auth.admin.deleteUser(data.user.id); return NextResponse.json({ error: "Unable to assign administrator role" }, { status: 500 }); }
  return NextResponse.json({ id: data.user.id }, { status: 201 });
}
