"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AppLayout from "@/components/layout/AppLayout";
import { CreateAssignmentDTO, QuestionTypeInput } from "@/types";

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
    // Redirect immediately — socket on [id] page handles updates
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
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h1 className="font-bold text-[var(--color-text-primary)]">Create Assignment</h1>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">Set up a new assignment for your students</p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-full mb-6">
          <div className={`h-1 bg-[var(--color-primary)] rounded-full transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            {/* File Upload */}
            <div
              className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center bg-white cursor-pointer hover:border-[var(--color-primary)] transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {file ? file.name : "Choose a file or drag & drop it here"}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">JPEG, PNG, PDF, upto 10MB</p>
              <button type="button" className="mt-3 px-4 py-1.5 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] hover:bg-gray-50">
                Browse Files
              </button>
              <input id="fileInput" type="file" accept=".pdf,.txt,.jpg,.jpeg,.png" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            </div>
            <p className="text-xs text-center text-[var(--color-text-secondary)] -mt-3">Upload images of your preferred document/image</p>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Due Date</label>
              <div className="relative">
                <input type="date"
                  className={`w-full text-sm border rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors.dueDate ? "border-red-400" : "border-[var(--color-border)]"}`}
                  value={form.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                />
              </div>
              {errors.dueDate && <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>}
            </div>

            {/* Title + Subject + Class */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: "title", label: "Title", placeholder: "e.g. Chapter 5 Quiz" },
                { key: "subject", label: "Subject", placeholder: "e.g. Science" },
                { key: "className", label: "Class", placeholder: "e.g. 8th" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">{label}</label>
                  <input
                    className={`w-full text-sm border rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${errors[key] ? "border-red-400" : "border-[var(--color-border)]"}`}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                  {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
                </div>
              ))}
            </div>

            {/* Question Types */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[var(--color-text-primary)]">Question Type</label>
                <div className="flex gap-6 text-xs font-medium text-[var(--color-text-secondary)] pr-8">
                  <span>No. of Questions</span>
                  <span>Marks</span>
                </div>
              </div>

              <div className="space-y-3">
                {form.questionTypes.map((qt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <select
                        className="w-full text-sm border border-[var(--color-border)] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] appearance-none"
                        value={qt.type}
                        onChange={(e) => updateQT(i, "type", e.target.value)}
                      >
                        {QUESTION_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>

                    {/* Count stepper */}
                    <div className="flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
                      <button type="button" onClick={() => stepCount(i, "count", -1)} className="px-3 py-2 text-[var(--color-text-secondary)] hover:bg-gray-50">−</button>
                      <span className="w-8 text-center text-sm font-medium">{qt.count}</span>
                      <button type="button" onClick={() => stepCount(i, "count", 1)} className="px-3 py-2 text-[var(--color-text-secondary)] hover:bg-gray-50">+</button>
                    </div>

                    {/* Marks stepper */}
                    <div className="flex items-center border border-[var(--color-border)] rounded-xl overflow-hidden bg-white">
                      <button type="button" onClick={() => stepCount(i, "marks", -1)} className="px-3 py-2 text-[var(--color-text-secondary)] hover:bg-gray-50">−</button>
                      <span className="w-8 text-center text-sm font-medium">{qt.marks}</span>
                      <button type="button" onClick={() => stepCount(i, "marks", 1)} className="px-3 py-2 text-[var(--color-text-secondary)] hover:bg-gray-50">+</button>
                    </div>

                    {form.questionTypes.length > 1 && (
                      <button type="button" onClick={() => removeQT(i)} className="text-[var(--color-text-secondary)] hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button type="button" onClick={addQT}
                className="mt-3 flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-medium hover:text-[var(--color-primary)]">
                <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-lg leading-none">+</div>
                Add Question Type
              </button>

              <div className="mt-3 flex justify-end gap-6 text-sm text-[var(--color-text-secondary)]">
                <span>Total Questions : <strong className="text-[var(--color-text-primary)]">{totalQ}</strong></span>
                <span>Total Marks : <strong className="text-[var(--color-text-primary)]">{totalM}</strong></span>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">Additional Information (For better output)</label>
              <textarea
                className="w-full text-sm border border-[var(--color-border)] rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                rows={3}
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={form.instructions}
                maxLength={500}
                onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
              />
            </div>
          </div>
        ) : (
          /* Step 2 — Summary */
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-[var(--color-text-primary)] text-lg">Review Assignment</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <SummaryRow label="Title" value={form.title} />
              <SummaryRow label="Subject" value={form.subject} />
              <SummaryRow label="Class" value={form.className} />
              <SummaryRow label="Due Date" value={new Date(form.dueDate).toLocaleDateString()} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">Question Types</p>
              <div className="space-y-2">
                {form.questionTypes.map((qt, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-primary)]">{qt.type}</span>
                    <span className="text-[var(--color-text-secondary)]">{qt.count} questions × {qt.marks} marks</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[var(--color-border)]">
              <span>Total Questions: {totalQ}</span>
              <span>Total Marks: {totalM}</span>
            </div>
            {form.instructions && (
              <div>
                <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">Instructions</p>
                <p className="text-sm text-[var(--color-text-primary)]">{form.instructions}</p>
              </div>
            )}
            {file && <p className="text-sm text-[var(--color-text-secondary)]">📎 {file.name}</p>}
            {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => step === 1 ? router.back() : setStep(1)}
            className="flex items-center gap-2 px-5 py-2.5 border border-[var(--color-border)] rounded-full text-sm font-medium text-[var(--color-text-primary)] hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          {step === 1 ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cta-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-cta-black-hover)] transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
              ) : "Generate Paper →"}
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
      <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
      <p className="font-medium text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}