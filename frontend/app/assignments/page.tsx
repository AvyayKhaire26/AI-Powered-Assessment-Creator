"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/assignments/EmptyState";
import { Assignment } from "@/types";
import styles from "@/styles/assignments.module.css";

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
    <AppLayout title="Assignments" showBack>
      {isLoading && assignments.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className={styles.page}>

          {/* ── DESKTOP HEADER (Hidden on Mobile) ── */}
          <div className={styles.desktopHeaderWrap}>
            <div className={styles.header}>
              <div className={styles.greenDotWrap}>
                <span className={styles.greenDotOuter} />
                <span className={styles.greenDotInner} />
              </div>
              <h2 className={styles.title}>Assignments</h2>
            </div>
            <p className={styles.subtitle}>Manage and create assignments for your classes.</p>
          </div>

          {/* ── FILTER ROW ── */}
          <div className={styles.filterRow}>
            <button className={styles.filterBtn}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9A9A9" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M9 12h6" />
              </svg>
              Filter
            </button>
            <div className={styles.searchBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9A9A9" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                placeholder="Search Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* ── GRID (Responsive 1-col Mobile, 2-col Desktop) ── */}
          <div className={styles.grid}>
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

      {/* ── BOTTOM BLUR + FAB (Desktop Only) ── */}
      {assignments.length > 0 && (
        <div className={styles.fabWrap}>
          <Link href="/assignments/create" className={styles.fabBtn}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            Create Assignment
          </Link>
        </div>
      )}
    </AppLayout>
  );
}

// ── Card Component ───────────────────────────────────────────────────────────

function AssignmentCard({
  assignment: a,
  isMenuOpen,
  onMenuToggle,
  onView,
  onDelete,
}: {
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

  const fmt = (d: string) => {
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className={styles.card} onClick={onView}>
      <div>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{a.title}</h3>
          <div ref={ref} style={{ position: "relative" }}>
            <button
              className={styles.menuBtn}
              onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
            >
              <svg width="4" height="16" viewBox="0 0 4 16" fill="#1A1A1A">
                <circle cx="2" cy="2" r="2" />
                <circle cx="2" cy="8" r="2" />
                <circle cx="2" cy="14" r="2" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className={styles.menuDropdown}>
                <button
                  className={styles.menuItem}
                  onClick={(e) => { e.stopPropagation(); onView(); }}
                >
                  View Assignment
                </button>
                <button
                  className={`${styles.menuItem} ${styles.menuItemDelete}`}
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardDates}>
        <span>
          <span className={styles.dateLabel}>Assigned on </span>
          <span className={styles.dateValue}>: {fmt(a.createdAt)}</span>
        </span>
        <span style={{ marginLeft: "8px" }}>
          <span className={styles.dateLabel}>Due </span>
          <span className={styles.dateValue}>: {fmt(a.dueDate)}</span>
        </span>
      </div>
    </div>
  );
}