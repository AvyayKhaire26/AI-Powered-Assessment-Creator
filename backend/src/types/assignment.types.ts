import { GeneratedPaper } from "./paper.types";

export type AssignmentStatus = "pending" | "processing" | "completed" | "failed";

export interface QuestionTypeInput {
  type: string;
  count: number;
  marks: number;
}

export interface CreateAssignmentDTO {
  title: string;        
  subject: string;
  className: string;
  school?: string;
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  instructions?: string;
  fileUrl?: string;
}


export interface UpdateAssignmentDTO {
  status?: AssignmentStatus;
  jobId?: string;
  result?: GeneratedPaper;
}
