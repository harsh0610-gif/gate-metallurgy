"use client";

import { useCallback, useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import QuestionCard from "@/components/pyqs/question-card";
import type { Question } from "@/lib/pyqs/types";

export default function BookmarksPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select("question_id, questions(*, subjects(name))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setQuestions([]);
      setBookmarkedIds(new Set());
    } else {
      const mapped = (data ?? [])
        .map((row) => {
          const q = row.questions as unknown as Question | Question[] | null;
          return (Array.isArray(q) ? q[0] : q) as Question | null;
        })
        .filter((q): q is Question => q !== null);

      setQuestions(mapped);
      setBookmarkedIds(new Set(mapped.map((q) => q.id)));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    if (expandedId) {
      setTimeout(() => {
        const element = document.getElementById(`question-${expandedId}`);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    }
  }, [expandedId]);

  function handleBookmarkChange(questionId: string, bookmarked: boolean) {
    if (!bookmarked) {
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
      if (expandedId === questionId) setExpandedId(null);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25">
            <Bookmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl">Bookmarks</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your saved questions for quick revision
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No bookmarks yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Start practicing and bookmark questions!
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isExpanded={expandedId === question.id}
              isBookmarked={bookmarkedIds.has(question.id)}
              onToggleExpand={() =>
                setExpandedId((prev) => (prev === question.id ? null : question.id))
              }
              onBookmarkChange={handleBookmarkChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
