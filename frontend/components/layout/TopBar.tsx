"use client";
import { useRouter } from "next/navigation";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  isOutputPage?: boolean;
  onCreateNew?: () => void;
}

export default function TopBar({ title, showBack = false, isOutputPage = false, onCreateNew }: TopBarProps) {
  const router = useRouter();

  return (
    <header
      style={{
        width: "100%",
        height: 56,
        background: "var(--color-topbar)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      {/* ── LEFT SIDE ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Back Arrow */}
        {showBack && (
          isOutputPage ? (
            // White circle back button for output page
            <button
              onClick={() => router.push("/")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 100,
                background: "white",
                border: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#303030" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          ) : (
            // Plain arrow for normal pages
            <button
              onClick={() => router.push("/")}
              style={{
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#303030" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          )
        )}

        {/* Box icon + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            border: "2px solid #A9A9A9",
            borderRadius: 8,
            padding: "4px 10px",
          }}
        >
          {/* Box/grid icon — 20x20 */}
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#A9A9A9" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              fontSize: 16,
              lineHeight: "100%",
              letterSpacing: "-0.04em",
              color: "#A9A9A9",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* ── RIGHT SIDE ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        {/* Output page: Create New button with stars */}
        {isOutputPage && (
          <button
            onClick={onCreateNew}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: 36,
              padding: "0 20px",
              background: "#272727",
              borderRadius: 100,
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "white",
              border: "none",
              cursor: "pointer",
              boxShadow: `
                0px 0px 34.5px 0px rgba(255,255,255,0.25) inset,
                0px -1px 3.5px 0px rgba(177,177,177,0.6) inset
              `,
            }}
          >
            {/* Gradient border */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: -2,
                borderRadius: 100,
                padding: 2,
                background: "linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              }}
            />
            {/* Stars top-right */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: -5,
                right: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
                pointerEvents: "none",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                <path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 21 12 17.77 7.82 21 9 14.14l-5-4.87 5.91-.91z" />
              </svg>
              <svg width="6" height="6" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" style={{ marginRight: 3 }}>
                <path d="M12 2l2.09 6.26L20 9.27l-5 4.87L16.18 21 12 17.77 7.82 21 9 14.14l-5-4.87 5.91-.91z" />
              </svg>
            </span>
            <span style={{ fontSize: 16 }}>+</span>
            Create New
          </button>
        )}

        {/* Bell — 36x36 */}
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--color-text-secondary)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              background: "var(--color-primary)",
              borderRadius: "50%",
            }}
          />
        </button>

        {/* User — 157x44 hug */}
        <div
          style={{
            height: 44,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 12px",
            borderRadius: 100,
            border: "1px solid var(--color-border)",
            cursor: "pointer",
            background: "white",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "white", fontWeight: 700, fontSize: 12 }}>J</span>
          </div>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            John Doe
          </span>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--color-text-secondary)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

      </div>
    </header>
  );
}
