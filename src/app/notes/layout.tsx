import AppShell from "@/components/shared/app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metallurgy Subject Notes | GATE MT Pro",
  description: "Access detailed, exam-oriented study notes for all GATE Metallurgy subjects including Thermodynamics, Phase Transformations, Corrosion, and Heat Treatment.",
};

export default function NotesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
