"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, FileText, FolderTree, Loader2, Newspaper } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const quickActions = [
  {
    title: "Manage Questions",
    description: "Add, edit, and delete GATE MT questions",
    href: "/admin/questions",
    icon: BookOpen,
    color: "bg-blue-600",
  },
  {
    title: "Manage Subjects",
    description: "Add subjects and topics for organization",
    href: "/admin/subjects",
    icon: FolderTree,
    color: "bg-indigo-600",
  },
  {
    title: "Manage Notes",
    description: "Create and edit study notes",
    href: "/admin/notes",
    icon: FileText,
    color: "bg-violet-600",
  },
  {
    title: "Manage Blog",
    description: "Publish blog posts and articles",
    href: "/admin/blog",
    icon: Newspaper,
    color: "bg-slate-700",
  },
];

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState({
    questions: 0,
    subjects: 0,
    notes: 0,
    blogPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient();

      const [questions, subjects, notes, blogPosts] = await Promise.all([
        supabase.from("questions").select("id", { count: "exact", head: true }),
        supabase.from("subjects").select("id", { count: "exact", head: true }),
        supabase.from("notes").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      ]);

      setCounts({
        questions: questions.count ?? 0,
        subjects: subjects.count ?? 0,
        notes: notes.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
      });
      setLoading(false);
    }

    fetchCounts();
  }, []);

  const statCards = [
    { label: "Total Questions", value: counts.questions, color: "text-blue-600" },
    { label: "Subjects", value: counts.subjects, color: "text-indigo-600" },
    { label: "Notes", value: counts.notes, color: "text-violet-600" },
    { label: "Blog Posts", value: counts.blogPosts, color: "text-slate-700" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Overview of your GATE MT Pro content and quick access to admin tools.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className={`mt-2 text-3xl font-extrabold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${action.color}`}
                >
                  <action.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 group-hover:text-blue-600">
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
