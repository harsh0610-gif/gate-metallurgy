export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "MCQ" | "MSQ" | "NAT";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  subject_id: string;
  pyq_year: number;
  difficulty: Difficulty;
  q_type: QuestionType;
  question_text: string;
  options: QuestionOption[] | null;
  correct_options: string[] | null;
  correct_answer?: string | null;
  explanation: string | null;
  subjects: { name: string } | null;
  is_premium?: boolean;
}

export interface PyqFilters {
  subjects: string[];
  years: number[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
}

export const YEARS = Array.from({ length: 17 }, (_, i) => 2026 - i);
export const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
export const QUESTION_TYPES: QuestionType[] = ["MCQ", "MSQ", "NAT"];
export const PAGE_SIZE = 20;

export const EMPTY_FILTERS: PyqFilters = {
  subjects: [],
  years: [],
  difficulties: [],
  questionTypes: [],
};