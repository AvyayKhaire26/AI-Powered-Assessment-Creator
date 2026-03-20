import mongoose, { Schema, Document } from "mongoose";
import { AssignmentStatus, GeneratedPaper, QuestionTypeInput } from "../types";

export interface IAssignment extends Document {
  title: string;
  subject: string;
  className: string;
  school?: string;
  dueDate: Date;
  questionTypes: QuestionTypeInput[];
  instructions?: string;
  fileUrl?: string;
  status: AssignmentStatus;
  jobId?: string;
  result?: GeneratedPaper;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema<QuestionTypeInput>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const GeneratedQuestionSchema = new Schema(
  {
    number: Number,
    text: String,
    difficulty: { type: String, enum: ["easy", "moderate", "hard"], default: "easy" },
    marks: Number,
  },
  { _id: false }
);

const AnswerKeyItemSchema = new Schema(
  {
    number: Number,
    sectionTitle: String,
    answer: String,
  },
  { _id: false }
);

const GeneratedSectionSchema = new Schema(
  {
    title: String,
    subtitle: String,
    instruction: String,
    questions: [GeneratedQuestionSchema],
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema(
  {
    school: String,
    subject: String,
    className: String,
    timeAllowed: String,
    totalMarks: Number,
    sections: [GeneratedSectionSchema],
    answerKey: [AnswerKeyItemSchema],   // add this
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    school: { type: String },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    instructions: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    jobId: { type: String },
    result: { type: GeneratedPaperSchema },
  },
  { timestamps: true }
);

export const AssignmentModel = mongoose.model<IAssignment>("Assignment", AssignmentSchema);
