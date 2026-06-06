import { checkAnswer } from "@/lib/pyqs/utils";
import type { AttemptResult, MockTestQuestion, QuestionAnswerState } from "./types";

export function calculateAttemptResult(
  questions: MockTestQuestion[],
  answers: Record<string, QuestionAnswerState>,
  totalMarks: number,
  timeTakenSeconds: number
): AttemptResult {
  let marksObtained = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  const answerRows: AttemptResult["answerRows"] = [];

  questions.forEach((question) => {
    const state = answers[question.id];
    const selected = state?.selected?.trim() ?? "";

    if (!selected) {
      unattemptedCount += 1;
      answerRows.push({
        question_id: question.id,
        selected_answer: "",
        is_correct: false,
      });
      return;
    }

    const isCorrect = checkAnswer(question, selected);

    if (isCorrect) {
      correctCount += 1;
      marksObtained += question.marks ?? 1;
    } else {
      incorrectCount += 1;
      marksObtained -= question.negative_marks ?? 0;
    }

    answerRows.push({
      question_id: question.id,
      selected_answer: selected,
      is_correct: isCorrect,
    });
  });

  const attempted = correctCount + incorrectCount;
  const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;

  return {
    marksObtained: Math.max(0, Math.round(marksObtained * 100) / 100),
    totalMarks,
    correctCount,
    incorrectCount,
    unattemptedCount,
    accuracy,
    timeTakenSeconds,
    answerRows,
  };
}
