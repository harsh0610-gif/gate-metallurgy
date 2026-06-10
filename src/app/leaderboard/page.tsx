"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, Loader2, Medal, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LeaderboardEntry {
  userId: string;
  name: string;
  attempted: number;
  correct: number;
  accuracy: number;
  rank: number;
}

function getDisplayName(profile: { full_name?: string | null } | undefined, userId: string): string {
  if (profile?.full_name?.trim()) return profile.full_name.trim();
  return `Student ${userId.slice(0, 6)}`;
}

function getBadge(rank: number) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700 shadow-sm">
        Gold
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
        Silver
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-2 py-0.5 text-[10px] font-bold text-orange-700">
        Bronze
      </span>
    );
  }
  return <span className="text-xs text-slate-400 font-medium">—</span>;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data: answers } = await supabase
        .from("user_answers")
        .select("user_id, is_correct");

      if (!answers || answers.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const statsMap = new Map<string, { attempted: number; correct: number }>();
      answers.forEach((row) => {
        const current = statsMap.get(row.user_id) ?? { attempted: 0, correct: 0 };
        current.attempted += 1;
        if (row.is_correct) current.correct += 1;
        statsMap.set(row.user_id, current);
      });

      const userIds = Array.from(statsMap.keys());
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [
          p.id,
          p as { id: string; full_name?: string | null },
        ])
      );

      const ranked: LeaderboardEntry[] = userIds
        .map((userId) => {
          const stats = statsMap.get(userId)!;
          const profile = profileMap.get(userId);
          return {
            userId,
            name: getDisplayName(profile, userId),
            attempted: stats.attempted,
            correct: stats.correct,
            accuracy:
              stats.attempted > 0
                ? Math.round((stats.correct / stats.attempted) * 100)
                : 0,
            rank: 0,
          };
        })
        .sort((a, b) => {
          if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
          if (b.attempted !== a.attempted) return b.attempted - a.attempted;
          return a.name.localeCompare(b.name);
        })
        .map((entry, index) => ({ ...entry, rank: index + 1 }));

      setEntries(ranked);
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  const top50 = useMemo(() => entries.slice(0, 50), [entries]);

  const currentUserEntry = useMemo(
    () => (currentUserId ? entries.find((e) => e.userId === currentUserId) : null),
    [entries, currentUserId]
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl tracking-tight">Leaderboard</h1>
            <p className="mt-1 text-sm text-slate-500 font-medium">
              Top performers ranked by accuracy and questions attempted
            </p>
          </div>
        </div>
      </div>      {/* Current User Card */}
      {currentUserEntry && (
        <div className="mb-8 rounded-[24px] ios-glass border border-blue-200/40 bg-gradient-to-r from-blue-50/60 to-indigo-50/30 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Your standing</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-955">
                You are currently ranked <span className="text-blue-600 font-black">#{currentUserEntry.rank}</span> out of {entries.length} students
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white/80 border border-blue-100/50 px-4 py-2 text-center shadow-sm">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Attempted</span>
                <span className="text-base font-extrabold text-slate-950">{currentUserEntry.attempted} Qs</span>
              </div>
              <div className="rounded-2xl bg-white/80 border border-blue-100/50 px-4 py-2 text-center shadow-sm">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Accuracy</span>
                <span className="text-base font-extrabold text-blue-650">{currentUserEntry.accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center animate-page-entry">
          <Trophy className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No rankings yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Start practicing PYQs to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {top50.length > 0 && (
            <div className="mb-8 grid gap-5 md:grid-cols-3 items-end">
              {/* Rank 2 (Silver) */}
              {top50[1] && (
                <div className="relative order-2 md:order-1 rounded-[28px] ios-glass p-5 text-center transition-all duration-500 hover:-translate-y-0.5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[10px] font-bold text-slate-700 shadow-sm">
                    RANK 2
                  </div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 font-extrabold text-slate-600 text-lg border border-slate-250 shadow-inner">
                    {top50[1].name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900 truncate px-2">{top50[1].name}</h3>
                  <p className="mt-1 text-xs text-slate-450 font-medium">{top50[1].attempted} Qs attempted</p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/60 px-3 py-1 text-xs font-bold text-slate-700">
                    <Medal className="h-3.5 w-3.5 text-slate-400" />
                    {top50[1].accuracy}% Accuracy
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold) */}
              {top50[0] && (
                <div className="relative order-1 md:order-2 rounded-[28px] border-2 border-amber-400 bg-gradient-to-b from-amber-500/[0.02] via-white to-white p-6 text-center shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-500 md:scale-105">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-1 text-[10px] font-extrabold text-white shadow-md shadow-amber-500/15 border border-amber-350">
                    RANK 1
                  </div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-350 font-extrabold text-white text-xl border-2 border-amber-300 shadow-md shadow-amber-500/20">
                    {top50[0].name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 text-lg font-extrabold text-slate-900 truncate flex items-center justify-center gap-1">
                    <Crown className="h-5 w-5 text-amber-500 fill-amber-500 animate-pulse-soft" />
                    {top50[0].name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-450 font-semibold">{top50[0].attempted} Qs attempted</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-extrabold text-amber-800">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                    {top50[0].accuracy}% Accuracy
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top50[2] && (
                <div className="relative order-3 rounded-[28px] ios-glass p-5 text-center transition-all duration-500 hover:-translate-y-0.5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-50 border border-orange-200 px-3 py-0.5 text-[10px] font-bold text-orange-700 shadow-sm">
                    RANK 3
                  </div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 font-extrabold text-orange-700 text-lg border border-orange-200 shadow-inner">
                    {top50[2].name.slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="mt-3 font-bold text-slate-900 truncate px-2">{top50[2].name}</h3>
                  <p className="mt-1 text-xs text-slate-450 font-medium">{top50[2].attempted} Qs attempted</p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-orange-50/50 border border-orange-200/60 px-3 py-1 text-xs font-bold text-orange-850">
                    <Medal className="h-3.5 w-3.5 text-orange-500" />
                    {top50[2].accuracy}% Accuracy
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ranks Table */}
          <div className="overflow-hidden rounded-[28px] ios-glass shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3.5 sm:px-6">Rank</th>
                    <th className="px-5 py-3.5 sm:px-6">Name</th>
                    <th className="px-5 py-3.5 sm:px-6">Questions Attempted</th>
                    <th className="px-5 py-3.5 sm:px-6">Accuracy</th>
                    <th className="px-5 py-3.5 sm:px-6">Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {top50.map((entry) => {
                    const isCurrentUser = entry.userId === currentUserId;

                    return (
                      <tr
                        key={entry.userId}
                        className={
                          isCurrentUser
                            ? "bg-blue-50/60 font-semibold border-y border-blue-150/40"
                            : "hover:bg-slate-50/80 transition-colors"
                        }
                      >
                        <td className="px-5 py-4 font-bold text-slate-900 sm:px-6">
                          #{entry.rank}
                          {isCurrentUser && (
                            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold text-blue-700">YOU</span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-900 sm:px-6">
                          {entry.name}
                        </td>
                        <td className="px-5 py-4 text-slate-550 sm:px-6 font-medium">{entry.attempted}</td>
                        <td className="px-5 py-4 sm:px-6">
                          <span
                            className={`font-extrabold ${
                              entry.accuracy >= 80
                                ? "text-emerald-600"
                                : entry.accuracy >= 50
                                  ? "text-amber-600"
                                  : "text-rose-600"
                            }`}
                          >
                            {entry.accuracy}%
                          </span>
                        </td>
                        <td className="px-5 py-4 sm:px-6">{getBadge(entry.rank)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
