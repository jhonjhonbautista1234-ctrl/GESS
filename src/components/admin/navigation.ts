import { BarChart3, CalendarDays, FileText, LayoutDashboard, Megaphone, MessageSquare, Newspaper, Palette, Shirt, Trophy, Users } from "lucide-react";

export const adminNavigation = [
  { group: "Workspace", items: [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Analytics", href: "#", icon: BarChart3, available: false },
  ] },
  { group: "Content", items: [
    { label: "Announcements", href: "/admin/dashboard/announcements", icon: Megaphone },
    { label: "Journalism", href: "/admin/dashboard#new-article", icon: Newspaper },
    { label: "Events", href: "#", icon: CalendarDays, available: false },
    { label: "Documents", href: "#", icon: FileText, available: false },
    { label: "Achievements", href: "#", icon: Trophy, available: false },
  ] },
  { group: "People", items: [
    { label: "Contacts", href: "/admin/dashboard#inbox", icon: MessageSquare },
    { label: "Officers", href: "#", icon: Users, available: false },
  ] },
  { group: "Commerce", items: [{ label: "Merch", href: "#", icon: Shirt, available: false }] },
  { group: "Design", items: [{ label: "Theme Engine", href: "#", icon: Palette, available: false }] },
];
