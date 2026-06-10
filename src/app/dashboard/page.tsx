import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  ClipboardList,
  Crown,
  Flame,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { checkIsPremium } from "@/lib/premium";
import SubjectChart from "./subject-chart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | GATE MT Pro",
  robots: {
    index: false,
    follow: false,
  },
};

function calculateStreak(timestamps: string[]) {
  if (timestamps.length === 0) return 0;

  // Extract unique dates as YYYY-MM-DD strings in local timezone or simple UTC date
  const dateStrings = Array.from(
    new Set(
      timestamps
        .map((t) => {
          try {
            // Get local date representation YYYY-MM-DD
            const d = new Date(t);
            if (isNaN(d.getTime())) return "";
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          } catch {
            return "";
          }
        })
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a)); // Sort descending (most recent first)

  if (dateStrings.length === 0) return 0;

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateString(new Date());
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  // If the most recent active day is neither today nor yesterday, streak is broken
  if (dateStrings[0] !== todayStr && dateStrings[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  const currentDate = new Date(dateStrings[0]);

  for (let i = 0; i < dateStrings.length; i++) {
    const expected = new Date(currentDate);
    expected.setDate(expected.getDate() - i);
    const expectedStr = getLocalDateString(expected);

    if (dateStrings.includes(expectedStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getUserName(user: {
  email?: string;
  user_metadata?: { full_name?: string };
}) {
  const fullName = user.user_metadata?.full_name;
  if (fullName) return fullName;
  if (user.email) return user.email.split("@")[0];
  return "Student";
}

function formatToday() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName = getUserName(user);
  const isPremium = await checkIsPremium(supabase);

  // Fetch all user answers to calculate statistics and subject accuracy
  const { data: rawAnswers } = await supabase
    .from("user_answers")
    .select("is_correct, created_at, questions(subject_id, subjects(name))")
    .eq("user_id", user.id);

  // Map database response to a consistent structure (handling relation array types)
  const answersData = (rawAnswers ?? []).map((row) => {
    const r = row as {
      is_correct: boolean;
      created_at: string;
      questions: {
        subject_id: string;
        subjects: { name: string }[] | { name: string } | null;
      }[] | {
        subject_id: string;
        subjects: { name: string }[] | { name: string } | null;
      } | null;
    };
    const q = Array.isArray(r.questions) ? r.questions[0] : r.questions;
    return {
      is_correct: r.is_correct,
      created_at: r.created_at,
      questions: q ? {
        subject_id: q.subject_id,
        subjects: Array.isArray(q.subjects) ? q.subjects[0] ?? null : q.subjects,
      } : null,
    };
  });

  // Fetch all user attempts
  const { data: attemptsData } = await supabase
    .from("user_attempts")
    .select("id, created_at")
    .eq("user_id", user.id);

  // Calculate statistics
  const totalAttempted = answersData.length;
  const correctCount = answersData.filter((a) => a.is_correct).length;
  const overallAccuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
  const mockTestsTaken = attemptsData?.length ?? 0;

  // Streak calculation
  const streakTimestamps = [
    ...answersData.map((a) => a.created_at),
    ...(attemptsData ?? []).map((a) => a.created_at),
  ];
  const currentStreakVal = calculateStreak(streakTimestamps);

  const stats = [
    {
      label: "Questions Attempted",
      value: String(totalAttempted),
      icon: Target,
      bg: "bg-blue-50/50",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100/40",
      glowBg: "bg-blue-500",
    },
    {
      label: "Overall Accuracy",
      value: `${overallAccuracy}%`,
      icon: TrendingUp,
      bg: "bg-emerald-50/50",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/40",
      glowBg: "bg-emerald-500",
    },
    {
      label: "Mock Tests Taken",
      value: String(mockTestsTaken),
      icon: ClipboardList,
      bg: "bg-violet-50/50",
      iconBg: "bg-violet-50 text-violet-600 border border-violet-100/40",
      glowBg: "bg-violet-500",
    },
    {
      label: "Current Streak",
      value: `${currentStreakVal} ${currentStreakVal === 1 ? "day" : "days"}`,
      icon: Flame,
      bg: "bg-amber-50/50",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/40",
      glowBg: "bg-amber-500",
    },
  ];

  // Process subject-wise accuracy
  const subjectMap = new Map<string, { correct: number; total: number }>();
  answersData.forEach((row) => {
    const subjectName = row.questions?.subjects?.name ?? "Unknown";
    const current = subjectMap.get(subjectName) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (row.is_correct) current.correct += 1;
    subjectMap.set(subjectName, current);
  });

  const chartData = Array.from(subjectMap.entries()).map(([name, s]) => ({
    subject: name.length > 14 ? `${name.slice(0, 12)}…` : name,
    fullName: name,
    accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }));

  const premiumFeatures = [
    "All PYQs from 2010–2026",
    "Unlimited mock tests",
    "Full analytics & insights",
    "All subject notes",
    "Leaderboard access",
  ];

  const quickActions = [
    {
      label: "Practice PYQs",
      href: "/pyqs",
      icon: Zap,
      color: "bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20",
    },
    {
      label: "Take Mock Test",
      href: "/mock-tests",
      icon: ClipboardList,
      color: "bg-gradient-to-br from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20",
    },
    {
      label: "Read Notes",
      href: "/notes",
      icon: BookOpen,
      color: "bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-md shadow-violet-500/10 hover:shadow-lg hover:shadow-violet-500/20",
    },
    {
      label: "View Syllabus",
      href: "/syllabus",
      icon: CheckSquare,
      color: "bg-gradient-to-br from-slate-800 to-slate-950 hover:from-slate-900 hover:to-slate-950 shadow-md shadow-slate-900/10 hover:shadow-lg",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 border border-blue-200/50 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse-soft" />
            {formatToday()}
          </span>
          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight sm:text-4xl gradient-heading">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Track your progress and keep pushing toward your GATE MT goal.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-[24px] ios-glass p-6 card-hover group"
          >
            {/* Background glow */}
            <div className={`absolute -right-6 -bottom-6 h-28 w-28 rounded-full opacity-[0.07] blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.12] ${stat.glowBg}`} />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.iconBg} shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subject chart */}
      <div className="mb-8 rounded-[28px] ios-glass p-6 card-hover">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Subject-wise Accuracy</h2>
            <p className="text-sm text-slate-500">
              Your performance across key GATE MT subjects
            </p>
          </div>
          <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${
            chartData.length > 0
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {chartData.length > 0 ? "Live data" : "No practice data yet"}
          </span>
        </div>
        <SubjectChart data={chartData} />
      </div>

      {/* Two columns */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] ios-glass p-6 card-hover">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Activity</h2>
          {totalAttempted === 0 && mockTestsTaken === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <Target className="h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                No activity yet. Start practicing!
              </p>
              <Link
                href="/pyqs"
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Begin with PYQs →
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-4 transition-all hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm border border-blue-100/40">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Questions Solved</p>
                    <p className="text-xs text-slate-500 font-medium">Total practice problems attempted</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-950">{totalAttempted}</span>
              </div>

              {mockTestsTaken > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-slate-50/50 border border-slate-100 p-4 transition-all hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 shadow-sm border border-violet-100/40">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Mocks Attempted</p>
                      <p className="text-xs text-slate-500 font-medium">Full-length evaluation tests</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-950">{mockTestsTaken}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`rounded-[28px] ios-glass p-6 card-hover relative overflow-hidden group ${
          isPremium 
            ? "border-amber-400/30"
            : ""
        }`}>
          {isPremium && (
            <div className="absolute right-6 top-6 text-amber-500 opacity-[0.06] group-hover:scale-110 transition-transform duration-500">
              <Crown className="h-20 w-20 fill-amber-500" />
            </div>
          )}
          
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Subscription Status</h2>
          <div className="mt-4">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              isPremium
                ? "bg-amber-100 text-amber-800 border border-amber-200/80 shadow-sm"
                : "bg-slate-100 text-slate-600 border border-slate-200/40"
            }`}>
              {isPremium ? "Pro Plan (Active)" : "Free Plan"}
            </span>
          </div>
          {isPremium ? (
            <div className="mt-4">
              <p className="text-sm text-slate-650 leading-relaxed">
                You have full access to all premium features of the GATE MT Pro experience. Good luck with your study!
              </p>
              <div className="mt-6 flex h-20 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-900 text-sm font-bold border border-amber-500/20 gap-2.5 shadow-sm animate-pulse-soft">
                <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />
                All premium content is unlocked
              </div>
            </div>
          ) : (
            <>
              <p className="mt-4 text-sm text-slate-600">
                You&apos;re on the free plan. Upgrade to unlock the full GATE MT Pro experience.
              </p>
              <ul className="mt-4 space-y-2">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Missing: {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5"
              >
                Upgrade to Premium
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-slate-800 tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`group flex items-center justify-between rounded-xl px-5 py-[1.125rem] text-sm font-bold text-white shadow transition-all duration-300 hover:-translate-y-1 ${action.color}`}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="tracking-wide">{action.label}</span>
              </div>
              <ArrowRight className="h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

