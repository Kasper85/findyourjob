import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { requireRole } from "@/lib/auth/guards";

export const Route = createFileRoute("/app")({
  component: AppLayout,
  beforeLoad: () => {
    const to = requireRole(["candidate"]);
    if (to) throw redirect({ to });
  },
});

function AppLayout() {
  const nav = useNavigate();

  useEffect(() => {
    const to = requireRole(["candidate"]);
    if (to) nav({ to });
  }, [nav]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <AppTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
