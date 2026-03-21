export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";
export type Difficulty = "easy" | "moderate" | "hard";

export interface QuestionTypeInput {
  type: string;
  count: number;
  marks: number;
}

export interface CreateAssignmentDTO {
  title: string;
  subject: string;
  className: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  instructions?: string;
  fileUrl?: string;
}

export interface GeneratedQuestion {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
}

export interface AnswerKeyItem {
  number: number;
  sectionTitle: string;
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
  answerKey: AnswerKeyItem[];
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  className: string;
  school?: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  instructions?: string;
  fileUrl?: string;
  status: AssignmentStatus;
  jobId?: string;
  result?: GeneratedPaper;
  createdAt: string;
  updatedAt: string;
}
