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

    {/* Two-Star Icon: Original Big Star + Scaled-up Small Star Top-Right */}
    <svg 
      width="22" 
      height="22" 
      viewBox="0 0 24 24" 
      fill="white" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Big Star (Original Scale/Position) */}
      <path d="M7 6L9 11L14 13L9 15L7 20L5 15L0 13L5 11L7 6Z" />
      
      {/* Small Star (Increased Size & Positioned Top-Right) */}
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

// ── Icons ──────────────────────────────────────────────────────────────────────

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75V15h-7.5v6.75H3.75A.75.75 0 013 21V9.75z" />
    </svg>
  );
}

function GroupsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

function AssignmentsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function ToolkitIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={active ? "#F97316" : "#9CA3AF"} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
