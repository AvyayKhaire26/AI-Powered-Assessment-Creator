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
          ? `<div class="options">${optionLines.map((o) => `<p class="option">${o}</p>`).join("")}</div>`
          : "";

        return `
          <div class="question-block">
            <p class="question-text">[${diff}] ${questionLine} [${q.marks} ${q.marks === 1 ? "Mark" : "Marks"}]</p>
            ${optionsHtml}
          </div>
        `;
      }).join("");

      return `
        <div class="section">
          <h2 class="section-title">${section.title}</h2>
          ${section.subtitle ? `<p class="section-subtitle">${section.subtitle}</p>` : ""}
          ${section.instruction ? `<p class="section-instruction">${section.instruction}</p>` : ""}
          ${questionsHtml}
        </div>
      `;
    }).join("");

    const answerKeyHtml = paper.answerKey?.length
      ? `
        <div class="answer-key">
          <h2 class="answer-key-title">Answer Key</h2>
          ${paper.answerKey.map((item) => `
            <div class="answer-row">
              <b>${item.number}.</b>
              <span>${item.answer}</span>
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
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 13px;
            color: #111;
            line-height: 1.6;
          }
          .paper {
            max-width: 760px;
            margin: 0 auto;
            padding: 24px;
          }
          .school-name {
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .meta {
            text-align: center;
            font-size: 13px;
            margin-bottom: 2px;
          }
          .time-marks-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 13px;
            font-weight: 600;
          }
          .divider {
            border: none;
            border-top: 1.5px solid #111;
            margin: 10px 0;
          }
          .student-info {
            display: flex;
            gap: 32px;
            margin-bottom: 16px;
          }
          .info-line {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
          }
          .info-line-bar {
            flex: 1;
            border-bottom: 1px solid #111;
            height: 16px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section-title {
            font-size: 15px;
            font-weight: 700;
            text-decoration: underline;
            margin-bottom: 4px;
          }
          .section-subtitle {
            font-size: 13px;
            font-style: italic;
            margin-bottom: 2px;
          }
          .section-instruction {
            font-size: 12px;
            color: #444;
            margin-bottom: 8px;
          }
          .question-block {
            margin-bottom: 10px;
          }
          .question-text {
            font-size: 13px;
          }
          .options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px 16px;
            margin-top: 4px;
            padding-left: 16px;
          }
          .option {
            font-size: 13px;
          }
          .end-line {
            text-align: center;
            font-weight: 600;
            margin: 20px 0;
            font-size: 13px;
          }
          .answer-key {
            border-top: 2px dashed #ccc;
            padding-top: 16px;
            margin-top: 24px;
          }
          .answer-key-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          .answer-row {
            display: flex;
            gap: 8px;
            font-size: 12px;
            margin-bottom: 6px;
          }
        </style>
      </head>
      <body>
        <div class="paper">
          <p class="school-name">${paper.school ?? ""}</p>
          <p class="meta">Subject: ${paper.subject} &nbsp;|&nbsp; Class: ${paper.className}</p>
          ${paper.timeAllowed
            ? `<div class="time-marks-row">
                <span>Time Allowed: ${paper.timeAllowed}</span>
                <span>Maximum Marks: ${paper.totalMarks}</span>
               </div>`
            : `<p class="meta" style="text-align:right">Maximum Marks: ${paper.totalMarks}</p>`
          }
          <hr class="divider" />
          <div class="student-info">
            <div class="info-line"><span>Name:</span><div class="info-line-bar"></div></div>
            <div class="info-line"><span>Roll No:</span><div class="info-line-bar"></div></div>
            <div class="info-line"><span>Class:</span><div class="info-line-bar"></div></div>
          </div>
          <hr class="divider" />
          ${sectionsHtml}
          <p class="end-line">— End of Question Paper —</p>
          ${answerKeyHtml}
        </div>
      </body>
      </html>
    `;
  }
}
