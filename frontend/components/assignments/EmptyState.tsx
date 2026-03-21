import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 text-center pb-20 md:pb-0">
      {/* Illustration */}
      <div className="w-48 h-48 mb-6 relative">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="100" cy="100" r="70" fill="#E5E7EB" />
          <rect x="70" y="55" width="70" height="90" rx="6" fill="white" />
          <rect x="80" y="70" width="35" height="4" rx="2" fill="#D1D5DB" />
          <rect x="80" y="80" width="50" height="3" rx="1.5" fill="#E5E7EB" />
          <rect x="80" y="88" width="45" height="3" rx="1.5" fill="#E5E7EB" />
          <rect x="80" y="96" width="40" height="3" rx="1.5" fill="#E5E7EB" />
          <circle cx="115" cy="125" r="22" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
          <path d="M126 136l8 8" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
          <circle cx="113" cy="123" r="4" fill="#EF4444" />
          <path d="M110 123h6M113 120v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M75 60 Q68 55 72 48 Q78 42 82 50" stroke="#6B7280" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="148" cy="90" r="3" fill="#60A5FA" />
          <circle cx="62" cy="130" r="4" fill="#A78BFA" />
          <path d="M58 100 L63 95 L68 100" stroke="#6B7280" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
        No assignments yet
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-8 leading-relaxed">
        Create your first assignment to start collecting and grading student submissions.
        You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>
      <Link
        href="/assignments/create"
        className="flex items-center gap-2 px-6 py-3 bg-[var(--color-cta-black)] hover:bg-[var(--color-cta-black-hover)] text-white rounded-full font-medium text-sm transition-colors"
      >
        <span className="text-lg leading-none">+</span>
        Create Your First Assignment
      </Link>
    </div>
  );
}
