"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Crown,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import LoginGate from "@/components/shared/login-gate";

interface Subject {
  id: string;
  name: string;
  slug: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  is_premium: boolean;
  note_type?: string | null;
  pdf_url?: string | null;
}

export default function SubjectNotesPage() {
  const params = useParams();
  const subjectSlug = params.subjectSlug as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();

      const { data: subjectData } = await supabase
        .from("subjects")
        .select("id, name, slug")
        .eq("slug", subjectSlug)
        .maybeSingle();

      if (!subjectData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setSubject(subjectData);

      const { data: notesData } = await supabase
        .from("notes")
        .select("id, title, content, is_premium, note_type, pdf_url")
        .eq("subject_id", subjectData.id)
        .order("title");

      setNotes(notesData ?? []);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_premium")
          .eq("id", user.id)
          .maybeSingle();
        setIsPremium(profile?.is_premium ?? false);
      }

      setLoading(false);
    }

    if (subjectSlug) {
      fetchData();
    }
  }, [subjectSlug]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound || !subject) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">Subject not found</h2>
          <Link
            href="/notes"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <Link
        href="/notes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notes
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{subject.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {notes.length === 1 ? "1 note" : `${notes.length} notes`} available
          </p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No notes for this subject yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Check back soon — notes for {subject.name} are being prepared.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-4">
          {notes.map((note) => {
            const isLocked = note.is_premium && !isPremium;
            const isExpanded = expandedId === note.id;
            const isPdf = note.note_type === "pdf" || !!note.pdf_url;

            return (
              <div
                key={note.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-355 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId((prev) => (prev === note.id ? null : note.id))
                  }
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2">
                        {isPdf ? (
                          <FileText className="h-5 w-5 text-red-500 shrink-0" />
                        ) : (
                          <BookOpen className="h-5 w-5 text-blue-500 shrink-0" />
                        )}
                        <h3 className="font-bold text-slate-905 tracking-tight text-base">{note.title}</h3>
                      </div>
                      {note.is_premium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-extrabold text-amber-700 uppercase tracking-wide">
                          <Crown className="h-3 w-3 text-amber-500 fill-amber-500" />
                          Pro
                        </span>
                      )}
                    </div>
                    {!isExpanded && !isLocked && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-550 leading-relaxed font-medium">
                        {isPdf
                          ? "PDF study note document. Click to view and download."
                          : note.content.replace(/\s+/g, " ").trim().slice(0, 120) + (note.content.length > 120 ? "..." : "")}
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 px-5 pb-6 pt-3 sm:px-6 animate-page-entry">
                    {!isLoggedIn ? (
                      <div className="py-4">
                        <LoginGate
                          heading="Login to Read Study Notes"
                          subtext="To access formulas, derivations, and complete GATE study material, log in to your account."
                        />
                      </div>
                    ) : isLocked ? (
                      <div className="relative min-h-[220px]">
                        <div className="max-h-40 overflow-hidden blur-sm select-none">
                          <div className="text-sm leading-relaxed text-slate-400 markdown-content">
                            <p>Premium study note content is locked. Upgrade to Pro to view.</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-xl p-5 text-center border border-amber-200/30">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-250/20 shadow-inner mb-3 animate-pulse-soft">
                            <Lock className="h-4.5 w-4.5" />
                          </div>
                          <p className="text-sm font-bold text-slate-950">Premium Metallurgy Study Material</p>
                          <p className="text-xs text-slate-500 font-medium max-w-xs mt-1">Upgrade to a Pro account to unlock full formulas, equations, and notes.</p>
                          <Link
                            href="/pricing"
                            className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 transition-all duration-205"
                          >
                            Upgrade to Premium
                          </Link>
                        </div>
                      </div>
                    ) : isPdf ? (
                      <div className="space-y-4">
                        {/* Inline PDF Viewer */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-50">
                          <iframe
                            src={`${note.pdf_url}#toolbar=0`}
                            className="w-full h-[550px] border-none"
                            title={note.title}
                          />
                        </div>
                        {/* Access Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={note.pdf_url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5.5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/15 transition-all hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
                          >
                            View PDF (New Tab)
                          </a>
                          <a
                            href={note.pdf_url ?? "#"}
                            download
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5.5 py-2.5 text-xs font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5 hover:shadow-sm"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-800 leading-relaxed text-sm sm:text-base font-medium markdown-content prose prose-slate max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {note.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
