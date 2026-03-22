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
    <div
      style={{
        padding: "12px 16px 0 16px",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <header
        style={{
          width: "100%",
          height: 56,
          background: "#FFFFFFBF",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 24,
          paddingRight: 8, // Reduced to allow the user pill to breathe
          boxSizing: "border-box",
          gap: 10,
        }}
      >
        {/* ── LEFT SIDE ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Back Arrow */}
          {showBack && (
            <button
              onClick={() => router.push("/assignments")}
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
          )}

          {/* Grid icon + Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
            }}
          >
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
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Create New button — output page only */}
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
                marginRight: 8,
                boxShadow: `
                  0px 0px 34.5px 0px rgba(255,255,255,0.25) inset,
                  0px -1px 3.5px 0px rgba(177,177,177,0.6) inset
                `,
              }}
            >
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
              <span style={{ fontSize: 16 }}>+</span>
              Create New
            </button>
          )}

          {/* Bell Icon with soft background circle */}
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#F8F8F8", // Soft gray background circle from image
              border: "none",
              cursor: "pointer",
              position: "relative",
              marginRight: 4,
            }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#303030" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {/* Notification Dot */}
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                background: "#FF5C35", // More vibrant orange-red
                borderRadius: "50%",
                border: "1.5px solid #F8F8F8", // Cutout effect
              }}
            />
          </button>

          {/* User pill — Fixed Border & Alignment */}
          <div
            style={{
              height: 42,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "2px 14px 2px 4px", // Left padding smaller to hug the avatar
              borderRadius: 100,
              border: "1px solid #E8E8E8", // Explicit light gray border
              cursor: "pointer",
              background: "white",
              boxShadow: "0px 1px 2px rgba(0,0,0,0.02)",
            }}
          >
            {/* Avatar container */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FF782D, #FF5100)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0px 2px 4px rgba(255, 81, 0, 0.2)",
              }}
            >
              <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>J</span>
            </div>

            {/* User Name */}
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#1A1A1A",
                whiteSpace: "nowrap",
                letterSpacing: "-0.02em",
              }}
            >
              John Doe
            </span>

            {/* Chevron */}
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#666666" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
}