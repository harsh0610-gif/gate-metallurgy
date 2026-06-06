"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Crown, FileText, Loader2, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Subject {
  id: string;
  name: string;
}

interface Topic {
  id: string;
  subject_id: string;
  name: string;
}

interface NoteRow {
  id: string;
  title: string;
  content: string;
  is_premium: boolean;
  note_type?: string | null;
  pdf_url?: string | null;
  subjects: { name: string } | null;
}

export default function AdminNotesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [noteType, setNoteType] = useState<"text" | "pdf">("text");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const fetchSubjectsAndTopics = useCallback(async () => {
    const supabase = createClient();
    const [subjRes, topicRes] = await Promise.all([
      supabase.from("subjects").select("id, name").order("name"),
      supabase.from("topics").select("id, subject_id, name").order("name"),
    ]);
    setSubjects(subjRes.data ?? []);
    setTopics(topicRes.data ?? []);
  }, []);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notes")
      .select("id, title, content, is_premium, note_type, pdf_url, subjects(name)")
      .order("title");

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      const formatted = (data ?? []).map((row) => {
        const r = row as {
          id: string;
          title: string;
          content: string;
          is_premium: boolean;
          note_type?: string | null;
          pdf_url?: string | null;
          subjects: { name: string }[] | { name: string } | null;
        };
        return {
          id: r.id,
          title: r.title,
          content: r.content,
          is_premium: r.is_premium,
          note_type: r.note_type,
          pdf_url: r.pdf_url,
          subjects: Array.isArray(r.subjects) ? r.subjects[0] ?? null : r.subjects,
        };
      });
      setNotes(formatted as NoteRow[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubjectsAndTopics();
    fetchNotes();
  }, [fetchSubjectsAndTopics, fetchNotes]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    if (!subjectId || !topicId || !title.trim()) {
      setMessage({ type: "error", text: "Subject, topic, and title are required." });
      setSubmitting(false);
      return;
    }

    if (noteType === "text" && !content.trim()) {
      setMessage({ type: "error", text: "Content is required for text notes." });
      setSubmitting(false);
      return;
    }

    if (noteType === "pdf" && !pdfFile) {
      setMessage({ type: "error", text: "PDF file is required for PDF notes." });
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      let pdfUrl: string | null = null;

      if (noteType === "pdf" && pdfFile) {
        const fileName = `${Date.now()}_${pdfFile.name.replace(/\s+/g, "_")}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("note-files")
          .upload(fileName, pdfFile, { contentType: "application/pdf" });

        if (uploadError) {
          throw new Error(`PDF upload failed: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from("note-files")
          .getPublicUrl(uploadData.path);

        pdfUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("notes").insert({
        subject_id: subjectId,
        topic_id: topicId,
        title: title.trim(),
        content: noteType === "text" ? content.trim() : "",
        note_type: noteType,
        pdf_url: pdfUrl,
        is_premium: isPremium,
      });

      if (error) {
        throw new Error(error.message);
      }

      setMessage({ type: "success", text: "Note added successfully!" });
      setSubjectId("");
      setTopicId("");
      setTitle("");
      setContent("");
      setIsPremium(false);
      setNoteType("text");
      setPdfFile(null);
      fetchNotes();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, noteTitle: string) {
    if (!confirm(`Delete note "${noteTitle}"?`)) return;

    const supabase = createClient();
    const { error } = await supabase.from("notes").delete().eq("id", id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Note deleted successfully." });
      fetchNotes();
    }
  }

  const filteredTopics = topics.filter((t) => t.subject_id === subjectId);

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Notes</h1>
        <p className="mt-2 text-slate-600">Add and delete study notes for GATE MT subjects.</p>
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
        <h2 className="mb-6 text-lg font-semibold text-slate-900">Add New Note</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Subject</label>
            <select
              value={subjectId}
              onChange={(e) => {
                setSubjectId(e.target.value);
                setTopicId("");
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
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              required
              disabled={!subjectId}
              className={inputClass}
            >
              <option value="">Select topic</option>
              {filteredTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Note title"
            className={inputClass}
          />
        </div>

        <div className="mt-5">
          <label className={labelClass}>Note Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setNoteType("text")}
              className={`flex-1 rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                noteType === "text"
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Text Note
            </button>
            <button
              type="button"
              onClick={() => setNoteType("pdf")}
              className={`flex-1 rounded-xl border py-3 text-center text-sm font-semibold transition-all ${
                noteType === "pdf"
                  ? "border-blue-600 bg-blue-50 text-blue-800 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              PDF Note
            </button>
          </div>
        </div>

        {noteType === "text" ? (
          <div className="mt-5">
            <label className={labelClass}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required={noteType === "text"}
              rows={12}
              placeholder="Full note content (supports Markdown & LaTeX)..."
              className={inputClass}
            />
          </div>
        ) : (
          <div className="mt-5">
            <label className={labelClass}>Upload PDF File</label>
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center hover:bg-slate-50 transition-colors">
              <input
                type="file"
                accept="application/pdf"
                required={noteType === "pdf"}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setPdfFile(file);
                }}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  {pdfFile ? pdfFile.name : "Click or drag PDF file here to upload"}
                </p>
                <p className="text-xs text-slate-500">
                  {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF format only, up to 50MB"}
                </p>
              </div>
            </div>
          </div>
        )}

        <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600"
          />
          <span className="font-medium">Is Premium</span>
          <span className="text-slate-500">— only premium users can read this note</span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Save Note
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Existing Notes ({notes.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : notes.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-slate-500">No notes yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Premium</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map((note) => (
                  <tr key={note.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-105 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                        {note.subjects?.name ?? "—"}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4">
                      <div className="flex items-center gap-2">
                        {note.note_type === "pdf" && (
                          <FileText className="h-4 w-4 text-red-500 shrink-0" />
                        )}
                        <p className="line-clamp-2 font-medium text-slate-900">{note.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {note.note_type === "pdf" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-100">
                          PDF Note
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-100">
                          Text Note
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {note.is_premium ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <Crown className="h-3 w-3" />
                          Premium
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id, note.title)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
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
