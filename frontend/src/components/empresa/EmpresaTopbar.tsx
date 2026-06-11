import { Bell, Search, Plus } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, clearAuthSession } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

export function EmpresaTopbar() {
  const nav = useNavigate();
  const user = getCurrentUser<User>();
  function handleLogout() { clearAuthSession(); nav({ to: "/auth/login" }); }

  return (
    <header className="h-14 sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur flex items-center gap-3 px-3 sm:px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar candidatos, vacantes, skills…" className="pl-8 h-9 bg-muted/40 border-border" />
      </div>
      <div className="flex-1 sm:hidden" />
      <Button asChild size="sm" className="hidden md:inline-flex"><Link to="/empresa/vacantes/nueva"><Plus className="h-3.5 w-3.5 mr-1" /> Nueva vacante</Link></Button>
      <ThemeToggle />
      <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones"><Bell className="h-4 w-4" /><span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" /></Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
              {user?.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() ?? "U"}
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.name?.split(" ")[0] ?? "Usuario"}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel><div className="flex flex-col"><span className="text-sm">{user?.name ?? "Usuario"}</span><span className="text-xs text-muted-foreground">{user?.email ?? ""}</span></div></DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild><Link to="/empresa/configuracion">Configuración</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link to="/empresa/facturacion">Facturación</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-between"><span>Plan</span><Badge variant="outline" className="font-mono text-[10px]">FREE</Badge></DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
