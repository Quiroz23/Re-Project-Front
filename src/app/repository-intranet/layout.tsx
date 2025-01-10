import { RequireAuth } from "@/components/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function RepositoryLayout({ children }: Props) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="flex">
          <AppSidebar/>
          <SidebarTrigger/>
        </div>
        <main className="flex-1 h-screen w-[calc(100vw-287px)]">
          {children}
        </main>
      </SidebarProvider>
    </RequireAuth>
  );
}
