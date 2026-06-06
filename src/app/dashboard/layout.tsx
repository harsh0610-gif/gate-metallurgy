import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarLayout from "@/components/layout/sidebar-layout";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarLayout userEmail={user.email ?? ""}>
      {children}
    </SidebarLayout>
  );
}
