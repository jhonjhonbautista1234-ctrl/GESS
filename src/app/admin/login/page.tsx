"use client";

import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function submit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    setPending(true); setError("");

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) {
        setError("The email or password was not recognized.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError || profile?.role !== "admin") {
        await supabase.auth.signOut();
        setError("This account can sign in, but it is not the authorized administrator yet. In Supabase, set its profile role to admin, then try again.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Sign-in could not reach Supabase. Confirm the deployed Supabase URL and anonymous key, then try again.");
    } finally {
      setPending(false);
    }
  }
  return <main className="studio-login"><form action={submit} className="studio-login-card"><span className="studio-monogram"><LockKeyhole size={16} /></span><p className="studio-eyebrow mt-6">GESS / Content Studio</p><h1 className="studio-heading">Administrator sign in</h1><p className="studio-muted mt-3">Use the one administrator account managed in Supabase Authentication.</p><label className="studio-field mt-7">Email<input name="email" type="email" autoComplete="username" required /></label><label className="studio-field">Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="studio-alert is-error" role="alert">{error}</p>}<button className="studio-button is-primary mt-4 w-full" disabled={pending} type="submit">{pending ? "Signing in…" : "Sign in to workspace"}</button><p className="studio-muted mt-5 text-center">Account creation is not available on this website.</p></form></main>;
}
