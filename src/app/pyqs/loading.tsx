import { Loader2 } from "lucide-react";

export default function PyqsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-44 rounded-lg bg-slate-200" />
          <div className="h-4 w-60 rounded bg-slate-200" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="h-10 w-full sm:w-1/4 rounded-xl bg-slate-100" />
        <div className="h-10 w-full sm:w-1/4 rounded-xl bg-slate-100" />
        <div className="h-10 w-full sm:w-1/4 rounded-xl bg-slate-100" />
        <div className="h-10 w-full sm:w-1/4 rounded-xl bg-slate-100" />
      </div>

      {/* Questions List Skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4"
          >
            {/* Tags row */}
            <div className="flex gap-2">
              <div className="h-5 w-24 rounded-full bg-slate-100" />
              <div className="h-5 w-14 rounded-full bg-slate-100" />
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>

            {/* Question Text */}
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-150" />
            </div>

            {/* Bottom divider & expand chevron */}
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-slate-100" />
              <div className="h-5 w-5 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
