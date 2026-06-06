import type { MockTestQuestion } from "./types";

function mapQuestionRow(row: Record<string, unknown>, sortOrder?: number): MockTestQuestion {
  const q = (row.questions ?? row) as Record<string, unknown>;
  const subjects = q.subjects as { name: string } | { name: string }[] | null;

  return {
    id: q.id as string,
    subject_id: q.subject_id as string,
    pyq_year: (q.pyq_year as number) ?? 0,
    difficulty: (q.difficulty as MockTestQuestion["difficulty"]) ?? "Medium",
    q_type: (q.q_type as MockTestQuestion["q_type"]) ?? "MCQ",
    question_text: q.question_text as string,
    options: (q.options as MockTestQuestion["options"]) ?? null,
    correct_options: (q.correct_options as string[]) ?? null,
    correct_answer: (q.correct_answer as string) ?? null,
    explanation: (q.explanation as string) ?? null,
    subjects: Array.isArray(subjects) ? subjects[0] ?? null : subjects,
    marks: (q.marks as number) ?? 1,
    negative_marks: (q.negative_marks as number) ?? 0,
    sort_order: sortOrder,
  };
}

export async function fetchMockTestQuestions(
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>,
  testId: string
): Promise<MockTestQuestion[]> {
  const junctionRes = await supabase
    .from("mock_test_questions")
    .select("sort_order, questions(*, subjects(name))")
    .eq("mock_test_id", testId)
    .order("sort_order");

  if (!junctionRes.error && junctionRes.data?.length) {
    return junctionRes.data.map((row) =>
      mapQuestionRow(row as Record<string, unknown>, row.sort_order as number)
    );
  }

  const directRes = await supabase
    .from("questions")
    .select("*, subjects(name)")
    .eq("mock_test_id", testId);

  if (!directRes.error && directRes.data?.length) {
    return directRes.data.map((row) => mapQuestionRow(row));
  }

  return [];
}
