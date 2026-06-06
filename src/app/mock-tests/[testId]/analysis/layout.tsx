import AppShell from "@/components/shared/app-shell";

export default function MockTestAnalysisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
