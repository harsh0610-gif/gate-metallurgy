import type { Question } from "@/lib/pyqs/types";

export interface MockTest {
  id: string;
  title: string;
  description: string;
  duration: number;
  total_marks: number;
  question_count: number;
  is_premium: boolean;
}

export interface MockTestQuestion extends Question {
  marks: number;
  negative_marks: number;
  sort_order?: number;
}

export interface QuestionAnswerState {
  selected: string;
  markedForReview: boolean;
  visited: boolean;
}

export type PaletteStatus = "not-visited" | "not-answered" | "answered" | "marked";

export interface AttemptResult {
  marksObtained: number;
  totalMarks: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  timeTakenSeconds: number;
  answerRows: {
    question_id: string;
    selected_answer: string;
    is_correct: boolean;
  }[];
}

export interface UserAttempt {
  id: string;
  user_id: string;
  mock_test_id: string;
  marks_obtained: number;
  total_marks: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  accuracy: number;
  time_taken_seconds: number;
  created_at: string;
}
