import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "GESS", description: "Geodetic Engineering Students Society" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
