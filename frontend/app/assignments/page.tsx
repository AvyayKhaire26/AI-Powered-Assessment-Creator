"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/assignments/EmptyState";
import { Assignment } from "@/types";

export default function AssignmentsPage() {
  const { assignments, isLoading, fetchAll, remove } = useAssignmentStore();
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { fetchAll(); }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Assignment">
      {isLoading && assignments.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Assignments</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">Manage and create assignments for your classes.</p>
          </div>

          {/* Filter + Search */}
          <div className="flex gap-3 mb-5">
            <button className="flex items-center gap-2 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-secondary)] bg-white hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6" />
              </svg>
              Filter By
            </button>
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                className="w-full pl-9 pr-4 py-2 border border-[var(--color-border)] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="Search Assignment"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
            {filtered.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                isMenuOpen={openMenu === a._id}
                onMenuToggle={() => setOpenMenu(openMenu === a._id ? null : a._id)}
                onView={() => router.push(`/assignments/${a._id}`)}
                onDelete={() => { remove(a._id); setOpenMenu(null); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* FAB — always visible when assignments exist */}
      {assignments.length > 0 && (
        <Link
          href="/assignments/create"
          className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex items-center gap-2 px-5 py-3 bg-[var(--color-cta-black)] text-white rounded-full text-sm font-medium shadow-lg hover:bg-[var(--color-cta-black-hover)] transition-colors z-40"
        >
          <span className="text-lg leading-none">+</span> Create Assignment
        </Link>
      )}
    </AppLayout>
  );
}

// ── Card with 3-dot menu ─────────────────────────────────────────────────────
function AssignmentCard({ assignment: a, isMenuOpen, onMenuToggle, onView, onDelete }: {
  assignment: Assignment;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onMenuToggle();
    };
    if (isMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen]);

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 hover:shadow-sm transition-shadow relative">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-[var(--color-text-primary)]">{a.title}</h3>
        <div ref={ref} className="relative">
          <button onClick={onMenuToggle} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-white border border-[var(--color-border)] rounded-xl shadow-lg z-10 overflow-hidden min-w-[160px]">
              <button onClick={onView} className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text-primary)] hover:bg-gray-50">
                View Assignment
              </button>
              <button onClick={onDelete} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-[var(--color-text-secondary)]">
        <span>Assigned on : {new Date(a.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-")}</span>
        <span>Due : {new Date(a.dueDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</span>
      </div>
    </div>
  );
}
