"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart2,
  Loader2,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

interface UserAnswerRow {
  is_correct: boolean;
  created_at: string;
  questions: {
    subject_id: string;
    subjects: { name: string } | null;
  } | null;
}

export default function AnalyticsPage() {
  const [answers, setAnswers] = useState<UserAnswerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("user_answers")
        .select("is_correct, created_at, questions(subject_id, subjects(name))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const formatted = (data ?? []).map((row) => {
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
      setAnswers(formatted as UserAnswerRow[]);
      setLoading(false);
    }

    load();
  }, []);

  const stats = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter((a) => a.is_correct).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { total, correct, accuracy };
  }, [answers]);

  const subjectChartData = useMemo(() => {
    const map = new Map<string, { name: string; correct: number; total: number }>();

    answers.forEach((row) => {
      const subjectName = row.questions?.subjects?.name ?? "Unknown";
      const current = map.get(subjectName) ?? { name: subjectName, correct: 0, total: 0 };
      current.total += 1;
      if (row.is_correct) current.correct += 1;
      map.set(subjectName, current);
    });

    return Array.from(map.values())
      .map((s) => ({
        subject: s.name.length > 14 ? `${s.name.slice(0, 12)}…` : s.name,
        fullName: s.name,
        accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [answers]);

  const weeklyData = useMemo(() => {
    const days: { date: string; label: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key,
        label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        count: 0,
      });
    }

    answers.forEach((row) => {
      const key = row.created_at.slice(0, 10);
      const day = days.find((d) => d.date === key);
      if (day) day.count += 1;
    });

    return days;
  }, [answers]);

  const weakSubjects = useMemo(
    () => subjectChartData.filter((s) => s.accuracy < 60 && s.accuracy >= 0),
    [subjectChartData]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <BarChart2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl">Analytics</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track your performance and identify weak areas
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : answers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Target className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No data yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Start practicing PYQs and mock tests to see your analytics here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl ios-glass p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Questions Attempted</p>
                  <p className="mt-2 text-3xl font-black text-slate-800">{stats.total}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                  <Target className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl ios-glass p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Correct Answers</p>
                  <p className="mt-2 text-3xl font-black text-emerald-600">{stats.correct}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl ios-glass p-5 card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Overall Accuracy</p>
                  <p className="mt-2 text-3xl font-black text-blue-600">{stats.accuracy}%</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/60">
                  <BarChart2 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl ios-glass p-5 card-hover sm:p-6">
              <h2 className="text-lg font-bold text-slate-800">Subject-wise Accuracy</h2>
              <p className="mt-1 text-sm text-slate-500">Performance breakdown by subject</p>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="subject"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip
                      cursor={{ fill: "#f1f5f9" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                      formatter={(value) => [`${value ?? 0}%`, "Accuracy"]}
                      labelFormatter={(_, payload) =>
                        (payload?.[0]?.payload as { fullName?: string })?.fullName ?? ""
                      }
                    />
                    <Bar dataKey="accuracy" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl ios-glass p-5 card-hover sm:p-6">
              <h2 className="text-lg font-bold text-slate-800">Weekly Activity</h2>
              <p className="mt-1 text-sm text-slate-500">Questions attempted in the last 7 days</p>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                      formatter={(value) => [value ?? 0, "Questions"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#2563EB"
                      strokeWidth={2}
                      dot={{ fill: "#2563EB", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {weakSubjects.length > 0 && (
            <div className="rounded-2xl border border-rose-200/60 bg-rose-50/50 ios-glass p-5 sm:p-6" style={{background: 'rgba(255,241,242,0.7)'}}>
              <h2 className="text-lg font-bold text-rose-800">Weak Subjects</h2>
              <p className="mt-1 text-sm text-rose-600/80">
                Subjects where your accuracy is below 60% — focus here next
              </p>
              <ul className="mt-4 space-y-2">
                {weakSubjects.map((subject) => (
                  <li
                    key={subject.fullName}
                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-slate-900">{subject.fullName}</span>
                    <span className="font-semibold text-red-600">{subject.accuracy}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
