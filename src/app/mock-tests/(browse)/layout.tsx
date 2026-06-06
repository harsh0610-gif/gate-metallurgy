import AppShell from "@/components/shared/app-shell";

export default function MockTestsBrowseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
