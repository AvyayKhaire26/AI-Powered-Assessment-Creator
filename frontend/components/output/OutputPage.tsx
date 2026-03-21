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

  return (
    <div className={styles.pageBg}>
      <div className={styles.paperWrapper}>

        {/* BLACK BANNER */}
        <div className={styles.topBanner}>
          <p className={styles.bannerText}>
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {pdfUrl ? (
              <a href={pdfUrl} target="_blank" rel="noreferrer" className={styles.downloadBtn}>
                <span className={styles.downloadIcon}>⬇</span>
                Download PDF
              </a>
            ) : (
              <button
                className={styles.downloadBtn}
                onClick={onDownloadPdf}
                disabled={pdfLoading}
              >
                <span className={styles.downloadIcon}>⬇</span>
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

        {/* PAPER */}
        <div className={styles.paperContainer}>

          {/* HEADER */}
          <h1 className={styles.schoolName}>{paper.school}</h1>
          <p className={styles.subject}>Subject: {paper.subject}</p>
          <p className={styles.className}>Class: {paper.className}</p>

          {/* TIME + MARKS */}
          <div className={styles.timeMarksRow}>
            <span>{paper.timeAllowed ? `Time Allowed: ${paper.timeAllowed}` : ""}</span>
            <span>Maximum Marks: {paper.totalMarks}</span>
          </div>

          {/* STUDENT INFO */}
          <div className={styles.studentInfo}>
            <div className={styles.infoLine}><span>Name:</span><div className={styles.line}></div></div>
            <div className={styles.infoLine}><span>Roll Number:</span><div className={styles.line}></div></div>
            <div className={styles.infoLine}><span>Class:</span><div className={styles.line}></div></div>
          </div>

          {/* SECTIONS */}
          {paper.sections.map((section, i) => (
            <SectionBlock key={i} section={section} />
          ))}

          <p className={styles.endLine}>End of Question Paper</p>

          {/* ANSWER KEY */}
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
        [{diff}] {questionLine} [{q.marks} {q.marks === 1 ? "Mark" : "Marks"}]
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
