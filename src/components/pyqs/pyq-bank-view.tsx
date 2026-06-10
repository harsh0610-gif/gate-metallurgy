"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Filter,
  Loader2,
  Maximize2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FilterSidebar from "./filter-sidebar";
import QuestionCard from "./question-card";
import {
  EMPTY_FILTERS,
  type PyqFilters,
  type Question,
  type Subject,
} from "@/lib/pyqs/types";

interface PyqBankViewProps {
  practiceMode?: boolean;
}

export default function PyqBankView({ practiceMode = false }: PyqBankViewProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>({});
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<PyqFilters>(EMPTY_FILTERS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const fetchSubjects = useCallback(async () => {
    const supabase = createClient();
    const { data: subjectsData } = await supabase
      .from("subjects")
      .select("id, name")
      .order("name");

    const { data: countsData } = await supabase
      .from("questions")
      .select("subject_id");

    const countsMap: Record<string, number> = {};
    (countsData ?? []).forEach((q) => {
      countsMap[q.subject_id] = (countsMap[q.subject_id] ?? 0) + 1;
    });

    setSubjects(subjectsData ?? []);
    setSubjectCounts(countsMap);
  }, []);

  const fetchBookmarks = useCallback(async (questionIds: string[]) => {
    if (questionIds.length === 0) {
      setBookmarkedIds(new Set());
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBookmarkedIds(new Set());
      return;
    }

    const { data } = await supabase
      .from("bookmarks")
      .select("question_id")
      .eq("user_id", user.id)
      .in("question_id", questionIds);

    setBookmarkedIds(new Set((data ?? []).map((b) => b.question_id)));
  }, []);

  const fetchQuestions = useCallback(async () => {
    if (!selectedSubjectId) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("questions")
      .select("*, subjects(name)", { count: "exact" })
      .eq("subject_id", selectedSubjectId);

    if (filters.years.length > 0) {
      query = query.in("pyq_year", filters.years);
    }
    if (filters.difficulties.length > 0) {
      query = query.in("difficulty", filters.difficulties);
    }
    if (filters.questionTypes.length > 0) {
      query = query.in("q_type", filters.questionTypes);
    }

    const { data, error } = await query.order("pyq_year", { ascending: false });

    if (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } else {
      const fetched = (data ?? []) as Question[];
      setQuestions(fetched);
      await fetchBookmarks(fetched.map((q) => q.id));
    }

    setLoading(false);
  }, [selectedSubjectId, filters, fetchBookmarks]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    setExpandedId(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [filters, selectedSubjectId]);

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

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    }
    checkAuth();
  }, []);

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function handleBookmarkChange(questionId: string, bookmarked: boolean) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) {
        next.add(questionId);
      } else {
        next.delete(questionId);
      }
      return next;
    });
  }

  const questionsByYear = useMemo(() => {
    const groups: Record<number, Question[]> = {};
    questions.forEach((q) => {
      const y = q.pyq_year;
      if (!groups[y]) groups[y] = [];
      groups[y].push(q);
    });

    return Object.entries(groups)
      .map(([year, list]) => ({
        year: Number(year),
        questions: list,
      }))
      .sort((a, b) => b.year - a.year);
  }, [questions]);

  const activeSubjectName = useMemo(() => {
    if (!selectedSubjectId) return "";
    return subjects.find((s) => s.id === selectedSubjectId)?.name ?? "Subject";
  }, [selectedSubjectId, subjects]);

  return (
    <div className="animate-page-entry pb-12">
      {/* Header */}
      <div className="border-b border-slate-200/50 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {practiceMode && (
              <>
                <Link
                  href="/pyqs"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to PYQ Chapters</span>
                </Link>
                <div className="hidden h-5 w-px bg-slate-200 sm:block" />
              </>
            )}
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h1 className="text-base font-extrabold text-slate-800 sm:text-lg tracking-tight">
                {practiceMode ? "Practice Mode" : "PYQ Bank"}
              </h1>
            </div>
          </div>

          {!practiceMode && !selectedSubjectId && (
            <Link
              href="/pyqs/practice"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm shadow-blue-500/10 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Practice Mode</span>
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!selectedSubjectId ? (
          /* Chapter List Catalog Grid View */
          <div className="animate-page-entry">
            <div className="mb-8">
              <h2 className="text-2xl font-black gradient-heading tracking-tight sm:text-3xl">Select a Chapter</h2>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Choose a subject chapter to view organized previous year questions.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className="ios-glass spring-transition rounded-[24px] p-6 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/40 shadow-sm mb-4 transition-transform duration-300 group-hover:scale-105">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 tracking-tight text-lg leading-snug group-hover:text-blue-600 transition-colors">
                      {subject.name}
                    </h3>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100/60 pt-4">
                    <span className="rounded-full bg-blue-50/70 px-3 py-1 text-[10px] font-extrabold text-blue-700 tracking-wide border border-blue-100/35 uppercase">
                      {subjectCounts[subject.id] ?? 0} Qs
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Subject Questions Grouped by Year View */
          <div>
            <button
              onClick={() => setSelectedSubjectId(null)}
              className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-slate-300/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Chapters
            </button>

            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600/70">Chapter Questions</span>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">{activeSubjectName}</h2>
            </div>

            {/* Mobile filter toggle */}
            {!practiceMode && (
              <button
                onClick={() => setFiltersOpen(true)}
                className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm lg:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filters.years.length > 0 ||
                  filters.difficulties.length > 0 ||
                  filters.questionTypes.length > 0) && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    Active
                  </span>
                )}
              </button>
            )}

            <div className="flex gap-6">
              {!practiceMode && showFilters && (
                <FilterSidebar
                  subjects={[]} // Pass empty to hide Subject section from sidebar filters inside a chapter
                  filters={filters}
                  onChange={setFilters}
                  onClear={handleClearFilters}
                  mobileOpen={filtersOpen}
                  onMobileClose={() => setFiltersOpen(false)}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(false)}
                />
              )}

              <div className="min-w-0 flex-1">
                {/* Count */}
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Found <span className="font-extrabold text-slate-900">{questions.length}</span> questions in this chapter
                  </p>
                  {!practiceMode && !showFilters && (
                    <button
                      onClick={() => setShowFilters(true)}
                      className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                    >
                      <Filter className="h-3.5 w-3.5 text-blue-600" />
                      Show Filters
                    </button>
                  )}
                </div>

                {/* Questions organized by Year */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-slate-200 bg-white py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="mt-4 text-sm text-slate-500 font-semibold">Loading chapter questions...</p>
                  </div>
                ) : questions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                    <BookOpen className="h-12 w-12 text-slate-350" />
                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                      No questions found
                    </h2>
                    <p className="mt-1.5 max-w-sm text-sm font-medium text-slate-500">
                      Try adjusting or clearing your query filters to see results.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {questionsByYear.map((yearGroup) => (
                      <div key={yearGroup.year} className="relative">
                        {/* Year Badge */}
                        <div className="sticky top-[4.5rem] z-20 mb-4 inline-flex items-center gap-2 rounded-xl border border-blue-200/50 bg-blue-50/80 backdrop-blur-md px-4 py-2 text-xs font-black text-blue-800 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-blue-605 animate-pulse-soft" />
                          GATE {yearGroup.year}
                        </div>

                        <div className="space-y-4">
                          {yearGroup.questions.map((question) => (
                            <QuestionCard
                              key={question.id}
                              question={question}
                              isExpanded={expandedId === question.id}
                              isBookmarked={bookmarkedIds.has(question.id)}
                              onToggleExpand={() =>
                                setExpandedId((prev) =>
                                  prev === question.id ? null : question.id
                                )
                              }
                              onBookmarkChange={handleBookmarkChange}
                              isLoggedIn={isLoggedIn}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
