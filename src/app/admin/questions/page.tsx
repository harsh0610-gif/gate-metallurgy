"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type QuestionType = "MCQ" | "MSQ" | "NAT";
type Difficulty = "Easy" | "Medium" | "Hard";

interface QuestionOption {
  id: string;
  text: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  subject_id: string;
  name: string;
}

interface QuestionRow {
  id: string;
  subject_id: string;
  topic_id: string | null;
  q_type: QuestionType;
  pyq_year: number;
  is_pyq: boolean;
  difficulty: Difficulty;
  marks: number;
  negative_marks: number;
  question_text: string;
  options: QuestionOption[] | null;
  correct_options: string[];
  explanation: string | null;
  is_premium: boolean;
  subjects: { name: string } | null;
}

const EMPTY_FORM = {
  subjectId: "",
  topicId: "",
  questionType: "MCQ" as QuestionType,
  pyqYear: 2024,
  isPyq: true,
  difficulty: "Medium" as Difficulty,
  marks: 1,
  negativeMarks: 0,
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctMcq: "",
  correctMsq: [] as string[],
  correctNat: "",
  natMin: "",
  natMax: "",
  explanation: "",
  isPremium: false,
};

const OPTION_IDS = ["A", "B", "C", "D"] as const;

function getOptionFromForm(
  form: typeof EMPTY_FORM,
  id: (typeof OPTION_IDS)[number]
): string {
  const key = `option${id}` as "optionA" | "optionB" | "optionC" | "optionD";
  return form[key];
}

function buildOptionsJson(
  questionType: QuestionType,
  form: typeof EMPTY_FORM
): QuestionOption[] | null {
  if (questionType === "NAT") return null;

  return OPTION_IDS.map((id) => ({
    id,
    text: getOptionFromForm(form, id).trim(),
  }));
}

function buildCorrectOptions(form: typeof EMPTY_FORM): string[] {
  if (form.questionType === "MCQ") {
    return form.correctMcq ? [form.correctMcq] : [];
  }
  if (form.questionType === "MSQ") {
    return [...form.correctMsq].sort();
  }
  if (form.natMin && form.natMax) {
    return [`${form.natMin}-${form.natMax}`];
  }
  if (form.correctNat) {
    return [form.correctNat];
  }
  return [];
}

function parseOptionsToForm(options: QuestionOption[] | null) {
  return {
    optionA: options?.find((o) => o.id === "A")?.text ?? "",
    optionB: options?.find((o) => o.id === "B")?.text ?? "",
    optionC: options?.find((o) => o.id === "C")?.text ?? "",
    optionD: options?.find((o) => o.id === "D")?.text ?? "",
  };
}

function parseCorrectOptionsToForm(qType: QuestionType, correctOptions: string[]) {
  if (qType === "MCQ") {
    return {
      correctMcq: correctOptions[0] ?? "",
      correctMsq: [] as string[],
      correctNat: "",
      natMin: "",
      natMax: "",
    };
  }
  if (qType === "MSQ") {
    return {
      correctMcq: "",
      correctMsq: correctOptions,
      correctNat: "",
      natMin: "",
      natMax: "",
    };
  }

  const first = correctOptions[0] ?? "";
  const isRange = first.includes("-");
  const [natMin, natMax] = isRange ? first.split("-") : ["", ""];

  return {
    correctMcq: "",
    correctMsq: [] as string[],
    correctNat: isRange ? "" : first,
    natMin: natMin ?? "",
    natMax: natMax ?? "",
  };
}

export default function AdminQuestionsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const fetchSubjects = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("subjects").select("id, name").order("name");
    setSubjects(data ?? []);
  }, []);

  const fetchTopics = useCallback(async (subjectId: string) => {
    if (!subjectId) {
      setTopics([]);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("topics")
      .select("id, subject_id, name")
      .eq("subject_id", subjectId)
      .order("name");
    setTopics(data ?? []);
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*, subjects(name)")
      .order("pyq_year", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setQuestions((data ?? []) as QuestionRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchQuestions();
  }, [fetchSubjects, fetchQuestions]);

  useEffect(() => {
    fetchTopics(form.subjectId);
  }, [form.subjectId, fetchTopics]);

  function updateForm<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload() {
    return {
      subject_id: form.subjectId,
      topic_id: form.topicId || null,
      q_type: form.questionType,
      pyq_year: form.pyqYear,
      is_pyq: form.isPyq,
      difficulty: form.difficulty,
      marks: form.marks,
      negative_marks: form.negativeMarks,
      question_text: form.questionText.trim(),
      options: buildOptionsJson(form.questionType, form),
      correct_options: buildCorrectOptions(form),
      explanation: form.explanation.trim() || null,
      is_premium: form.isPremium,
    };
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setTopics([]);
  }

  function loadQuestionForEdit(q: QuestionRow) {
    const optionFields = parseOptionsToForm(q.options);
    const correctFields = parseCorrectOptionsToForm(q.q_type, q.correct_options ?? []);

    setForm({
      subjectId: q.subject_id,
      topicId: q.topic_id ?? "",
      questionType: q.q_type,
      pyqYear: q.pyq_year,
      isPyq: q.is_pyq,
      difficulty: q.difficulty,
      marks: q.marks,
      negativeMarks: q.negative_marks,
      questionText: q.question_text,
      ...optionFields,
      ...correctFields,
      explanation: q.explanation ?? "",
      isPremium: q.is_premium,
    });
    setEditingId(q.id);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!form.subjectId) {
      setMessage({ type: "error", text: "Please select a subject." });
      setSubmitting(false);
      return;
    }

    if (!form.questionText.trim()) {
      setMessage({ type: "error", text: "Question text is required." });
      setSubmitting(false);
      return;
    }

    const correctOptions = buildCorrectOptions(form);
    if (correctOptions.length === 0) {
      setMessage({ type: "error", text: "Please set the correct answer." });
      setSubmitting(false);
      return;
    }

    if (form.questionType !== "NAT") {
      const options = buildOptionsJson(form.questionType, form) ?? [];
      const hasEmptyOption = options.some((o) => !o.text);
      if (hasEmptyOption) {
        setMessage({ type: "error", text: "Please fill in all four options." });
        setSubmitting(false);
        return;
      }
    }

    const supabase = createClient();
    const payload = buildPayload();

    if (editingId) {
      const { error } = await supabase.from("questions").update(payload).eq("id", editingId);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Question updated successfully!" });
        resetForm();
        fetchQuestions();
      }
    } else {
      const { error } = await supabase.from("questions").insert(payload);
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Question added successfully!" });
        resetForm();
        fetchQuestions();
      }
    }

    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this question?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("questions").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Question deleted successfully." });
      if (editingId === id) resetForm();
      fetchQuestions();
    }
  }

  function toggleMsqAnswer(option: string) {
    updateForm(
      "correctMsq",
      form.correctMsq.includes(option)
        ? form.correctMsq.filter((o) => o !== option)
        : [...form.correctMsq, option]
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Questions</h1>
        <p className="mt-2 text-slate-600">Add, edit, and delete GATE MT questions.</p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {editingId ? "Edit Question" : "Add New Question"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Subject</label>
            <select
              value={form.subjectId}
              onChange={(e) => {
                updateForm("subjectId", e.target.value);
                updateForm("topicId", "");
              }}
              required
              className={inputClass}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Topic</label>
            <select
              value={form.topicId}
              onChange={(e) => updateForm("topicId", e.target.value)}
              className={inputClass}
              disabled={!form.subjectId}
            >
              <option value="">Select topic (optional)</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Question Type</label>
            <select
              value={form.questionType}
              onChange={(e) => updateForm("questionType", e.target.value as QuestionType)}
              className={inputClass}
            >
              <option value="MCQ">MCQ</option>
              <option value="MSQ">MSQ</option>
              <option value="NAT">NAT</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>PYQ Year</label>
            <input
              type="number"
              min={2010}
              max={2024}
              value={form.pyqYear}
              onChange={(e) => updateForm("pyqYear", Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => updateForm("difficulty", e.target.value as Difficulty)}
              className={inputClass}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Marks</label>
            <input
              type="number"
              step="0.01"
              value={form.marks}
              onChange={(e) => updateForm("marks", Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Negative Marks</label>
            <input
              type="number"
              step="0.01"
              value={form.negativeMarks}
              onChange={(e) => updateForm("negativeMarks", Number(e.target.value))}
              className={inputClass}
            />
          </div>

          <div className="flex items-end gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isPyq}
                onChange={(e) => updateForm("isPyq", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Is PYQ
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={(e) => updateForm("isPremium", e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Is Premium
            </label>
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>Question Text</label>
          <textarea
            value={form.questionText}
            onChange={(e) => updateForm("questionText", e.target.value)}
            required
            rows={5}
            placeholder="Enter the full question text..."
            className={inputClass}
          />
        </div>

        {form.questionType !== "NAT" && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {OPTION_IDS.map((opt) => {
              const key = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
              return (
                <div key={opt}>
                  <label className={labelClass}>Option {opt}</label>
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => updateForm(key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5">
          <label className={labelClass}>Correct Answer</label>

          {form.questionType === "MCQ" && (
            <div className="flex flex-wrap gap-4">
              {OPTION_IDS.map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="correctMcq"
                    value={opt}
                    checked={form.correctMcq === opt}
                    onChange={(e) => updateForm("correctMcq", e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  Option {opt}
                </label>
              ))}
            </div>
          )}

          {form.questionType === "MSQ" && (
            <div className="flex flex-wrap gap-4">
              {OPTION_IDS.map((opt) => (
                <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.correctMsq.includes(opt)}
                    onChange={() => toggleMsqAnswer(opt)}
                    className="h-4 w-4 rounded text-blue-600"
                  />
                  Option {opt}
                </label>
              ))}
            </div>
          )}

          {form.questionType === "NAT" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Exact answer</label>
                <input
                  type="number"
                  step="any"
                  value={form.correctNat}
                  onChange={(e) => updateForm("correctNat", e.target.value)}
                  placeholder="e.g. 42.5"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Range min</label>
                <input
                  type="number"
                  step="any"
                  value={form.natMin}
                  onChange={(e) => updateForm("natMin", e.target.value)}
                  placeholder="Min"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Range max</label>
                <input
                  type="number"
                  step="any"
                  value={form.natMax}
                  onChange={(e) => updateForm("natMax", e.target.value)}
                  placeholder="Max"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-5">
          <label className={labelClass}>Explanation</label>
          <textarea
            value={form.explanation}
            onChange={(e) => updateForm("explanation", e.target.value)}
            rows={4}
            placeholder="Explain the correct answer..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            All Questions ({questions.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : questions.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No questions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Question</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Year</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-slate-800">{q.question_text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {q.subjects?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{q.pyq_year}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {q.q_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          q.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : q.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadQuestionForEdit(q)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
