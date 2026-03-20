export type Difficulty = "easy" | "moderate" | "hard";

export interface GeneratedQuestion {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
}

export interface AnswerKeyItem {
  number: number;
  sectionTitle: string;   // "Section A" — so frontend can group by section
  answer: string;
}

export interface GeneratedSection {
  title: string;
  subtitle: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  school?: string;
  subject: string;
  className: string;
  timeAllowed?: string;
  totalMarks: number;
  sections: GeneratedSection[];
  answerKey: AnswerKeyItem[];   // separate, clean, ready for frontend
}
