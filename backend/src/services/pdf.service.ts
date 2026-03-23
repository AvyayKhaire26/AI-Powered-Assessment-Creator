import puppeteer from "puppeteer";
import { GeneratedPaper } from "../types";
import { logger } from "../utils/logger";

export class PdfService {

  async generatePdf(paper: GeneratedPaper, title: string): Promise<Buffer> {
    logger.info("Inside PdfService generatePdf()");

    const html = this.buildHtml(paper, title);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
      });

      logger.info("End of PdfService generatePdf()");
      return Buffer.from(pdf);
    } finally {
      await browser.close();
    }
  }

  private buildHtml(paper: GeneratedPaper, title: string): string {
    const DIFFICULTY_LABEL: Record<string, string> = {
      easy: "Easy",
      moderate: "Moderate",
      hard: "Challenging",
    };

    const sectionsHtml = paper.sections.map((section) => {
      const questionsHtml = section.questions.map((q) => {
        const lines = q.text.split("\\n").filter(Boolean);
        const [questionLine, ...optionLines] = lines;
        const diff = DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty;

        const optionsHtml = optionLines.length
          ? `<div class="options-grid">${optionLines
              .map((o) => `<p class="option-text">${o}</p>`)
              .join("")}</div>`
          : "";

        return `
          <div class="question-block">
            <p class="question">
              ${q.number}. [${diff}] ${questionLine} [${q.marks} ${q.marks === 1 ? "Mark" : "Marks"}]
            </p>
            ${optionsHtml}
          </div>
        `;
      }).join("");

      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          <div class="section-header-block">
            ${section.subtitle ? `<p class="section-subtitle">${section.subtitle}</p>` : ""}
            ${section.instruction ? `<p class="section-instruction">${section.instruction}</p>` : ""}
          </div>
          ${questionsHtml}
        </div>
      `;
    }).join("");

    const answerKeyHtml = paper.answerKey?.length
      ? `
        <div class="answer-key">
          <h2 class="answer-key-title">Answer Key</h2>
          ${Object.entries(
            paper.answerKey.reduce((map, item) => {
              if (!map[item.sectionTitle]) map[item.sectionTitle] = [];
              map[item.sectionTitle].push(item);
              return map;
            }, {} as Record<string, typeof paper.answerKey>)
          ).map(([sectionTitle, items]) => `
            <div class="answer-key-group">
              <p class="answer-key-section">${sectionTitle}</p>
              ${items.map((item) => `
                <div class="answer-row">
                  <b>${item.number}.</b>
                  <span>${item.answer}</span>
                </div>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `
      : "";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            background: white;
            font-family: Inter, sans-serif;
            color: #1e1e1e;
            line-height: 1.6;
          }

          .paper-container {
            width: 100%;
            padding: 48px 60px;
            background: white;
          }

          /* ── HEADER ── */
          .school-name {
            font-family: Inter, sans-serif;
            font-weight: 700;
            font-size: 32px;
            text-align: center;
            margin: 0 0 8px 0;
            color: #1e1e1e;
          }

          .subject, .class-name {
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 24px;
            text-align: center;
            margin: 0;
            color: #1e1e1e;
          }

          .time-marks-row {
            display: flex;
            justify-content: space-between;
            margin: 32px 0 16px 0;
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 16px;
            color: #1e1e1e;
          }

          .instruction-line {
            font-family: Inter, sans-serif;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 24px;
            color: #1e1e1e;
          }

          /* ── STUDENT INFO ── */
          .student-info {
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 500px;
          }

          .info-line {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 18px;
            color: #1e1e1e;
          }

          .info-label {
            white-space: nowrap;
            padding-right: 8px;
          }

          .underline {
            flex-grow: 1;
            border-bottom: 1.5px solid #1e1e1e;
            height: 0;
            margin-bottom: 4px;
          }

          /* ── SECTIONS ── */
          .section {
            margin-bottom: 40px;
          }

          .section-title {
            text-align: center;
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 24px;
            margin-bottom: 20px;
            color: #1e1e1e;
          }

          .section-subtitle {
            font-family: Inter, sans-serif;
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 4px;
            color: #1e1e1e;
          }

          .section-instruction {
            font-family: Inter, sans-serif;
            font-size: 14px;
            font-weight: 400;
            color: #444;
            margin-bottom: 12px;
          }

          /* ── QUESTIONS ── */
          .question-block {
            margin-bottom: 20px;
          }

          .question {
            font-family: Inter, sans-serif;
            font-weight: 400;
            font-size: 16px;
            line-height: 1.6;
            color: #1e1e1e;
          }

          .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 40px;
            padding-left: 24px;
            margin-top: 4px;
          }

          .option-text {
            font-family: Inter, sans-serif;
            font-size: 15px;
            margin: 0;
            color: #1e1e1e;
          }

          /* ── END LINE ── */
          .end-line {
            text-align: center;
            font-family: Inter, sans-serif;
            font-weight: 600;
            margin-top: 40px;
            color: #666;
            font-size: 15px;
          }

          /* ── ANSWER KEY ── */
          .answer-key {
            margin-top: 40px;
            border-top: 2px dashed #ccc;
            padding-top: 24px;
          }

          .answer-key-title {
            font-family: Inter, sans-serif;
            font-weight: 700;
            font-size: 20px;
            margin-bottom: 16px;
            color: #1e1e1e;
          }

          .answer-key-group {
            margin-bottom: 16px;
          }

          .answer-key-section {
            font-family: Inter, sans-serif;
            font-weight: 600;
            font-size: 15px;
            margin-bottom: 10px;
            color: #1e1e1e;
          }

          .answer-row {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
            font-family: Inter, sans-serif;
            font-size: 14px;
            color: #1e1e1e;
          }
        </style>
      </head>
      <body>
        <div class="paper-container">

          <h1 class="school-name">${paper.school ?? ""}</h1>
          <p class="subject">Subject: ${paper.subject}</p>
          <p class="class-name">Class: ${paper.className}</p>

          <div class="time-marks-row">
            <span>${paper.timeAllowed ? `Time Allowed: ${paper.timeAllowed}` : ""}</span>
            <span>Maximum Marks: ${paper.totalMarks}</span>
          </div>

          <p class="instruction-line">All questions are compulsory unless stated otherwise.</p>

          <div class="student-info">
            <div class="info-line">
              <span class="info-label">Name:</span>
              <span class="underline"></span>
            </div>
            <div class="info-line">
              <span class="info-label">Roll Number:</span>
              <span class="underline"></span>
            </div>
            <div class="info-line">
              <span class="info-label">Class: ${paper.className} Section:</span>
              <span class="underline"></span>
            </div>
          </div>

          ${sectionsHtml}

          <p class="end-line">End of Question Paper</p>

          ${answerKeyHtml}

        </div>
      </body>
      </html>
    `;
  }
}
