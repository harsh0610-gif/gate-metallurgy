"use client";

import { Filter, X } from "lucide-react";
import type { Difficulty, PyqFilters, QuestionType, Subject } from "@/lib/pyqs/types";
import { DIFFICULTIES, QUESTION_TYPES, YEARS } from "@/lib/pyqs/types";

interface FilterSidebarProps {
  subjects: Subject[];
  filters: PyqFilters;
  onChange: (filters: PyqFilters) => void;
  onClear: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-slate-200 pb-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{label}</span>
    </label>
  );
}

export default function FilterSidebar({
  subjects,
  filters,
  onChange,
  onClear,
  mobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  function toggleSubject(id: string, checked: boolean) {
    onChange({
      ...filters,
      subjects: checked
        ? [...filters.subjects, id]
        : filters.subjects.filter((s) => s !== id),
    });
  }

  function toggleYear(year: number, checked: boolean) {
    onChange({
      ...filters,
      years: checked
        ? [...filters.years, year]
        : filters.years.filter((y) => y !== year),
    });
  }

  function toggleDifficulty(difficulty: Difficulty, checked: boolean) {
    onChange({
      ...filters,
      difficulties: checked
        ? [...filters.difficulties, difficulty]
        : filters.difficulties.filter((d) => d !== difficulty),
    });
  }

  function toggleQuestionType(type: QuestionType, checked: boolean) {
    onChange({
      ...filters,
      questionTypes: checked
        ? [...filters.questionTypes, type]
        : filters.questionTypes.filter((t) => t !== type),
    });
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 lg:p-5">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h2 className="font-semibold text-slate-900">Filters</h2>
        </div>
        <button
          onClick={onMobileClose}
          className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close filters"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 lg:p-5">
        {subjects.length > 0 && (
          <FilterSection title="Subject">
            {subjects.map((subject) => (
              <CheckboxItem
                key={subject.id}
                label={subject.name}
                checked={filters.subjects.includes(subject.id)}
                onChange={(checked) => toggleSubject(subject.id, checked)}
              />
            ))}
          </FilterSection>
        )}

        <FilterSection title="Year">
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {YEARS.map((year) => (
              <CheckboxItem
                key={year}
                label={String(year)}
                checked={filters.years.includes(year)}
                onChange={(checked) => toggleYear(year, checked)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Difficulty">
          {DIFFICULTIES.map((difficulty) => (
            <CheckboxItem
              key={difficulty}
              label={difficulty}
              checked={filters.difficulties.includes(difficulty)}
              onChange={(checked) => toggleDifficulty(difficulty, checked)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Question Type">
          {QUESTION_TYPES.map((type) => (
            <CheckboxItem
              key={type}
              label={type}
              checked={filters.questionTypes.includes(type)}
              onChange={(checked) => toggleQuestionType(type, checked)}
            />
          ))}
        </FilterSection>
      </div>

      <div className="border-t border-slate-200 p-4 lg:p-5">
        <button
          onClick={onClear}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
