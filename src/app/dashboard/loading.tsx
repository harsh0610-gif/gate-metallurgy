import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-64 rounded-md bg-slate-200" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-slate-200" />
      </div>

      {/* Stats Cards Grid Skeleton */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-lg bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-24 rounded-lg bg-slate-200" />
              <div className="h-3 w-32 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Chart Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-4">
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="h-[280px] w-full rounded-xl bg-slate-100 flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
          </div>
        </div>

        {/* Right 1 Col: Info Card */}
        <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-5">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-150" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
