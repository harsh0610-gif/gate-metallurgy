import Link from "next/link";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ArrowRight, BookOpen, Calendar, Clock, Newspaper } from "lucide-react";

function getStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
  created_at: string;
  author_id: string | null;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function readingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function getExcerpt(post: BlogPost) {
  if (post.excerpt) return post.excerpt;
  // Auto-generate from content — strip markdown and take first 160 chars
  const plain = post.content
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > 160 ? plain.slice(0, 160) + "…" : plain;
}

export const revalidate = 60; // ISR: refresh every 60s

export default async function BlogPage() {
  const supabase = getStaticClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, published_at, created_at, author_id")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogPosts = (posts ?? []) as BlogPost[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="border-b border-slate-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              GATE MT Blog
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Insights &amp; Strategies for<br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              GATE MT Aspirants
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-500 leading-relaxed">
            Expert tips, subject deep-dives, exam strategy guides, and preparation
            insights written by GATE toppers and subject matter experts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {blogPosts.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-24 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No posts yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              We&apos;re working on some great content. Check back soon for exam
              tips, strategies, and subject guides!
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          /* ── Post Grid ── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                {/* Coloured top band — cycles through accent colours */}
                <div
                  className={`h-1.5 w-full ${
                    [
                      "bg-gradient-to-r from-blue-500 to-indigo-500",
                      "bg-gradient-to-r from-violet-500 to-purple-500",
                      "bg-gradient-to-r from-emerald-500 to-teal-500",
                      "bg-gradient-to-r from-amber-500 to-orange-500",
                    ][index % 4]
                  }`}
                />

                <div className="flex flex-1 flex-col p-6">
                  {/* Date + Read time */}
                  <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.published_at ?? post.created_at)}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime(post.content)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 text-base font-bold leading-snug tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="mt-2 flex-1 text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {getExcerpt(post)}
                  </p>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600">
                    Read article
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
