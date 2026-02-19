import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 scrollbar-thin">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
