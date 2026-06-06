import { createClient } from "@/lib/supabase/server";
import SidebarLayout from "@/components/layout/sidebar-layout";
import SiteLayout from "@/app/(site)/layout";

export default async function AppShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <SiteLayout>{children}</SiteLayout>;
  }

  return (
    <SidebarLayout userEmail={user.email ?? ""}>
      {children}
    </SidebarLayout>
  );
}
