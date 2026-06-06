"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, ChevronDown, Loader2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Question } from "@/lib/pyqs/types";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  checkAnswer,
  formatCorrectAnswerDisplay,
  formatSelectedAnswer,
  getCorrectOptions,
  getQuestionOptions,
} from "@/lib/pyqs/utils";
import LoginGate from "@/components/shared/login-gate";

interface QuestionCardProps {
  question: Question;
  isExpanded: boolean;
  isBookmarked: boolean;
  onToggleExpand: () => void;
  onBookmarkChange: (questionId: string, bookmarked: boolean) => void;
  isLoggedIn?: boolean;
}

export default function QuestionCard({
  question,
  isExpanded,
  isBookmarked,
  onToggleExpand,
  onBookmarkChange,
  isLoggedIn = true,
}: QuestionCardProps) {
  const [selectedMcq, setSelectedMcq] = useState("");
  const [selectedMsq, setSelectedMsq] = useState<string[]>([]);
  const [natAnswer, setNatAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [error, setError] = useState("");

  const subjectName = question.subjects?.name ?? "Unknown Subject";
  const options = getQuestionOptions(question);
  const correctOptions = getCorrectOptions(question);

  useEffect(() => {
    setSelectedMcq("");
    setSelectedMsq([]);
    setNatAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setError("");
  }, [question.id]);

  function resetAnswerState() {
    setSelectedMcq("");
    setSelectedMsq([]);
    setNatAnswer("");
    setSubmitted(false);
    setIsCorrect(false);
    setError("");
  }

  function handleExpand() {
    if (!isExpanded) {
      resetAnswerState();
    }
    onToggleExpand();
  }

  function toggleMsqOption(option: string) {
    if (submitted) return;
    setSelectedMsq((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  function getSelectedAnswer(): string {
    if (question.q_type === "NAT") return natAnswer.trim();
    if (question.q_type === "MSQ") return formatSelectedAnswer("MSQ", selectedMsq);
    return selectedMcq;
  }

  async function handleSubmit() {
    const selected = getSelectedAnswer();

    if (!selected) {
      setError("Please select or enter an answer before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    const correct = checkAnswer(question, selected);
    setIsCorrect(correct);
    setSubmitted(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: saveError } = await supabase.from("user_answers").insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: selected,
        is_correct: correct,
      });

      if (saveError) {
        setError(saveError.message);
      }
    }

    setSubmitting(false);
  }

  async function handleBookmark() {
    setBookmarking(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to bookmark questions.");
      setBookmarking(false);
      return;
    }

    if (isBookmarked) {
      const { error: deleteError } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("question_id", question.id);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        onBookmarkChange(question.id, false);
      }
    } else {
      const { error: insertError } = await supabase.from("bookmarks").insert({
        user_id: user.id,
        question_id: question.id,
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        onBookmarkChange(question.id, true);
      }
    }

    setBookmarking(false);
  }

  function getOptionClass(optionId: string) {
    const isSelected = question.q_type === "MSQ" ? selectedMsq.includes(optionId) : selectedMcq === optionId;
    const isCorrectOption = correctOptions.includes(optionId.toUpperCase());

    if (!submitted) {
      return isSelected
        ? "border-blue-600 bg-blue-50/60 text-blue-900 ring-2 ring-blue-500/10 scale-[1.01] shadow-sm font-semibold"
        : "border-slate-200/80 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50/15 hover:scale-[1.01] hover:shadow-sm";
    }

    if (isCorrectOption) {
      return "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500/20";
    }
    
    if (isSelected && !isCorrectOption) {
      return "border-rose-500 bg-rose-50 text-rose-950 font-bold shadow-sm ring-1 ring-rose-500/20";
    }

    return "border-slate-200/60 bg-slate-50/40 text-slate-400";
  }

  function getLetterClass(optionId: string) {
    const isSelected = question.q_type === "MSQ" ? selectedMsq.includes(optionId) : selectedMcq === optionId;
    const isCorrectOption = correctOptions.includes(optionId.toUpperCase());

    if (!submitted) {
      return isSelected
        ? "bg-blue-600 text-white border-blue-600"
        : "bg-slate-100 border border-slate-200 text-slate-650 group-hover:bg-blue-100 group-hover:text-blue-700 group-hover:border-blue-200";
    }

    if (isCorrectOption) {
      return "bg-emerald-600 text-white border-emerald-600";
    }

    if (isSelected && !isCorrectOption) {
      return "bg-rose-600 text-white border-rose-600";
    }

    return "bg-slate-100 border border-slate-200 text-slate-400";
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <button
        type="button"
        onClick={handleExpand}
        className="w-full px-5 py-4.5 text-left sm:px-6 sm:py-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 border border-blue-100/50">
            {subjectName}
          </span>
          <span className="rounded-full bg-slate-55 px-3 py-1 text-[10px] font-bold text-slate-600 border border-slate-200/40">
            {question.pyq_year}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-bold ${
              question.difficulty.toLowerCase() === "easy"
                ? "bg-emerald-50 text-emerald-700 border-emerald-250/30"
                : question.difficulty.toLowerCase() === "medium"
                  ? "bg-amber-50 text-amber-700 border-amber-250/30"
                  : "bg-rose-50 text-rose-700 border-rose-250/30"
            }`}
          >
            {question.difficulty}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-700 border border-indigo-100/50">
            {question.q_type}
          </span>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div
            className={`flex-1 text-sm leading-relaxed text-slate-800 sm:text-base ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {question.question_text}
            </ReactMarkdown>
          </div>

          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100/80 px-5 pb-6 pt-3 sm:px-6">
          {!isLoggedIn ? (
            <div className="py-4">
              <LoginGate
                heading="Login to Solve Questions"
                subtext="To submit answers, view options, see detailed explanations, and bookmark questions, log in to your account."
              />
            </div>
          ) : (
            <>
              {question.q_type === "NAT" ? (
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Your Answer (NAT)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={natAnswer}
                    onChange={(e) => setNatAnswer(e.target.value)}
                    disabled={submitted}
                    placeholder="Enter numerical answer"
                    className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
                  />
                </div>
              ) : options.length > 0 ? (
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  {options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        if (submitted) return;
                        if (question.q_type === "MSQ") {
                          toggleMsqOption(option.id);
                        } else {
                          setSelectedMcq(option.id);
                        }
                      }}
                      disabled={submitted}
                      className={`group flex items-start gap-3.5 rounded-xl border px-5 py-4 text-left text-sm transition-all duration-200 ${getOptionClass(
                        option.id
                      )}`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${getLetterClass(
                          option.id
                        )}`}
                      >
                        {option.id}
                      </span>
                      <div className="flex-1 text-left select-none pt-0.5">
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
                  ))}
                </div>
              ) : (
                <p className="mb-5 text-sm text-slate-550 font-medium">No options available for this question.</p>
              )}

              {submitted && (
                <>
                  <div
                    className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
                      isCorrect
                        ? "border-emerald-250 bg-emerald-50 text-emerald-800"
                        : "border-rose-250 bg-rose-50 text-rose-800"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-650" />
                    ) : (
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-655" />
                    )}
                    <div>
                      <p className="font-bold">{isCorrect ? "Correct!" : "Incorrect"}</p>
                      {!isCorrect && (
                        <p className="mt-1 text-sm font-semibold">
                          Correct answer:{" "}
                          <span className="underline decoration-wavy decoration-emerald-550 font-extrabold text-emerald-850">
                            {formatCorrectAnswerDisplay(question)}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Explanation
                      </p>
                      <div className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {question.explanation}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </>
              )}

              {error && (
                <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-650">
                  {error}
                  {error.includes("log in") && (
                    <>
                      {" "}
                      <Link href="/login" className="font-extrabold underline hover:text-rose-800">
                        Login here
                      </Link>
                    </>
                  )}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {!submitted && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5.5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/15 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Answer
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBookmark}
                  disabled={bookmarking}
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
                    isBookmarked
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  <Bookmark
                    className={`h-4 w-4 transition-colors ${isBookmarked ? "fill-blue-600 text-blue-600" : "text-slate-500"}`}
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
