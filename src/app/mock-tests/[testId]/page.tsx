"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchMockTestQuestions } from "@/lib/mock-tests/fetch-questions";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { calculateAttemptResult } from "@/lib/mock-tests/scoring";
import {
  formatTimer,
  getPaletteButtonClass,
  getPaletteStatus,
} from "@/lib/mock-tests/utils";
import { getQuestionOptions } from "@/lib/pyqs/utils";
import type { MockTest, QuestionAnswerState } from "@/lib/mock-tests/types";

function buildInitialAnswers(questionIds: string[]): Record<string, QuestionAnswerState> {
  const answers: Record<string, QuestionAnswerState> = {};
  questionIds.forEach((id, index) => {
    answers[id] = {
      selected: "",
      markedForReview: false,
      visited: index === 0,
    };
  });
  return answers;
}

export default function MockTestExamPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<MockTest | null>(null);
  const [questions, setQuestions] = useState<Awaited<ReturnType<typeof fetchMockTestQuestions>>>([]);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const startedAtRef = useRef<number>(Date.now());
  const submittedRef = useRef(false);
  const submitRef = useRef<() => Promise<void>>(async () => {});

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || submitting || !test) return;
    submittedRef.current = true;
    setSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace(`/login?next=/mock-tests/${testId}`);
      return;
    }

    const timeTakenSeconds = Math.max(
      1,
      Math.floor((Date.now() - startedAtRef.current) / 1000)
    );

    const result = calculateAttemptResult(
      questions,
      answers,
      test.total_marks,
      timeTakenSeconds
    );

    const { data: attempt, error: attemptError } = await supabase
      .from("user_attempts")
      .insert({
        user_id: user.id,
        mock_test_id: testId,
        marks_obtained: result.marksObtained,
        total_marks: result.totalMarks,
        correct_count: result.correctCount,
        incorrect_count: result.incorrectCount,
        unattempted_count: result.unattemptedCount,
        accuracy: result.accuracy,
        time_taken_seconds: result.timeTakenSeconds,
      })
      .select("id")
      .single();

    if (attemptError) {
      console.error(attemptError);
      submittedRef.current = false;
      setSubmitting(false);
      alert("Failed to submit test. Please try again.");
      return;
    }

    const answerInserts = result.answerRows
      .filter((row) => row.selected_answer)
      .map((row) => ({
        user_id: user.id,
        question_id: row.question_id,
        selected_answer: row.selected_answer,
        is_correct: row.is_correct,
        attempt_id: attempt.id,
      }));

    if (answerInserts.length > 0) {
      let { error: answersError } = await supabase.from("user_answers").insert(answerInserts);

      if (answersError?.message?.includes("attempt_id")) {
        const fallbackInserts = answerInserts.map((row) => ({
          user_id: row.user_id,
          question_id: row.question_id,
          selected_answer: row.selected_answer,
          is_correct: row.is_correct,
        }));
        ({ error: answersError } = await supabase.from("user_answers").insert(fallbackInserts));
      }

      if (answersError) {
        console.error(answersError);
      }
    }

    router.replace(`/mock-tests/${testId}/analysis?attempt=${attempt.id}`);
  }, [answers, questions, router, submitting, test, testId]);

  submitRef.current = handleSubmit;

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: testData } = await supabase
        .from("mock_tests")
        .select("id, title, description, duration, total_marks, question_count, is_premium")
        .eq("id", testId)
        .maybeSingle();

      if (!testData) {
        router.replace("/mock-tests");
        return;
      }

      const fetchedQuestions = await fetchMockTestQuestions(supabase, testId);

      if (fetchedQuestions.length === 0) {
        router.replace("/mock-tests");
        return;
      }

      setTest(testData);
      setQuestions(fetchedQuestions);
      setAnswers(buildInitialAnswers(fetchedQuestions.map((q) => q.id)));
      setTimeLeft(testData.duration * 60);
      startedAtRef.current = Date.now();
      setLoading(false);
    }

    if (testId) load();
  }, [testId, router]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentIndex]);

  function visitQuestion(index: number) {
    const question = questions[index];
    if (!question) return;

    setCurrentIndex(index);
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        visited: true,
      },
    }));
  }

  function selectOption(optionId: string) {
    const question = questions[currentIndex];
    if (!question) return;

    setAnswers((prev) => {
      const prevAnswer = prev[question.id];
      let selected = optionId;

      if (question.q_type === "MSQ") {
        const currentSelections = prevAnswer?.selected
          ? prevAnswer.selected.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
        const nextSelections = currentSelections.includes(optionId)
          ? currentSelections.filter((s) => s !== optionId)
          : [...currentSelections, optionId];
        selected = nextSelections.sort().join(",");
      }

      return {
        ...prev,
        [question.id]: {
          ...prevAnswer,
          selected,
          visited: true,
        },
      };
    });
  }

  function toggleMarkForReview() {
    const question = questions[currentIndex];
    if (!question) return;

    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        ...prev[question.id],
        markedForReview: !prev[question.id]?.markedForReview,
        visited: true,
      },
    }));
  }

  if (loading || !test || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentState = answers[currentQuestion.id];
  const options = getQuestionOptions(currentQuestion);
  const isLowTime = timeLeft <= 300;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/40">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3.5 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <h1 className="truncate text-base font-extrabold text-slate-900 tracking-tight">
            {test.title}
          </h1>
          <div className="flex items-center gap-3.5">
            <div
              className={`rounded-xl px-4 py-2 font-mono text-sm font-black border tracking-wider shadow-sm transition-colors ${
                isLowTime 
                  ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse-soft" 
                  : "bg-blue-50 border-blue-100 text-blue-700"
              }`}
            >
              {formatTimer(timeLeft)}
            </div>
            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              disabled={submitting}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 lg:flex-row lg:p-6">
        {/* Question area */}
        <main className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 flex flex-col justify-between">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 border border-blue-100/50">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 border border-indigo-100/50">
                {currentQuestion.q_type}
              </span>
              {currentQuestion.marks > 0 && (
                <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-655 border border-slate-200/40">
                  +{currentQuestion.marks} marks
                </span>
              )}
            </div>

            <div className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.question_text}
              </ReactMarkdown>
            </div>

            {currentQuestion.q_type === "NAT" ? (
              <div className="mt-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Your Answer
                </label>
                <input
                  type="number"
                  step="any"
                  value={currentState?.selected ?? ""}
                  onChange={(e) => {
                    const question = questions[currentIndex];
                    setAnswers((prev) => ({
                      ...prev,
                      [question.id]: {
                        ...prev[question.id],
                        selected: e.target.value,
                        visited: true,
                      },
                    }));
                  }}
                  className="w-full max-w-xs rounded-xl border border-slate-350 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter numerical answer"
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {options.map((option) => {
                  const isSelected = currentQuestion.q_type === "MSQ"
                    ? currentState?.selected?.split(",").map((s) => s.trim()).includes(option.id)
                    : currentState?.selected === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => selectOption(option.id)}
                      className={`group flex items-start gap-3.5 rounded-xl border px-5 py-4 text-left text-sm transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/10 scale-[1.01] shadow-sm font-semibold"
                          : "border-slate-200/80 bg-white text-slate-700 hover:border-blue-450 hover:bg-blue-50/15 hover:scale-[1.01] hover:shadow-sm"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-slate-100 border border-slate-200 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:border-blue-200"
                        }`}
                      >
                        {option.id}
                      </span>
                      <div className="flex-1 select-none text-left pt-0.5">
                        <span className="inline-block">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {option.text}
                          </ReactMarkdown>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => visitQuestion(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => visitQuestion(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleMarkForReview}
              className={`ml-auto rounded-xl px-5 py-2.5 text-sm font-bold transition-all shadow-sm ${
                currentState?.markedForReview
                  ? "bg-orange-100 border border-orange-200 text-orange-850"
                  : "border border-orange-350 text-orange-705 hover:bg-orange-50/50"
              }`}
            >
              {currentState?.markedForReview ? "Unmark Review" : "Mark for Review"}
            </button>
          </div>
        </main>

        {/* Question palette */}
        <aside className="w-full shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:w-76">
          <h2 className="mb-4 text-sm font-bold text-slate-900 tracking-tight">Question Palette</h2>
          <div className="mb-5 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Not visited
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-400 bg-white" /> Not answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse-soft" /> Marked
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-5">
            {questions.map((q, index) => {
              const status = getPaletteStatus(answers[q.id]);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => visitQuestion(index)}
                  className={getPaletteButtonClass(status, index === currentIndex)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Submit confirmation */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Test?</h3>
                <p className="mt-2 text-sm text-slate-600">
                  You cannot change answers after submission. Are you sure you want to submit?
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleSubmit();
                }}
                disabled={submitting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
