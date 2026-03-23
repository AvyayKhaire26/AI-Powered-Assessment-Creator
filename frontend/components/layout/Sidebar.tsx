"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/sidebar.module.css";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "My Groups", href: "/groups", icon: GroupsIcon },
  { label: "Assignments", href: "/assignments", icon: AssignmentsIcon },
  { label: "AI Teacher's Toolkit", href: "/toolkit", icon: ToolkitIcon },
  { label: "My Library", href: "/library", icon: LibraryIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.inner}>

        {/* ── LOGO ── */}
        <div className={styles.logoSection}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={styles.logoIcon}>
              <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>V</span>
            </div>
            <span className={styles.logoText}>VedaAI</span>
          </div>
        </div>

        {/* ── CREATE BUTTON ── */}
        <div className={styles.createWrap}>
          <Link href="/assignments/create" className={styles.createBtn}>

            {/* Gradient border ring (Original Styles) */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: -3,
                borderRadius: 100,
                padding: 3,
                background: "linear-gradient(180deg, #FF7950 0%, #C0350A 100%)",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />

            {/* Two-Star Icon */}
            <svg 
              width="22" 
              height="22" 
              viewBox="0 0 24 24" 
              fill="white" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7 6L9 11L14 13L9 15L7 20L5 15L0 13L5 11L7 6Z" />
              <path d="M18 2L19.2 5.5L23 7L19.2 8.5L18 12L16.8 8.5L13 7L16.8 5.5L18 2Z" />
            </svg>

            Create Assignment
          </Link>
        </div>


        {/* ── NAV ITEMS ── */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/assignments"
                ? pathname.startsWith("/assignments")
                : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <item.icon active={active} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── BOTTOM ── */}
        <div className={styles.bottom}>
          {/* Settings */}
          <Link
            href="/settings"
            className={styles.navItem}
            style={{ marginTop: 8 }}
          >
            <SettingsIcon active={false} />
            Settings
          </Link>

          {/* School Card */}
          <div className={styles.schoolCard}>
            <div className={styles.schoolAvatar}>
              <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>D</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p className={styles.schoolName}>Delhi Public School</p>
              <p className={styles.schoolSub}>Bokaro Steel City</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Icons (Matched Exactly to Figma Specs) ───────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </svg>
  );
}

function GroupsIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mask to cut out the person pointing from the solid rectangle */}
      <mask id="teacher-mask">
        <rect width="24" height="24" fill="white" />
        <circle cx="7" cy="11" r="2.5" fill="black" />
        <path d="M2.5 19 C 2.5 15 5 14.5 7 14.5 C 8.5 14.5 10 15 11 13.5 L 14 10" stroke="black" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </mask>
      <rect x="2" y="5" width="20" height="14" rx="2.5" fill={color} mask="url(#teacher-mask)" />
    </svg>
  );
}

function AssignmentsIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="8" y="3" width="8" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11h8M8 15h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolkitIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <rect x="6" y="3" width="12" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 17h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      {/* Draws the exact 3/4 pie-chart outline matching your image */}
      <path d="M12 2v10H2a10 10 0 1 0 10-10z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  const color = active ? "#1A1A1A" : "#8A8A8E";
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}