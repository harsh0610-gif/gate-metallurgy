import AppShell from "@/components/shared/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GATE MT Solved PYQ Bank | GATE MT Pro",
  description: "Browse and practice solved GATE Metallurgy Previous Year Questions (PYQs) from 2010 to 2026. Filter by subject, topic, and difficulty with detailed explanation.",
};

export default function PyqsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
