"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Atom,
  BarChart2,
  Bookmark,
  BookOpen,
  CheckSquare,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "PYQ Bank", href: "/pyqs", icon: BookOpen },
  { label: "Mock Tests", href: "/mock-tests", icon: ClipboardList },
  { label: "Notes", href: "/notes", icon: FileText },
  { label: "Syllabus", href: "/syllabus", icon: CheckSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  pathname: string;
  onClick?: () => void;
}

function NavItem({ href, label, icon: Icon, pathname, onClick }: NavItemProps) {
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-violet-500/20 border border-blue-500/30 text-white shadow-[0_4px_20px_rgba(59,130,246,0.15)] scale-[1.02] pl-5"
          : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 hover:scale-[1.01] hover:pl-5 pl-4"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
      )}
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors ${
          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        }`}
      />
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardSidebar({
  userEmail,
  isCollapsed = false,
  onToggleCollapse,
}: {
  userEmail: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-slate-950/[0.97] backdrop-blur-xl border-r border-slate-800/50 lg:flex transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Toggle Collapse Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`absolute top-[18px] z-50 flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 shadow-md cursor-pointer transition-all duration-300 hover:scale-110 focus:outline-none ${
              isCollapsed ? "right-[-24px]" : "right-[-14px]"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Atom className="h-5 w-5 animate-pulse-soft" />
          </div>
          <span className="text-lg font-bold text-white tracking-wide">GATE MT Pro</span>
        </div>

        <nav aria-label="Sidebar links" className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} pathname={pathname} />
          ))}
        </nav>

        <div className="border-t border-slate-800/60 p-4 bg-slate-950/20">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-900/50 border border-slate-800/30 p-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900/40 text-blue-300 font-bold border border-blue-800/30 text-xs shrink-0">
              {userEmail ? userEmail.slice(0, 2).toUpperCase() : "MT"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">
                {userEmail ? userEmail.split("@")[0] : "Student"}
              </p>
              <p className="truncate text-[10px] text-slate-500">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-950/10 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-600 hover:text-white hover:border-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top navigation */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-slate-800/50 bg-gradient-to-r from-slate-950 to-slate-900 lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Atom className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white tracking-wide">GATE MT Pro</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-900"
            aria-label="Toggle dashboard menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 animate-page-entry">
            <div className="border-b border-slate-900 px-4 py-2 bg-slate-900/35">
              <span className="text-xs font-medium text-slate-400">{userEmail}</span>
            </div>
            <nav aria-label="Mobile links" className="grid grid-cols-2 gap-1.5 p-3 sm:grid-cols-4">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="border-t border-slate-800/60 p-3 bg-slate-950">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-950/10 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-600 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-md px-2 py-2">
          <div className="flex gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
