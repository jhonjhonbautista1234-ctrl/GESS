import StudioShell from "@/components/admin/studio-shell";
import { requireAdmin } from "@/lib/admin";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return <StudioShell email={user.email ?? "Administrator"}>{children}</StudioShell>;
}
