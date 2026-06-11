import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { EmpresaSidebar } from "@/components/empresa/EmpresaSidebar";
import { EmpresaTopbar } from "@/components/empresa/EmpresaTopbar";
import { requireRole } from "@/lib/auth/guards";

export const Route = createFileRoute("/empresa")({
  component: EmpresaLayout,
  beforeLoad: () => {
    const to = requireRole(["recruiter", "admin"]);
    if (to) throw redirect({ to });
  },
});

function EmpresaLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <EmpresaSidebar />
        <SidebarInset className="flex flex-col min-w-0">
          <EmpresaTopbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
