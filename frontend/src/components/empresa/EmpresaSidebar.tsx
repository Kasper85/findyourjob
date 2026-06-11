import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Calendar,
  BarChart3,
  UsersRound,
  CreditCard,
  Settings,
  Building2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { company } from "@/lib/mock/company";
import { Badge } from "@/components/ui/badge";

const hiring = [
  { title: "Dashboard", url: "/empresa/dashboard", icon: LayoutDashboard },
  { title: "Vacantes", url: "/empresa/vacantes", icon: Briefcase },
  { title: "Buscar talento", url: "/empresa/talento", icon: Users },
  { title: "Talent Pool", url: "/empresa/talent-pool", icon: Sparkles },
  { title: "Entrevistas", url: "/empresa/entrevistas", icon: Calendar },
];
const insights = [
  { title: "Analítica", url: "/empresa/analitica", icon: BarChart3 },
  { title: "ROI", url: "/empresa/roi", icon: TrendingUp },
];
const org = [
  { title: "Equipo", url: "/empresa/equipo", icon: UsersRound },
  { title: "Facturación", url: "/empresa/facturacion", icon: CreditCard },
  { title: "Configuración", url: "/empresa/configuracion", icon: Settings },
];

export function EmpresaSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center h-12 px-2">
          <Logo showText={!collapsed} />
        </div>
        {!collapsed && (
          <div className="px-2 pb-2">
            <Badge
              variant="outline"
              className="font-mono text-[10px] border-primary/40 text-primary bg-primary/10"
            >
              <Building2 className="h-3 w-3 mr-1" /> Empresa
            </Badge>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <Group label="Reclutamiento" items={hiring} collapsed={collapsed} pathname={pathname} />
        <Group label="Insights" items={insights} collapsed={collapsed} pathname={pathname} />
        <Group label="Organización" items={org} collapsed={collapsed} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center text-xs font-bold flex-none font-mono">
            {company.logo}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{company.name}</p>
              <p className="text-xs text-muted-foreground truncate">Plan {company.plan}</p>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function Group({
  label,
  items,
  collapsed,
  pathname,
}: {
  label: string;
  items: { title: string; url: string; icon: any }[];
  collapsed: boolean;
  pathname: string;
}) {
  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((it) => {
            const active = pathname === it.url || pathname.startsWith(it.url + "/");
            return (
              <SidebarMenuItem key={it.url}>
                <SidebarMenuButton asChild isActive={active} tooltip={it.title}>
                  <Link to={it.url} className="flex items-center gap-2">
                    <it.icon className="h-4 w-4" />
                    {!collapsed && <span>{it.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
