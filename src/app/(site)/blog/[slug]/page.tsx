import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";

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
  content: string;
  excerpt: string | null;
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

// Simple markdown renderer — handles headings, bold, italic, code, links, lists
function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^#### (.+)$/gm, '<h4 class="text-base font-bold text-slate-900 mt-5 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-black text-slate-900 mt-8 mb-4">$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-blue-700">$1</code>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 bg-blue-50/60 pl-4 pr-3 py-2 my-4 text-slate-700 italic rounded-r-lg">$1</blockquote>')
    // Unordered lists (lines starting with - or *)
    .replace(/^[-*] (.+)$/gm, '<li class="ml-5 list-disc text-slate-700 mb-1">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-slate-700 mb-1">$1</li>')
    // Wrap consecutive <li> items in <ul>/<ol>
    .replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, (match) => `<ul class="my-3 space-y-1">${match}</ul>`)
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-700 underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-8 border-slate-200" />')
    // Paragraphs — double newlines
    .replace(/\n\n/g, '</p><p class="text-slate-700 leading-relaxed mb-4">')
    // Wrap in opening paragraph
    .replace(/^/, '<p class="text-slate-700 leading-relaxed mb-4">')
    .replace(/$/, '</p>')
    // Clean empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, '');
}

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = getStaticClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = getStaticClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, content, excerpt, published_at, created_at, author_id")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    notFound();
  }

  const post = data as BlogPost;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white/60">
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-6 text-sm text-slate-500">
          <Link href="/blog" className="flex items-center gap-1.5 font-medium hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>
          <span className="text-slate-300">/</span>
          <span className="truncate text-slate-400">{post.title}</span>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {readingTime(post.content)}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-slate-400" />
              GATE MT Pro Team
            </span>
          </div>

          {/* Excerpt / summary */}
          {post.excerpt && (
            <p className="mt-6 text-lg text-slate-600 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
              {post.excerpt}
            </p>
          )}

          <div className="mt-6 h-px bg-gradient-to-r from-blue-500 via-indigo-500 to-transparent" />
        </header>

        {/* Content */}
        <div
          className="prose-content text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        {/* Footer */}
        <footer className="mt-14 border-t border-slate-100 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-700">Published by GATE MT Pro Team</p>
              <p className="mt-1 text-xs text-slate-400">
                {formatDate(post.published_at ?? post.created_at)}
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
