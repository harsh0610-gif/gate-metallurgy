"use client";

import { FormEvent, Fragment, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface Topic {
  id: string;
  subject_id: string;
  name: string;
  slug: string | null;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [topicSubmitting, setTopicSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [subjectName, setSubjectName] = useState("");
  const [subjectSlug, setSubjectSlug] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [topicName, setTopicName] = useState("");
  const [topicSlug, setTopicSlug] = useState("");

  // Premium convenience admin states
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickTopicName, setQuickTopicName] = useState("");
  const [quickSubmittingId, setQuickSubmittingId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const [subjectsRes, topicsRes] = await Promise.all([
      supabase.from("subjects").select("id, name, slug").order("name"),
      supabase.from("topics").select("id, subject_id, name, slug").order("name"),
    ]);

    if (subjectsRes.error) {
      setMessage({ type: "error", text: subjectsRes.error.message });
    } else {
      setSubjects(subjectsRes.data ?? []);
    }

    if (topicsRes.error) {
      setMessage({ type: "error", text: topicsRes.error.message });
    } else {
      setTopics(topicsRes.data ?? []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleAddSubject(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("subjects")
      .insert({
        name: subjectName.trim(),
        slug: subjectSlug.trim() || slugify(subjectName),
      })
      .select("id, name, slug")
      .single();

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Subject added successfully!" });
      setSubjects((prev) => [...prev, data]);
      setSelectedSubjectId(data.id);
      setSubjectName("");
      setSubjectSlug("");
    }

    setSubmitting(false);
  }

  async function handleAddTopic(e: FormEvent) {
    e.preventDefault();
    if (!selectedSubjectId) {
      setMessage({ type: "error", text: "Please select a subject first." });
      return;
    }

    setTopicSubmitting(true);
    setMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("topics")
      .insert({
        subject_id: selectedSubjectId,
        name: topicName.trim(),
        slug: topicSlug.trim() || slugify(topicName),
      })
      .select("id, subject_id, name, slug")
      .single();

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Topic added successfully!" });
      setTopics((prev) => [...prev, data]);
      setTopicName("");
      setTopicSlug("");
    }

    setTopicSubmitting(false);
  }

  async function handleQuickAddTopic(e: FormEvent, subjectId: string) {
    e.preventDefault();
    if (!quickTopicName.trim()) return;

    setQuickSubmittingId(subjectId);
    setMessage(null);

    const supabase = createClient();
    const generatedSlug = slugify(quickTopicName);
    const { data, error } = await supabase
      .from("topics")
      .insert({
        subject_id: subjectId,
        name: quickTopicName.trim(),
        slug: generatedSlug,
      })
      .select("id, subject_id, name, slug")
      .single();

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: `Topic "${quickTopicName.trim()}" added successfully!` });
      setTopics((prev) => [...prev, data]);
      setQuickTopicName("");
    }

    setQuickSubmittingId(null);
  }

  async function handleDeleteSubject(id: string, name: string) {
    if (!confirm(`Delete subject "${name}" and all its topics?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from("subjects").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Subject deleted successfully." });
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setTopics((prev) => prev.filter((t) => t.subject_id !== id));
      if (selectedSubjectId === id) setSelectedSubjectId("");
      if (expandedSubjectId === id) setExpandedSubjectId(null);
    }
  }

  async function handleDeleteTopic(id: string, name: string) {
    if (!confirm(`Delete topic "${name}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from("topics").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Topic deleted successfully." });
      setTopics((prev) => prev.filter((t) => t.id !== id));
    }
  }

  const selectedSubjectTopics = topics.filter((t) => t.subject_id === selectedSubjectId);

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Subjects & Topics</h1>
        <p className="mt-2 text-slate-600">
          Manage subjects and their topics for organizing questions.
        </p>
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

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={handleAddSubject}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add New Subject</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  if (!subjectSlug) setSubjectSlug(slugify(e.target.value));
                }}
                required
                placeholder="e.g. Thermodynamics"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Slug</label>
              <input
                type="text"
                value={subjectSlug}
                onChange={(e) => setSubjectSlug(e.target.value)}
                placeholder="thermodynamics"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Subject
            </button>
          </div>
        </form>

        <form
          onSubmit={handleAddTopic}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add Topic Under Subject</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Topic Name</label>
              <input
                type="text"
                value={topicName}
                onChange={(e) => {
                  setTopicName(e.target.value);
                  if (!topicSlug) setTopicSlug(slugify(e.target.value));
                }}
                required
                placeholder="e.g. Laws of Thermodynamics"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Topic Slug</label>
              <input
                type="text"
                value={topicSlug}
                onChange={(e) => setTopicSlug(e.target.value)}
                placeholder="laws-of-thermodynamics"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={topicSubmitting || !selectedSubjectId}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {topicSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Topic
            </button>
          </div>

          {selectedSubjectId && selectedSubjectTopics.length > 0 && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3">
              <p className="mb-2 text-xs font-semibold uppercase text-slate-500">
                Topics in this subject
              </p>
              <ul className="space-y-1">
                {selectedSubjectTopics.map((topic) => (
                  <li
                    key={topic.id}
                    className="flex items-center justify-between text-sm text-slate-700"
                  >
                    <span>{topic.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTopic(topic.id, topic.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 px-6 py-4 gap-3 bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Existing Subjects</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full rounded-lg border border-slate-300 pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : filteredSubjects.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No subjects found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Subject Name</th>
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Topics Count</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((subject) => {
                  const subjectTopics = topics.filter((t) => t.subject_id === subject.id);
                  const isExpanded = expandedSubjectId === subject.id;

                  return (
                    <Fragment key={subject.id}>
                      {/* Main Subject Row */}
                      <tr
                        onClick={() => setExpandedSubjectId(isExpanded ? null : subject.id)}
                        className="hover:bg-slate-55/40 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-450 shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                            {subject.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{subject.slug}</td>
                        <td className="px-6 py-4 text-slate-600">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedSubjectId(isExpanded ? null : subject.id);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/70 border border-blue-100 hover:bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-all"
                          >
                            <span>{subjectTopics.length} Topics</span>
                          </button>
                        </td>
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleDeleteSubject(subject.id, subject.name)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </td>
                      </tr>

                      {/* Nested Topics Accordion Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/30">
                          <td colSpan={4} className="px-6 py-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-page-entry">
                              {/* Accordion Header */}
                              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                                  Topics in {subject.name}
                                </h3>
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                                  {subjectTopics.length} Total
                                </span>
                              </div>

                              {/* Topics List */}
                              <div className="space-y-2">
                                {subjectTopics.length === 0 ? (
                                  <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg">
                                    No topics found for this subject. Use the form below to quick add one.
                                  </p>
                                ) : (
                                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                                    {subjectTopics.map((topic) => (
                                      <div
                                        key={topic.id}
                                        className="flex items-center justify-between py-2 text-sm hover:bg-slate-50/50 px-2 rounded-lg transition-colors group/topic"
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                          <span className="font-semibold text-slate-800">{topic.name}</span>
                                          <span className="text-[11px] text-slate-450 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium">
                                            {topic.slug || "no-slug"}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTopic(topic.id, topic.name);
                                          }}
                                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-55 transition-colors shadow-sm"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                          Delete
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Inline Quick Add Form */}
                                <form
                                  onSubmit={(e) => handleQuickAddTopic(e, subject.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-4 border-t border-slate-100 pt-4 flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={quickTopicName}
                                    onChange={(e) => setQuickTopicName(e.target.value)}
                                    placeholder={`Quick add topic under ${subject.name}...`}
                                    required
                                    className="max-w-md flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                  />
                                  <button
                                    type="submit"
                                    disabled={quickSubmittingId === subject.id || !quickTopicName.trim()}
                                    className="inline-flex items-center gap-1 rounded-lg bg-blue-650 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
                                  >
                                    {quickSubmittingId === subject.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                    Quick Add
                                  </button>
                                </form>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
