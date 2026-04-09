import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { ActivityBot } from "./ActivityBot";

export function AppLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar title={title} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
          <ActivityBot />
        </div>
      </div>
    </SidebarProvider>
  );
}
