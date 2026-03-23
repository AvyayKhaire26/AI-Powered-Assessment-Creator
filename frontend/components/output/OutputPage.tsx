"use client";
import { Assignment, GeneratedSection, GeneratedQuestion, AnswerKeyItem } from "@/types";
import styles from "@/styles/output.module.css";

interface Props {
  assignment: Assignment;
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
    .replace(/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n/g, "\\\\\\\\n")
    .replace(/\\\\\\\\\\\\\\\\n/g, "\\\\\\\\n")
    .split("\\\\\\\\n")
    .filter(Boolean);
}

export default function OutputPage({
  assignment,
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

  // Desktop specific icon (File with star)
  const FigmaPdfIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13 2H6C4.89543 2 4 2.89543 4 4V13M20 9V20C20 21.1046 19.1046 22 18 22H9.5"
        stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M13 2V9H20" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9L13 2" stroke="#303030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6 13L7.2 16.8L11 18L7.2 19.2L6 23L4.8 19.2L1 18L4.8 16.8L6 13Z"
        fill="#303030"
      />
    </svg>
  );

  return (
    <div className={styles.pageBg}>
      <div className={styles.paperWrapper}>
        <div className={styles.topBanner}>
          <p className={styles.bannerText}>
            Certainly, Lakshya! Here are customized Question Paper for your CBSE Grade 8 Science classes on the NCERT chapters:
          </p>
          <div className={styles.actionButtonsWrap}>

            {/* ── Single download button — opens PDF stream in new tab ── */}
            <button
              className={styles.downloadBtn}
              onClick={onDownloadPdf}
            >
              {/* Desktop Icon */}
              <span className={styles.desktopIcon}>{FigmaPdfIcon}</span>
              {/* Mobile Icon (Tray download) */}
              <span className={styles.mobileIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </span>
              <span className={styles.btnText}>Download as PDF</span>
            </button>

            <button
              className={styles.regenerateBtn}
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              {/* Desktop Text */}
              <span className={styles.desktopText}>{isRegenerating ? "Regenerating..." : "↺ Regenerate"}</span>
              {/* Mobile Icon */}
              <span className={styles.regenIconMobile}>
                {isRegenerating ? (
                  <div className={styles.spinner} />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                )}
              </span>
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

          <div className={styles.studentInfo}>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Name:</span>
              <span className={styles.underline}></span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Roll Number:</span>
              <span className={styles.underline}></span>
            </div>
            <div className={styles.infoLine}>
              <span className={styles.infoLabel}>Class: {paper.className} Section:</span>
              <span className={styles.underline}></span>
            </div>
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