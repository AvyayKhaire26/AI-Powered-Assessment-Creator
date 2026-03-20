import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { IAIService } from "../interfaces/IAIService";
import { IAssignment } from "../models/assignment.model";
import { Difficulty, GeneratedPaper } from "../types";
import { env } from "../config/env";
import { logger } from "../utils/logger";

export class AIService implements IAIService {
    private readonly model: GenerativeModel;

    private static readonly MAX_RETRIES = 2;
    private static readonly RETRY_DELAY_MS = 1000;
    private static readonly MAX_INSTRUCTIONS_LENGTH = 500;

    constructor() {
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }

    async generatePaper(assignment: IAssignment): Promise<GeneratedPaper> {
        logger.info("Inside AIService generatePaper()");
        try {
            const prompt = this.buildPrompt(assignment);
            logger.info(`Prompt length: ${prompt.length} characters`);

            const raw = await this.generateWithRetry(prompt);
            const parsed = this.parseResponse(raw, assignment);

            logger.info("End of AIService generatePaper()");
            return parsed;
        } catch (error) {
            logger.error(`Error inside AIService generatePaper(): ${error}`);
            throw error;
        }
    }

    private async generateWithRetry(prompt: string): Promise<string> {
        for (let attempt = 0; attempt <= AIService.MAX_RETRIES; attempt++) {
            try {
                const result = await this.model.generateContent(prompt);
                const text = result.response.text();
                if (!text) throw new Error("Empty response from Gemini");
                return text;
            } catch (error) {
                if (attempt === AIService.MAX_RETRIES) throw error;
                const delay = AIService.RETRY_DELAY_MS * (attempt + 1); // 1s, 2s
                logger.warn(`Gemini attempt ${attempt + 1} failed, retrying in ${delay}ms: ${error}`);
                await new Promise((res) => setTimeout(res, delay));
            }
        }
        throw new Error("Gemini failed after all retries");
    }

    private buildPrompt(assignment: IAssignment): string {
        const questionBreakdown = assignment.questionTypes
            .map((q) => `- ${q.count} ${q.type} questions, ${q.marks} marks each`)
            .join("\n");

        const totalMarks = assignment.questionTypes.reduce(
            (sum, q) => sum + q.count * q.marks,
            0
        );

        // safety limit — prevent prompt injection via instructions field
        const safeInstructions = assignment.instructions
            ? assignment.instructions.slice(0, AIService.MAX_INSTRUCTIONS_LENGTH)
            : null;

        return `
You are an expert teacher who creates structured exam question papers.
Return ONLY valid JSON. No markdown, no explanation, no code blocks.

Create a question paper with the following details:
Title: ${assignment.title}
Subject: ${assignment.subject}
Class: ${assignment.className}
${assignment.school ? `School: ${assignment.school}` : ""}
Total Marks: ${totalMarks}

Question Breakdown:
${questionBreakdown}

${safeInstructions ? `Additional Instructions: ${safeInstructions}` : ""}

Return a JSON object in EXACTLY this structure:
{
  "school": "${assignment.school || ""}",
  "subject": "${assignment.subject}",
  "className": "${assignment.className}",
  "timeAllowed": "estimated time e.g. 45 minutes",
  "totalMarks": ${totalMarks},
  "sections": [
    {
      "title": "Section A",
      "subtitle": "Short Answer Questions",
      "instruction": "Attempt all questions. Each question carries X marks",
      "questions": [
        {
          "number": 1,
          "text": "question text here",
          "difficulty": "easy",
          "marks": 2
        }
      ]
    }
  ],
  "answerKey": [
    {
      "number": 1,
      "sectionTitle": "Section A",
      "answer": "answer text here"
    }
  ]
}

Rules:
- Group questions by type into separate sections (Section A, B, C...)
- Mix difficulty: ~40% easy, ~40% moderate, ~20% hard
- difficulty must be exactly one of: easy, moderate, hard
- answerKey must have one entry per question across ALL sections
- answerKey entries must reference the correct sectionTitle
- Return ONLY the JSON object, nothing else
    `.trim();
    }

    private parseResponse(raw: string, assignment: IAssignment): GeneratedPaper {
        logger.info("Inside AIService parseResponse()");
        try {
            // Gemini sometimes wraps in markdown code blocks despite instructions — strip it
            const cleaned = raw
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();

            const parsed = JSON.parse(cleaned) as GeneratedPaper;

            if (!parsed.sections || !Array.isArray(parsed.sections)) {
                throw new Error("Invalid AI response: missing sections array");
            }

            // sanitize sections + questions
            parsed.sections = parsed.sections.map((section, sIdx) => {
                if (!section.title) section.title = `Section ${String.fromCharCode(65 + sIdx)}`;
                if (!section.subtitle) section.subtitle = "";
                if (!section.instruction) section.instruction = "Attempt all questions";

                section.questions = (section.questions || []).map((q, qIdx) => ({
                    number: q.number ?? qIdx + 1,
                    text: q.text ?? "",
                    difficulty: (["easy", "moderate", "hard"].includes(q.difficulty)
                        ? q.difficulty
                        : "easy") as Difficulty,
                    marks: typeof q.marks === "number" && q.marks > 0 ? q.marks : 1,
                }));

                return section;
            });

            // sanitize answerKey
            if (
                !parsed.answerKey ||
                !Array.isArray(parsed.answerKey) ||
                parsed.answerKey.length === 0
            ) {
                logger.warn("Gemini did not return answerKey — defaulting to empty");
                parsed.answerKey = [];
            } else {
                parsed.answerKey = parsed.answerKey.map((item) => ({
                    number: item.number ?? 0,
                    sectionTitle: item.sectionTitle ?? "",
                    answer: item.answer ?? "",
                }));
            }

            parsed.subject = parsed.subject || assignment.subject;
            parsed.className = parsed.className || assignment.className;
            parsed.school = parsed.school || assignment.school;
            parsed.totalMarks =
                parsed.totalMarks ||
                assignment.questionTypes.reduce((sum, q) => sum + q.count * q.marks, 0);

            logger.info("End of AIService parseResponse()");
            return parsed;
        } catch (error) {
            logger.error(`Error inside AIService parseResponse(): ${error}`);
            throw new Error(`Failed to parse AI response: ${error}`);
        }
    }
}
