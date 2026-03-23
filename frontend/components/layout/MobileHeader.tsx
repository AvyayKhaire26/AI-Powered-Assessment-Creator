"use client";
import Link from "next/link";

interface Props {
  title?: string;
  showBack?: boolean;
}

export default function MobileHeader({ title, showBack }: Props) {
  return (
    <div style={{ padding: "12px 16px 0 16px", zIndex: 40, flexShrink: 0 }}>
      <header
        className="md:hidden flex items-center justify-between"
        style={{
          width: "100%",
          height: "60px",
          background: "#FFFFFF",
          borderRadius: "16px",
          padding: "0 16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          boxSizing: "border-box",
        }}
      >
        {/* ── LEFT: VedaAI Brand (Always Visible) ── */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <div
            className="flex items-center justify-center rounded-[10px]"
            style={{ width: 32, height: 32, background: "#272727" }}
          >
            <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>V</span>
          </div>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "-0.05em",
              color: "#1A1A1A",
            }}
          >
            VedaAI
          </span>
        </Link>

        {/* ── RIGHT: Bell, Avatar, Hamburger ── */}
        <div className="flex items-center gap-3">
          
          {/* Bell Icon */}
          <button className="relative flex items-center justify-center" style={{ width: 34, height: 34, background: "#F8F8F8", borderRadius: "50%", border: "none" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#303030" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 7,
                height: 7,
                background: "#FF5C35",
                borderRadius: "50%",
                border: "1.5px solid #F8F8F8",
              }}
            />
          </button>

          {/* Avatar Profile */}
          <div
            className="flex items-center justify-center rounded-full overflow-hidden bg-[#E5E5E5]"
            style={{ width: 34, height: 34 }}
          >
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=fcd34d" 
              alt="User" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Hamburger Menu */}
          <button className="flex flex-col justify-center gap-[4px] p-1 ml-1 bg-transparent border-none">
            <span className="block w-5 h-[2px] bg-[#1A1A1A] rounded" />
            <span className="block w-5 h-[2px] bg-[#1A1A1A] rounded" />
            <span className="block w-5 h-[2px] bg-[#1A1A1A] rounded" />
          </button>
        </div>
      </header>
    </div>
  );
}