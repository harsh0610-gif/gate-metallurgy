"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, FileQuestion, Loader2, Play, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDuration } from "@/lib/mock-tests/utils";
import type { MockTest } from "@/lib/mock-tests/types";

const INSTRUCTIONS = [
  "This is a timed test.",
  "Each MCQ carries 1 or 2 marks.",
  "Wrong answers have negative marking.",
  "You can mark questions for review.",
  "Test auto-submits when time runs out.",
];

export default function MockTestInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const [test, setTest] = useState<MockTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("mock_tests")
        .select("id, title, description, duration, total_marks, question_count, is_premium")
        .eq("id", testId)
        .maybeSingle();

      if (!data) {
        router.replace("/mock-tests");
        return;
      }

      setTest(data);
      setLoading(false);
    }

    if (testId) load();
  }, [testId, router]);

  if (loading || !test) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/mock-tests"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Mock Tests
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">{test.title}</h1>
          {test.description && (
            <p className="mt-2 text-sm text-slate-600">{test.description}</p>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatDuration(test.duration)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Total Marks</p>
                <p className="text-sm font-semibold text-slate-900">{test.total_marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <FileQuestion className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">Questions</p>
                <p className="text-sm font-semibold text-slate-900">{test.question_count}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Instructions</h2>
            <ol className="mt-4 space-y-3">
              {INSTRUCTIONS.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <Link
            href={`/mock-tests/${testId}`}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-colors hover:bg-blue-700"
          >
            <Play className="h-5 w-5 fill-white" />
            Start Test
          </Link>
        </div>
      </div>
    </div>
  );
}
