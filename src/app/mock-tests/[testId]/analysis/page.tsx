"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchMockTestQuestions } from "@/lib/mock-tests/fetch-questions";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { formatTimeTaken } from "@/lib/mock-tests/utils";
import {
  formatCorrectAnswerDisplay,
  getQuestionOptions,
} from "@/lib/pyqs/utils";
import type { MockTest, MockTestQuestion, UserAttempt } from "@/lib/mock-tests/types";

function AnalysisContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const testId = params.testId as string;
  const attemptIdParam = searchParams.get("attempt");

  const [test, setTest] = useState<MockTest | null>(null);
  const [attempt, setAttempt] = useState<UserAttempt | null>(null);
  const [questions, setQuestions] = useState<MockTestQuestion[]>([]);
  const [answerMap, setAnswerMap] = useState<
    Record<string, { selected: string; is_correct: boolean }>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: testData } = await supabase
        .from("mock_tests")
        .select("id, title, description, duration, total_marks, question_count, is_premium")
        .eq("id", testId)
        .maybeSingle();

      if (!testData) {
        setLoading(false);
        return;
      }

      setTest(testData);

      let attemptQuery = supabase
        .from("user_attempts")
        .select("*")
        .eq("mock_test_id", testId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (attemptIdParam) {
        attemptQuery = supabase
          .from("user_attempts")
          .select("*")
          .eq("id", attemptIdParam)
          .eq("user_id", user.id)
          .limit(1);
      }

      const { data: attemptData } = await attemptQuery.maybeSingle();

      if (!attemptData) {
        setLoading(false);
        return;
      }

      setAttempt(attemptData as UserAttempt);

      const fetchedQuestions = await fetchMockTestQuestions(supabase, testId);
      setQuestions(fetchedQuestions);

      const questionIds = fetchedQuestions.map((q) => q.id);

      let answersRes = await supabase
        .from("user_answers")
        .select("question_id, selected_answer, is_correct")
        .eq("attempt_id", attemptData.id);

      if (answersRes.error || !answersRes.data?.length) {
        answersRes = await supabase
          .from("user_answers")
          .select("question_id, selected_answer, is_correct")
          .eq("user_id", user.id)
          .in("question_id", questionIds)
          .order("created_at", { ascending: false });
      }

      const map: Record<string, { selected: string; is_correct: boolean }> = {};
      (answersRes.data ?? []).forEach((row) => {
        if (!map[row.question_id]) {
          map[row.question_id] = {
            selected: row.selected_answer ?? "",
            is_correct: row.is_correct ?? false,
          };
        }
      });

      setAnswerMap(map);
      setLoading(false);
    }

    if (testId) load();
  }, [testId, attemptIdParam]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!test || !attempt) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No attempt found</h2>
          <Link
            href="/mock-tests"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Mock Tests
          </Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Marks Obtained", value: `${attempt.marks_obtained} / ${attempt.total_marks}` },
    { label: "Correct", value: String(attempt.correct_count), color: "text-green-600" },
    { label: "Incorrect", value: String(attempt.incorrect_count), color: "text-red-600" },
    { label: "Unattempted", value: String(attempt.unattempted_count), color: "text-slate-600" },
    { label: "Accuracy", value: `${attempt.accuracy}%`, color: "text-blue-600" },
    { label: "Time Taken", value: formatTimeTaken(attempt.time_taken_seconds) },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        href="/mock-tests"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Mock Tests
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{test.title}</h1>
        <p className="mt-1 text-sm text-slate-600">Test Analysis & Review</p>
      </div>

      {/* Scorecard */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">{stat.label}</p>
            <p className={`mt-2 text-2xl font-bold ${stat.color ?? "text-slate-900"}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Question review */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Question-wise Review</h2>
        {questions.map((question, index) => {
          const userAnswer = answerMap[question.id];
          const options = getQuestionOptions(question);
          const correctDisplay = formatCorrectAnswerDisplay(question);
          const isUnattempted = !userAnswer?.selected;

          return (
            <div
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  Q{index + 1}
                </span>
                {isUnattempted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    Unattempted
                  </span>
                ) : userAnswer.is_correct ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    <XCircle className="h-3 w-3" />
                    Incorrect
                  </span>
                )}
              </div>

              <div className="text-sm leading-relaxed text-slate-800">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question.question_text}
                </ReactMarkdown>
              </div>

              {options.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {options.map((option) => {
                    const isUserChoice = userAnswer?.selected === option.id;
                    const correctOptions = formatCorrectAnswerDisplay(question)
                      .split(", ")
                      .map((o) => o.trim());
                    const isCorrectOption = correctOptions.includes(option.id);

                    let style = "border-slate-200 bg-white text-slate-700";
                    if (isCorrectOption) {
                      style = "border-green-500 bg-green-50 text-green-800";
                    }
                    if (isUserChoice && !userAnswer?.is_correct) {
                      style = "border-red-500 bg-red-50 text-red-800";
                    }
                    if (isUserChoice && userAnswer?.is_correct) {
                      style = "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/20";
                    }

                    return (
                      <div
                        key={option.id}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${style}`}
                      >
                        <div className="flex-1 text-left select-none">
                          <span className="font-bold mr-1">{option.id}.</span>
                          <span className="inline-block">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {option.text}
                            </ReactMarkdown>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {question.q_type === "NAT" && (
                <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                  <p>
                    Your answer:{" "}
                    <span className="font-semibold">{userAnswer?.selected || "—"}</span>
                  </p>
                  <p className="mt-1">
                    Correct answer: <span className="font-semibold">{correctDisplay}</span>
                  </p>
                </div>
              )}

              {question.explanation && (
                <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-slate-700">
                  <span className="font-semibold block mb-1">Explanation:</span>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {question.explanation}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MockTestAnalysisPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <AnalysisContent />
    </Suspense>
  );
}
