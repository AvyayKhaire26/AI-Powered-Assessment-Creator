import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  isOutputPage?: boolean;
  onCreateNew?: () => void;
}

export default function AppLayout({ children, title, showBack, isOutputPage, onCreateNew }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      <aside className="hidden md:flex">
        <Sidebar />
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar
          title={title}
          showBack={showBack}
          isOutputPage={isOutputPage}
          onCreateNew={onCreateNew}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
