import type { Question, QuestionOption } from "./types";

export function getQuestionOptions(question: Question): QuestionOption[] {
  if (question.options?.length) {
    return question.options.filter((o) => o.text?.trim());
  }
  return [];
}

export function getCorrectOptions(question: Question): string[] {
  if (question.correct_options?.length) {
    return question.correct_options.map((o) => o.trim().toUpperCase()).filter(Boolean);
  }

  if (question.correct_answer) {
    return question.correct_answer
      .split(",")
      .map((part) => part.trim().toUpperCase())
      .filter(Boolean);
  }

  return [];
}

export function formatCorrectAnswerDisplay(question: Question): string {
  const correct = getCorrectOptions(question);
  if (correct.length === 0) return "—";
  return correct.join(", ");
}

export function checkAnswer(question: Question, selected: string): boolean {
  if (!selected) return false;

  const correct = getCorrectOptions(question);

  if (question.q_type === "NAT") {
    const selectedNum = parseFloat(selected);
    if (Number.isNaN(selectedNum)) return false;

    const first = correct[0] ?? "";
    if (first.includes("-")) {
      const [minStr, maxStr] = first.split("-");
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);
      return !Number.isNaN(min) && !Number.isNaN(max) && selectedNum >= min && selectedNum <= max;
    }

    const correctNum = parseFloat(first);
    return !Number.isNaN(correctNum) && selectedNum === correctNum;
  }

  if (question.q_type === "MSQ") {
    const normalize = (value: string) =>
      value
        .split(",")
        .map((part) => part.trim().toUpperCase())
        .filter(Boolean)
        .sort()
        .join(",");

    return normalize(selected) === correct.sort().join(",");
  }

  return selected.toUpperCase() === (correct[0] ?? "");
}

export function formatSelectedAnswer(
  questionType: Question["q_type"],
  selected: string | string[]
): string {
  if (Array.isArray(selected)) {
    return selected.sort().join(",");
  }
  return selected;
}

export function getDifficultyStyles(difficulty: Question["difficulty"]) {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-700 border-green-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Hard":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}
