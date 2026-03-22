"use client";
import { Assignment, GeneratedSection, GeneratedQuestion, AnswerKeyItem } from "@/types";
import styles from "@/styles/output.module.css";

interface Props {
  assignment: Assignment;
  pdfUrl: string | null;
  pdfLoading: boolean;
  onRegenerate: () => void;
  onDownloadPdf: () => void;
  isRegenerating: boolean;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Challenging",
};

function splitLines(text: string): string[] {
  return text
    .replace(/\\\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .split("\n")
    .filter(Boolean);
}

export default function OutputPage({
  assignment,
  pdfUrl,
  pdfLoading,
  onRegenerate,
  onDownloadPdf,
  isRegenerating,
}: Props) {
  const paper = assignment.result!;

  const answerKeyBySections: { title: string; items: AnswerKeyItem[] }[] = [];
  if (paper.answerKey?.length) {
    const map = new Map<string, AnswerKeyItem[]>();
    for (const item of paper.answerKey) {
      if (!map.has(item.sectionTitle)) map.set(item.sectionTitle, []);
      map.get(item.sectionTitle)!.push(item);
    }
    map.forEach((items, title) => answerKeyBySections.push({ title, items }));
  }

  // Exact Logo: File outline with Solid Star at bottom-left
  const FileWithStarIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* File Path */}
      <path d="M13 2H6C4.89543 2 4 2.89543 4 4V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V9L13 2Z" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 2V9H20" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Solid Star at Bottom Left */}
      <path d="M7.5 13.5L8.31 15.14L10.12 15.41L8.81 16.68L9.12 18.49L7.5 17.64L5.88 18.49L6.19 16.68L4.88 15.41L6.69 15.14L7.5 13.5Z" fill="#303030" />
    </svg>
  );

  return (
    <div className={styles.pageBg}>
      <div className={styles.paperWrapper}>
        <div className={styles.topBanner}>
          <p className={styles.bannerText}>
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            {pdfUrl ? (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className={styles.downloadBtn}>
                {FileWithStarIcon}
                Download PDF
              </a>
            ) : (
              <button
                className={styles.downloadBtn}
                onClick={onDownloadPdf}
                disabled={pdfLoading}
              >
                {FileWithStarIcon}
                {pdfLoading ? "Preparing..." : "Download as PDF"}
              </button>
            )}
            <button
              className={styles.regenerateBtn}
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {isRegenerating ? "Regenerating..." : "↺ Regenerate"}
            </button>
          </div>
        </div>

        <div className={styles.paperContainer}>
          <h1 className={styles.schoolName}>{paper.school}</h1>
          <p className={styles.subject}>Subject: {paper.subject}</p>
          <p className={styles.className}>Class: {paper.className}</p>

          <div className={styles.timeMarksRow}>
            <span>{paper.timeAllowed ? `Time Allowed: ${paper.timeAllowed}` : ""}</span>
            <span>Maximum Marks: {paper.totalMarks}</span>
          </div>

          <p className={styles.instructionLine}>All questions are compulsory unless stated otherwise.</p>

          {/* Corrected Student Info with Unified Fixed Lengths */}
          <div className={styles.studentInfo}>
            <div className={styles.infoLine}>Name: <span className={styles.underlineFixed}></span></div>
            <div className={styles.infoLine}>Roll Number: <span className={styles.underlineFixed}></span></div>
            <div className={styles.infoLine}>Class: {paper.className} Section: <span className={styles.underlineFixed}></span></div>
          </div>

          {paper.sections.map((section, i) => (
            <SectionBlock key={i} section={section} />
          ))}

          <p className={styles.endLine}>End of Question Paper</p>

          {answerKeyBySections.length > 0 && (
            <div className={styles.answerKey}>
              <h2 className={styles.answerKeyTitle}>Answer Key</h2>
              {answerKeyBySections.map(({ title, items }) => (
                <div key={title} className={styles.answerKeyGroup}>
                  <p className={styles.answerKeySection}>{title}</p>
                  {items.map((item) => (
                    <AnswerKeyRow key={item.number} item={item} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ section }: { section: GeneratedSection }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{section.title}</h2>
      <div className={styles.sectionHeaderBlock}>
        {section.subtitle && <p className={styles.sectionSubtitle}>{section.subtitle}</p>}
        {section.instruction && <p className={styles.sectionInstruction}>{section.instruction}</p>}
      </div>
      {section.questions.map((q) => (
        <QuestionRow key={q.number} question={q} />
      ))}
    </div>
  );
}

function QuestionRow({ question: q }: { question: GeneratedQuestion }) {
  const diff = DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty;
  const lines = splitLines(q.text);
  const [questionLine, ...optionLines] = lines;

  return (
    <div className={styles.questionBlock}>
      <p className={styles.question}>
        {q.number}. [{diff}] {questionLine} [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
      </p>
      {optionLines.length > 0 && (
        <div className={styles.optionsGrid}>
          {optionLines.map((opt, i) => (
            <p key={i} className={styles.optionText}>{opt}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function AnswerKeyRow({ item }: { item: AnswerKeyItem }) {
  const lines = splitLines(item.answer);
  return (
    <div className={styles.answerRow}>
      <b>{item.number}.</b>
      <div>
        {lines.map((line, i) => (
          <p key={i} style={{ margin: 0 }}>{line}</p>
        ))}
      </div>
    </div>
  );
}