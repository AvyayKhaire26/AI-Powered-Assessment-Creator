"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AppLayout from "@/components/layout/AppLayout";
import { CreateAssignmentDTO, QuestionTypeInput } from "@/types";
import styles from "@/styles/createAssignment.module.css";

const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Answer Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False Questions",
  "Fill in the Blanks",
];

const defaultQT = (): QuestionTypeInput => ({ type: QUESTION_TYPES[0], count: 4, marks: 1 });

type FormErrors = Partial<Record<string, string>>;

export default function CreatePage() {
  const router = useRouter();
  const { create, isLoading, error, clearError } = useAssignmentStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<CreateAssignmentDTO>({
    title: "", subject: "", className: "",
    dueDate: "", questionTypes: [defaultQT()], instructions: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.className.trim()) e.className = "Class is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    else if (new Date(form.dueDate) <= new Date()) e.dueDate = "Due date must be in the future";
    form.questionTypes.forEach((q, i) => {
      if (q.count < 1) e[`count_${i}`] = "Min 1";
      if (q.marks < 1) e[`marks_${i}`] = "Min 1";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(2); };

  const handleSubmit = async () => {
    clearError();
    try {
      const assignment = await create(form);
      router.push(`/assignments/${assignment._id}`);
    } catch {
      // error already set in store
    }
  };

  const updateQT = (i: number, field: keyof QuestionTypeInput, val: string | number) =>
    setForm((f) => ({ ...f, questionTypes: f.questionTypes.map((q, idx) => idx === i ? { ...q, [field]: val } : q) }));

  const addQT = () => setForm((f) => ({ ...f, questionTypes: [...f.questionTypes, defaultQT()] }));
  const removeQT = (i: number) => setForm((f) => ({ ...f, questionTypes: f.questionTypes.filter((_, idx) => idx !== i) }));
  const stepCount = (i: number, field: "count" | "marks", delta: number) =>
    updateQT(i, field, Math.max(1, form.questionTypes[i][field] + delta));

  const totalQ = form.questionTypes.reduce((s, q) => s + q.count, 0);
  const totalM = form.questionTypes.reduce((s, q) => s + q.count * q.marks, 0);

  return (
    <AppLayout title="Assignment" showBack>
      <div className={styles.wrapper}>

        {/* ── HEADER (Responsive Desktop vs Mobile) ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            {/* Desktop Green Dot */}
            <div className={styles.greenDotWrap}>
              <span className={styles.greenDotOuter} />
              <span className={styles.greenDotInner} />
            </div>

            {/* Mobile Back Arrow */}
            <button className={styles.mobileBackBtn} onClick={() => router.back()}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#303030" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            <h1 className={styles.title}>Create Assignment</h1>
          </div>
          <p className={styles.subtitle}>Set up a new assignment for your students</p>
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>

        {step === 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div>
              <p className={styles.sectionTitle}>Assignment Details</p>
              <p className={styles.sectionSubtitle}>Basic information about your assignment</p>
            </div>

            {/* ── FILE UPLOAD ── */}
            <div
              className={styles.uploadBox}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#A9A9A9" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div style={{ textAlign: "center" }}>
                <p className={styles.uploadText}>
                  {file ? file.name : "Choose a file or drag & drop it here"}
                </p>
                <p className={styles.uploadSubText}>JPEG, PNG, PDF, upto 10MB</p>
              </div>
              <button type="button" className={styles.browseBtn} onClick={(e) => e.stopPropagation()}>
                Browse Files
              </button>
              <input
                id="fileInput" type="file" accept=".pdf,.txt,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              />
            </div>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: "rgba(94,94,94,0.8)",
              textAlign: "center", marginTop: -12,
            }}>
              Upload images of your preferred document/image
            </p>

            {/* ── DUE DATE ── */}
            <div>
              <label className={styles.fieldLabel}>Due Date</label>
              <div className={styles.dateInputWrap}>
                <input
                  type="date"
                  className={`${styles.inputRoundedDate} ${errors.dueDate ? styles.inputRoundedError : ""}`}
                  value={form.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  style={{ color: form.dueDate ? "#303030" : "#A9A9A9" }}
                />
                <div className={styles.dateInputIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V6" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 2V6" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16H18M15 13V19" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {errors.dueDate && <p className={styles.errorText}>{errors.dueDate}</p>}
            </div>

            {/* ── TITLE / SUBJECT / CLASS ── */}
            <div className={styles.grid3}>
              {[
                { key: "title", label: "Title", placeholder: "e.g. Chapter 5 Quiz" },
                { key: "subject", label: "Subject", placeholder: "e.g. Science" },
                { key: "className", label: "Class", placeholder: "e.g. 8th" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className={styles.fieldLabel}>{label}</label>
                  <input
                    className={`${styles.inputRounded} ${errors[key] ? styles.inputRoundedError : ""}`}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                  {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
                </div>
              ))}
            </div>

            {/* ── QUESTION TYPES ── */}
            <div>
              {/* Desktop Only Headers */}
              <div className={styles.desktopHeaders}>
                <div style={{ flex: 1 }}>
                  <label className={styles.fieldLabel} style={{ margin: 0 }}>Question Type</label>
                </div>
                <div style={{ width: 14 }}></div> 
                <div style={{ width: 100, textAlign: "center" }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#303030" }}>No. of Questions</span>
                </div>
                <div style={{ width: 100, textAlign: "center" }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#303030" }}>Marks</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {form.questionTypes.map((qt, i) => (
                  <div key={i} className={styles.qRow}>

                    <div className={styles.qRowTop}>
                      {/* Select Dropdown */}
                      <div className={styles.qSelectWrap}>
                        <select value={qt.type} onChange={(e) => updateQT(i, "type", e.target.value)}>
                          {QUESTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                        <svg className={styles.qSelectChevron} width="8" height="4" viewBox="0 0 8 4" fill="none">
                          <path d="M1 0.5L4 3.5L7 0.5" stroke="#303030" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>

                      {/* X Remove Button */}
                      <div style={{ width: 14, display: "flex", justifyContent: "center" }}>
                        {form.questionTypes.length > 1 && (
                          <button type="button" className={styles.removeBtn} onClick={() => removeQT(i)}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1 1L9 9M9 1L1 9" stroke="#5E5E5E" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className={styles.qRowBottom}>
                      {/* Count stepper with mobile label */}
                      <div className={styles.stepperGroup}>
                        <span className={styles.mobileLabel}>No. of Questions</span>
                        <div className={styles.stepper}>
                          <button type="button" className={styles.stepBtn} onClick={() => stepCount(i, "count", -1)}>−</button>
                          <span className={styles.stepValue}>{qt.count}</span>
                          <button type="button" className={styles.stepBtn} onClick={() => stepCount(i, "count", 1)}>+</button>
                        </div>
                      </div>

                      {/* Marks stepper with mobile label */}
                      <div className={styles.stepperGroup}>
                        <span className={styles.mobileLabel}>Marks</span>
                        <div className={styles.stepper}>
                          <button type="button" className={styles.stepBtn} onClick={() => stepCount(i, "marks", -1)}>−</button>
                          <span className={styles.stepValue}>{qt.marks}</span>
                          <button type="button" className={styles.stepBtn} onClick={() => stepCount(i, "marks", 1)}>+</button>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Add Question Type */}
              <button type="button" className={styles.addQTBtn} onClick={addQT}>
                <span className={styles.addQTCircle}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </span>
                Add Question Type
              </button>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginTop: 12 }}>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#5E5E5E" }}>
                  Total Questions : <strong style={{ color: "#303030" }}>{totalQ}</strong>
                </span>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#5E5E5E" }}>
                  Total Marks : <strong style={{ color: "#303030" }}>{totalM}</strong>
                </span>
              </div>
            </div>

            {/* ── INSTRUCTIONS ── */}
            <div>
              <label className={styles.fieldLabel}>Additional Information (For better output)</label>
              <div className={styles.textareaWrap}>
                <textarea
                  className={styles.textarea} rows={4}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  value={form.instructions} maxLength={500}
                  onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                />
                <button type="button" className={styles.micBtn} aria-label="Voice input">
                  <svg width="16.36" height="16.36" viewBox="0 0 24 24" fill="#303030" stroke="none">
                    <path d="M12 1a4 4 0 00-4 4v7a4 4 0 008 0V5a4 4 0 00-4-4z" />
                    <path d="M19 10a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.92V19H9a1 1 0 000 2h6a1 1 0 000-2h-2v-2.08A7 7 0 0019 10z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* ── STEP 2 — SUMMARY ── */
          <div className={styles.summaryCard}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: 18, color: "#303030", margin: "0 0 16px 0" }}>
              Review Assignment
            </h2>
            <div className={styles.grid2}>
              <SummaryRow label="Title" value={form.title} />
              <SummaryRow label="Subject" value={form.subject} />
              <SummaryRow label="Class" value={form.className} />
              <SummaryRow label="Due Date" value={new Date(form.dueDate).toLocaleDateString()} />
            </div>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 600, color: "#A9A9A9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Question Types
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {form.questionTypes.map((qt, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14 }}>
                  <span style={{ color: "#303030" }}>{qt.type}</span>
                  <span style={{ color: "#5E5E5E" }}>{qt.count} questions × {qt.marks} marks</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 600, paddingTop: 12, borderTop: "1px solid #E5E5E5", marginBottom: 12 }}>
              <span>Total Questions: {totalQ}</span>
              <span>Total Marks: {totalM}</span>
            </div>
            {form.instructions && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 600, color: "#A9A9A9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Instructions</p>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#303030" }}>{form.instructions}</p>
              </div>
            )}
            {file && (
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#5E5E5E" }}>📎 {file.name}</p>
            )}
            {error && (
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: "#ef4444", background: "#fef2f2", padding: "8px 16px", borderRadius: 8, marginTop: 8 }}>
                {error}
              </p>
            )}
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div className={styles.navRow}>
          <button className={styles.prevBtn} onClick={() => step === 1 ? router.back() : setStep(1)}>
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
              <path d="M7.5 1L1.5 7M1.5 7L7.5 13M1.5 7H15.5" stroke="#303030" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Previous
          </button>

          {step === 1 ? (
            <button className={styles.nextBtn} onClick={handleNext}>
              Next
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
                <path d="M9.5 1L15.5 7M15.5 7L9.5 13M15.5 7H1.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button className={styles.generateBtn} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
                  Generating...
                </>
              ) : (
                <>
                  Generate Paper
                  <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
                    <path d="M9.5 1L15.5 7M15.5 7L9.5 13M15.5 7H1.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </AppLayout>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: "#A9A9A9", margin: "0 0 2px 0" }}>{label}</p>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 500, color: "#303030", margin: 0 }}>{value}</p>
    </div>
  );
}