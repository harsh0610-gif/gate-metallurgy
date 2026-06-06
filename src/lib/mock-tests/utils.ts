import type { PaletteStatus, QuestionAnswerState } from "./types";

export function formatDuration(minutes: number) {
  const hours = minutes / 60;
  if (hours === 3) return "3 hours";
  if (Number.isInteger(hours)) return `${hours} hours`;
  return `${hours.toFixed(1)} hours`;
}

export function formatTimer(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatTimeTaken(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rem = m % 60;
    return `${h}h ${rem}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

export function getPaletteStatus(state: QuestionAnswerState | undefined): PaletteStatus {
  if (!state?.visited) return "not-visited";
  if (state.markedForReview) return "marked";
  if (state.selected) return "answered";
  return "not-answered";
}

export function getPaletteButtonClass(status: PaletteStatus, isCurrent: boolean) {
  const base = "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors";
  const ring = isCurrent ? " ring-2 ring-blue-600 ring-offset-1" : "";

  switch (status) {
    case "not-visited":
      return `${base} bg-slate-200 text-slate-600${ring}`;
    case "not-answered":
      return `${base} bg-white border border-slate-300 text-slate-700${ring}`;
    case "answered":
      return `${base} bg-blue-600 text-white${ring}`;
    case "marked":
      return `${base} bg-orange-500 text-white${ring}`;
  }
}
