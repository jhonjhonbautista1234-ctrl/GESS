import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "GESS", template: "%s | GESS" },
  description: "Geodetic Engineering Students Society",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="flex min-h-screen flex-col"><div className="flex-1">{children}</div><SiteFooter /></body></html>;
}
