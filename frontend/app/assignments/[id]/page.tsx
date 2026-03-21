"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import OutputPage from "@/components/output/OutputPage";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useSocket } from "@/hooks/useSocket";

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { current, fetchById, regenerate, requestPdf, isLoading, error } = useAssignmentStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  useEffect(() => {
    fetchById(id);
  }, [id]);

  useSocket(id, {
    "paper:ready": async () => {
      await fetchById(id);
      setSocketError(null);
    },
    "paper:failed": ({ reason }) => {
      setSocketError(reason ?? "Generation failed. Please try again.");
    },
    "pdf:ready": ({ pdfUrl }) => {
      setPdfUrl(pdfUrl);
      setPdfLoading(false);
    },
  });

  const handleRegenerate = async () => {
    setSocketError(null);
    setPdfUrl(null);
    await regenerate(id);
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    await requestPdf(id);
  };

  const assignment = current?._id === id ? current : null;
  const isCompleted = assignment?.status === "completed" && assignment?.result;
  const isFailed = assignment?.status === "failed" || !!socketError;
  const isPending = !isCompleted && !isFailed;

  return (
    <AppLayout
      title="Assignment"
      showBack
      isOutputPage={!!isCompleted}
      onCreateNew={() => router.push("/assignments/create")}
    >
      {isPending && !isFailed ? (
        <GeneratingState />
      ) : isFailed ? (
        <FailedState
          reason={socketError ?? error ?? "Unknown error"}
          onRetry={handleRegenerate}
          isLoading={isLoading}
        />
      ) : (
        <OutputPage
          assignment={assignment!}
          pdfUrl={pdfUrl}
          pdfLoading={pdfLoading}
          onRegenerate={handleRegenerate}
          onDownloadPdf={handleDownloadPdf}
          isRegenerating={isLoading}
        />
      )}
    </AppLayout>
  );
}

function GeneratingState() {
  const steps = [
    "Analysing your material…",
    "Structuring question sections…",
    "Generating questions with AI…",
    "Assigning difficulty levels…",
    "Finalising your paper…",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[var(--color-primary)] opacity-10 animate-pulse" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Generating your paper</h2>
        <p className="text-sm text-[var(--color-text-secondary)] transition-all duration-500">{steps[step]}</p>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] max-w-xs">
        This usually takes 15–30 seconds. You'll be notified as soon as it's ready.
      </p>
    </div>
  );
}

function FailedState({
  reason,
  onRetry,
  isLoading,
}: {
  reason: string;
  onRetry: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">Generation Failed</h2>
        <p className="text-sm text-red-500 max-w-sm">{reason}</p>
      </div>
      <button
        onClick={onRetry}
        disabled={isLoading}
        className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-primary-hover)] disabled:opacity-60 transition-colors"
      >
        {isLoading ? "Retrying…" : "Try Again"}
      </button>
    </div>
  );
}
