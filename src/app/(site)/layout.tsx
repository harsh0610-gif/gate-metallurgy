"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Atom,
  Globe,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  Share2,
  Video,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Notes", href: "/notes" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "PYQ Bank", href: "/pyqs" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const footerSubjects = [
  { label: "Thermodynamics", href: "/notes/thermodynamics" },
  { label: "Phase Transformations", href: "/notes/phase-transformations" },
  { label: "Mechanical Properties", href: "/notes/mechanical-properties" },
  { label: "Heat Treatment", href: "/notes/heat-treatment" },
  { label: "Corrosion", href: "/notes/corrosion" },
  { label: "Powder Metallurgy", href: "/notes/powder-metallurgy" },
];

const socialLinks = [
  { icon: Video, href: "https://youtube.com/@gatemtpro", label: "YouTube" },
  { icon: Globe, href: "https://gatemtpro.com", label: "Website" },
  { icon: MessageCircle, href: "https://t.me/gatemtpro", label: "Community" },
  { icon: Mail, href: "mailto:support@gatemtpro.com", label: "Email" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
        active ? "text-blue-600 after:scale-x-100" : "text-slate-700 hover:text-blue-600"
      }`}
    >
      {label}
    </Link>
  );
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Atom className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-blue-600 sm:text-xl">
              GATE MT Pro
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                active={
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/")
                }
              />
            ))}
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {!mounted ? (
              <div className="h-9 w-24 rounded-xl bg-slate-100/80 animate-pulse-soft" />
            ) : isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700"
                >
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile nav overlay ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-slate-900/20 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed left-0 right-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-slate-200 bg-white/95 shadow-xl backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-500">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4">
              {!mounted ? (
                <div className="h-10 w-full rounded-xl bg-slate-150 animate-pulse-soft" />
              ) : isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl border border-blue-600 px-4 py-3 text-center text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
                  >
                    Start Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Page content ── */}
      <main>{children}</main>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Atom className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-white">GATE MT Pro</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                India&apos;s dedicated GATE Metallurgy preparation platform.
                Built by metallurgists, for metallurgists.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-3">
                {footerQuickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Subjects
              </h3>
              <ul className="mt-4 space-y-3">
                {footerSubjects.map((subject) => (
                  <li key={subject.label}>
                    <Link
                      href={subject.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {subject.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Connect
              </h3>
              <p className="mt-4 text-sm text-slate-400">
                Follow us for daily GATE MT tips, PYQ solutions, and exam updates.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-900 pt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} GATE MT Pro. All rights reserved. Made
            for GATE Metallurgy aspirants across India.
          </div>
        </div>
      </footer>
    </>
  );
}
