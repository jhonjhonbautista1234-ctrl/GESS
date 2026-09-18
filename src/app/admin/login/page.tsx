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
    setPending(true); setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: String(formData.get("email")), password: String(formData.get("password")) });
    if (signInError) { setError("The email or password was not recognized."); setPending(false); return; }
    router.replace("/admin/dashboard"); router.refresh();
  }
  return <main className="studio-login"><form action={submit} className="studio-login-card"><span className="studio-monogram"><LockKeyhole size={16} /></span><p className="studio-eyebrow mt-6">GESS / Content Studio</p><h1 className="studio-heading">Administrator sign in</h1><p className="studio-muted mt-3">Use the one administrator account managed in Supabase Authentication.</p><label className="studio-field mt-7">Email<input name="email" type="email" autoComplete="username" required /></label><label className="studio-field">Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="studio-alert is-error" role="alert">{error}</p>}<button className="studio-button is-primary mt-4 w-full" disabled={pending} type="submit">{pending ? "Signing in…" : "Sign in to workspace"}</button><p className="studio-muted mt-5 text-center">Account creation is not available on this website.</p></form></main>;
}
