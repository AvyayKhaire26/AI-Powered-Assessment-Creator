import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import MobileHeader from "./MobileHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
  isOutputPage?: boolean;
  onCreateNew?: () => void;
}

export default function AppLayout({ children, title, showBack, isOutputPage, onCreateNew }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F3F4F6]">

      <aside className="hidden md:flex">
        <Sidebar />
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden">
        <MobileHeader title={title} showBack={showBack} />

        <div className="hidden md:block">
          <TopBar
            title={title}
            showBack={showBack}
            isOutputPage={isOutputPage}
            onCreateNew={onCreateNew}
          />
        </div>

        {/* pb-32 (128px) ensures the content scrolls fully past the 72px mobile nav bar */}
        <main className="flex-1 overflow-y-auto pt-3 pb-32 md:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />

    </div>
  );
}