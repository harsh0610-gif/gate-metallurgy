"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  Newspaper,
  Plus,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id, title, slug, excerpt, content, is_published, published_at, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setPosts((data ?? []) as BlogPost[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-generate slug from title
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setSlug(slugify(value));
  }

  function clearForm() {
    setTitle("");
    setSlug("");
    setSlugManual(false);
    setExcerpt("");
    setContent("");
    setIsPublished(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Title, slug, and content are required." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      content: content.trim(),
      is_published: isPublished,
      author_id: user?.id ?? null,
      published_at: isPublished ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from("blog_posts").insert(payload);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Blog post created successfully!" });
      clearForm();
      fetchPosts();
    }
    setSubmitting(false);
  }

  async function handleTogglePublish(post: BlogPost) {
    const supabase = createClient();
    const newPublished = !post.is_published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        is_published: newPublished,
        published_at: newPublished ? new Date().toISOString() : null,
      })
      .eq("id", post.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                is_published: newPublished,
                published_at: newPublished ? new Date().toISOString() : null,
              }
            : p
        )
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-white shadow-md">
          <Newspaper className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Manager</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Create, publish, and delete blog posts
          </p>
        </div>
      </div>

      {/* Message banner */}
      {message && (
        <div
          className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" && <Check className="h-4 w-4 mt-0.5 shrink-0" />}
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto shrink-0 text-current opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
        {/* ── Create Form ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-5 text-base font-bold text-slate-900">
            New Blog Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How to Master Thermodynamics for GATE MT"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-0 transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Slug *</span>
                {slugManual && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlugManual(false);
                      setSlug(slugify(title));
                    }}
                    className="text-[10px] font-semibold text-blue-500 normal-case tracking-normal hover:text-blue-700"
                  >
                    Auto-generate
                  </button>
                )}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition">
                <span className="shrink-0 text-xs text-slate-400">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="auto-generated"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none"
                  required
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Excerpt{" "}
                <span className="font-normal normal-case tracking-normal text-slate-400">
                  (optional — shown on listing page)
                </span>
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short description of this post…"
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Content *{" "}
                <span className="font-normal normal-case tracking-normal text-slate-400">
                  (Markdown supported)
                </span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`## Introduction\n\nWrite your post here. Markdown is supported!\n\n**Bold**, *italic*, \`code\`, > blockquotes, lists, etc.`}
                rows={14}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none resize-y transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Publish immediately
                </p>
                <p className="text-xs text-slate-500">
                  Visible to all visitors on the blog page
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  isPublished ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${
                    isPublished ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {submitting ? "Creating…" : "Create Post"}
            </button>
          </form>
        </div>

        {/* ── Existing Posts ── */}
        <div>
          <h2 className="mb-4 text-base font-bold text-slate-900">
            All Posts{" "}
            <span className="ml-1 text-sm font-semibold text-slate-400">
              ({posts.length})
            </span>
          </h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
              <Newspaper className="h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-semibold text-slate-500">
                No posts yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Create your first blog post using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                >
                  {/* Published indicator */}
                  <div
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      post.is_published
                        ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                        : "bg-slate-300"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {post.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      <span className="font-mono text-slate-500">
                        /blog/{post.slug}
                      </span>
                      {" · "}
                      {formatDate(post.created_at)}
                    </p>
                    {post.excerpt && (
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          post.is_published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {post.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    {/* Toggle publish */}
                    <button
                      onClick={() => handleTogglePublish(post)}
                      title={post.is_published ? "Unpublish" : "Publish"}
                      className={`rounded-lg p-2 text-xs font-semibold transition-colors ${
                        post.is_published
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {post.is_published ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      title="Delete post"
                      className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === post.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
