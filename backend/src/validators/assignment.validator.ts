import { z } from "zod";

const QuestionTypeSchema = z.object({
  type: z.string({ error: "Question type must be a string" }).min(1, "Question type cannot be empty"),
  count: z
    .number({ error: "Count must be a number" })
    .int("Count must be a whole number")
    .min(1, "Count must be at least 1"),
  marks: z
    .number({ error: "Marks must be a number" })
    .int("Marks must be a whole number")
    .min(1, "Marks must be at least 1"),
});

export const CreateAssignmentSchema = z.object({
  title: z
    .string({ error: "Title must be a string" })
    .min(1, "Title is required")
    .max(200, "Title too long"),
  subject: z
    .string({ error: "Subject must be a string" })
    .min(1, "Subject is required")
    .max(100, "Subject too long"),
  className: z
    .string({ error: "Class name must be a string" })
    .min(1, "Class is required")
    .max(50, "Class name too long"),
  dueDate: z
    .string({ error: "Due date must be a string" })
    .min(1, "Due date is required")
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .refine((val) => new Date(val) > new Date(), "Due date must be in the future"),
  questionTypes: z
    .array(QuestionTypeSchema, { error: "Question types must be an array" })
    .min(1, "At least one question type is required")
    .max(10, "Maximum 10 question types allowed"),
  instructions: z
    .string()
    .max(500, "Instructions cannot exceed 500 characters")
    .optional(),
});
