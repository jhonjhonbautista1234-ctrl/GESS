import { BarChart3, CalendarDays, FileText, LayoutDashboard, Megaphone, MessageSquare, Newspaper, Palette, Shirt, Trophy, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AdminNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  available?: boolean;
}

interface AdminNavigationGroup {
  group: string;
  items: AdminNavigationItem[];
}

export const adminNavigation: AdminNavigationGroup[] = [
  { group: "Workspace", items: [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/dashboard/analytics", icon: BarChart3 },
  ] },
  { group: "Content", items: [
    { label: "Announcements", href: "/admin/dashboard/announcements", icon: Megaphone },
    { label: "Journalism", href: "/admin/dashboard/journalism", icon: Newspaper },
    { label: "Events", href: "/admin/dashboard/events", icon: CalendarDays },
    { label: "Documents", href: "/admin/dashboard/documents", icon: FileText },
    { label: "Achievements", href: "/admin/dashboard/achievements", icon: Trophy },
  ] },
  { group: "People", items: [
    { label: "Contacts", href: "/admin/dashboard/contacts", icon: MessageSquare },
    { label: "Officers", href: "/admin/dashboard/officers", icon: Users },
  ] },
  { group: "Commerce", items: [{ label: "Merch", href: "/admin/dashboard/merch", icon: Shirt }] },
  { group: "Design", items: [{ label: "Theme Engine", href: "/admin/dashboard/theme", icon: Palette }] },
];
