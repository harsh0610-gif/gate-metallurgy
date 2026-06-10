"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SubjectWithCount {
  id: string;
  name: string;
  slug: string;
  noteCount: number;
}

export default function NotesPage() {
  const [subjects, setSubjects] = useState<SubjectWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      const supabase = createClient();

      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, slug, notes(id)")
        .order("name");

      setSubjects(
        (subjectsData ?? []).map((subject: any) => ({
          id: subject.id,
          name: subject.name,
          slug: subject.slug,
          noteCount: subject.notes?.length ?? 0,
        }))
      );
      setLoading(false);
    }

    fetchSubjects();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl">Study Notes</h1>
            <p className="mt-1 text-sm text-slate-500">
              Concise, exam-focused notes for every GATE MT subject
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No subjects yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Notes will appear here once subjects are added in admin.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/notes/${subject.slug}`}
              className="group relative overflow-hidden rounded-2xl ios-glass p-6 spring-transition card-hover border-l-[3px] border-l-blue-500"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm border border-blue-100/60 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug tracking-tight">
                {subject.name}
              </h2>
              <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {subject.noteCount === 1
                  ? "1 note available"
                  : `${subject.noteCount} notes available`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
