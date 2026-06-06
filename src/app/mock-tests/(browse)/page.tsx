"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  Crown,
  FileQuestion,
  Loader2,
  Lock,
  Play,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { checkIsPremium } from "@/lib/premium";
import { formatDuration } from "@/lib/mock-tests/utils";
import type { MockTest } from "@/lib/mock-tests/types";
import LoginGate from "@/components/shared/login-gate";

export default function MockTestsPage() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      const [testsRes, premium] = await Promise.all([
        supabase
          .from("mock_tests")
          .select("id, title, description, duration, total_marks, question_count, is_premium")
          .order("title"),
        checkIsPremium(supabase),
      ]);

      setTests(testsRes.data ?? []);
      setIsPremium(premium);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl">Mock Tests</h1>
            <p className="mt-1 text-sm text-slate-500">
              Full-length GATE MT simulations with real exam interface
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : tests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Mock tests coming soon!</h2>
          <p className="mt-2 text-sm text-slate-500">
            Full-length GATE MT mock tests will be available here shortly.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => {
            const isLocked = test.is_premium && !isPremium;

            return (
              <div
                key={test.id}
                className={`relative overflow-hidden rounded-2xl ios-glass p-6 flex flex-col justify-between ${
                  isLocked 
                    ? "opacity-85" 
                    : "card-hover"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">{test.title}</h2>
                    {test.is_premium && (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[9px] font-extrabold text-amber-700 shadow-sm uppercase tracking-wide">
                        <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                        Pro
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-550 line-clamp-2 leading-relaxed mb-5">{test.description}</p>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-xl bg-slate-50/80 border border-slate-200/60 p-2.5 text-center">
                      <Clock className="mx-auto h-4 w-4 text-blue-500" />
                      <p className="mt-1.5 text-xs font-semibold text-slate-700 tracking-tight">
                        {formatDuration(test.duration)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-2.5 text-center">
                      <Target className="mx-auto h-4 w-4 text-indigo-500" />
                      <p className="mt-1.5 text-xs font-semibold text-slate-900 tracking-tight">
                        {test.total_marks} marks
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50/60 border border-slate-100 p-2.5 text-center">
                      <FileQuestion className="mx-auto h-4 w-4 text-violet-500" />
                      <p className="mt-1.5 text-xs font-semibold text-slate-900 tracking-tight">
                        {test.question_count} Qs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Start Mock Test
                    </button>
                  ) : isLocked ? (
                    <Link
                      href="/pricing"
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm font-bold text-amber-800 transition-all duration-200 hover:bg-amber-100 hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      <Lock className="h-4 w-4" />
                      Upgrade to Unlock
                    </Link>
                  ) : (
                    <Link
                      href={`/mock-tests/${test.id}/instructions`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      Start Mock Test
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 animate-page-entry">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              ✕
            </button>
            <LoginGate
              heading="Login to Attempt Mock Test"
              subtext="To start full-length GATE MT simulation mock tests and track your performance, log in to your account."
            />
          </div>
        </div>
      )}
    </div>
  );
}
