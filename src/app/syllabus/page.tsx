"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare, Loader2 } from "lucide-react";
import {
  GATE_MT_SYLLABUS,
  SYLLABUS_STORAGE_KEY,
  getTotalTopicCount,
  topicKey,
} from "@/lib/syllabus/data";

function loadCompletedTopics(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SYLLABUS_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveCompletedTopics(completed: Set<string>) {
  localStorage.setItem(SYLLABUS_STORAGE_KEY, JSON.stringify(Array.from(completed)));
}

export default function SyllabusPage() {
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCompletedTopics(loadCompletedTopics());
    setHydrated(true);
  }, []);

  const totalTopics = getTotalTopicCount();

  const completedCount = useMemo(() => {
    const validKeys = new Set(
      GATE_MT_SYLLABUS.flatMap((s) => s.topics.map((t) => topicKey(s.name, t)))
    );
    return Array.from(completedTopics).filter((key) => validKeys.has(key)).length;
  }, [completedTopics]);

  const overallPercent =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const getSubjectProgress = useCallback(
    (subjectName: string, topics: string[]) => {
      if (topics.length === 0) return 0;
      const done = topics.filter((t) => completedTopics.has(topicKey(subjectName, t))).length;
      return Math.round((done / topics.length) * 100);
    },
    [completedTopics]
  );

  function toggleTopic(subjectName: string, topicName: string, checked: boolean) {
    const key = topicKey(subjectName, topicName);
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(key);
      } else {
        next.delete(key);
      }
      saveCompletedTopics(next);
      return next;
    });
  }

  if (!hydrated) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-page-entry">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
            <CheckSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-heading sm:text-3xl">Syllabus Tracker</h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete GATE MT syllabus — track your progress topic by topic
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-650 p-6 shadow-md shadow-blue-500/15 text-white">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
            Overall Progress
          </p>
          <p className="mt-1 text-5xl font-black tracking-tight">{overallPercent}%</p>
          <p className="mt-2 text-xs font-semibold text-blue-100/90">
            {completedCount} of {totalTopics} topics completed
          </p>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/15 border border-white/5">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {GATE_MT_SYLLABUS.map((subject) => {
            const progress = getSubjectProgress(subject.name, subject.topics);

            return (
              <div
                key={subject.name}
                className="rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:border-slate-300/60 hover:shadow-md overflow-hidden"
              >
                <div className="border-b border-slate-100 px-5 py-[1.125rem] sm:px-6 bg-slate-50/20">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-bold text-slate-900 tracking-tight">{subject.name}</h2>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/50">{progress}% Done</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <ul className="divide-y divide-slate-50 px-5 py-2 sm:px-6">
                  {subject.topics.map((topic) => {
                    const key = topicKey(subject.name, topic);
                    const isChecked = completedTopics.has(key);

                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-center gap-3 py-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              toggleTopic(subject.name, topic, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className={`text-sm ${
                              isChecked
                                ? "font-medium text-slate-900 line-through decoration-slate-400"
                                : "text-slate-700"
                            }`}
                          >
                            {topic}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
