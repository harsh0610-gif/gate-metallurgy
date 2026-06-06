import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

interface AppPageHeaderProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  backHref?: string;
  backLabel?: string;
}

export default function AppPageHeader({
  title,
  description,
  icon: Icon,
  backHref = "/dashboard",
  backLabel = "Dashboard",
}: AppPageHeaderProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
            {description && (
              <p className="mt-0.5 text-sm text-slate-600">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
