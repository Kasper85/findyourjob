import { Outlet, createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { requireRole } from "@/lib/auth/guards";
import { ShieldCheck, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: () => {
    const to = requireRole(["admin"]);
    if (to) throw redirect({ to });
  },
});

function AdminLayout() {
  const nav = useNavigate();

  useEffect(() => {
    const to = requireRole(["admin"]);
    if (to) nav({ to });
  }, [nav]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <aside className="w-64 border-r bg-card p-4 flex flex-col gap-1">
          <div className="mb-6 flex items-center gap-2 px-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">Admin</span>
          </div>
          <nav className="space-y-1">
            <Link
              to="/admin/verificacion"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              <ShieldCheck className="h-4 w-4" />
              Verificación
            </Link>
          </nav>
        </aside>
        <SidebarInset className="flex flex-col min-w-0">
          <header className="border-b px-6 py-3 flex items-center justify-between">
            <h2 className="font-semibold">Panel de Administración</h2>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
