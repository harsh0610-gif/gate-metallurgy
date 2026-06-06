"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Questions", href: "/admin/questions", icon: BookOpen },
  { label: "Subjects", href: "/admin/subjects", icon: FolderTree },
  { label: "Notes", href: "/admin/notes", icon: FileText },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? "");
    }
    loadUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300">
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
          <Shield className="h-5 w-5 text-blue-400" />
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <p className="truncate text-xs text-slate-500">Logged in as</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-300">
            {userEmail || "Loading..."}
          </p>
          <Link
            href="/"
            className="mt-4 flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to main site
          </Link>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <main className="min-h-screen p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
