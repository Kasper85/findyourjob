import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Briefcase,
  Inbox,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  Bell,
  Settings,
  Activity,
  Radar,
  Sparkles,
  Cpu,
  ShoppingBag,
  ShieldCheck,
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
import { user } from "@/lib/mock/data";

const main = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Perfil", url: "/app/perfil", icon: UserCircle },
  { title: "CV Inteligente", url: "/app/cv", icon: FileText },
];
const intelligence = [
  { title: "Empleabilidad IA", url: "/app/empleabilidad", icon: Activity },
  { title: "Mapa de Skills", url: "/app/skills", icon: Radar },
  { title: "Explicabilidad Match", url: "/app/match", icon: Sparkles },
  { title: "Zero Trust", url: "/app/verificacion", icon: ShieldCheck },
];
const work = [
  { title: "Vacantes", url: "/app/vacantes", icon: Briefcase },
  { title: "Postulaciones", url: "/app/postulaciones", icon: Inbox },
  { title: "Entrevistas", url: "/app/entrevistas", icon: Calendar },
];
const growth = [
  { title: "Edge AI Challenges", url: "/app/challenges", icon: Cpu },
  { title: "Evaluaciones", url: "/app/evaluaciones", icon: GraduationCap },
  { title: "Certificaciones", url: "/app/certificaciones", icon: Award },
  { title: "Catálogo certs", url: "/app/certificaciones/catalogo", icon: ShoppingBag },
  { title: "Aprendizaje", url: "/app/aprendizaje", icon: ShoppingBag },
  { title: "Learning Path", url: "/app/learning", icon: BookOpen },
];
const system = [
  { title: "Notificaciones", url: "/app/notificaciones", icon: Bell },
  { title: "Configuración", url: "/app/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center h-12 px-2">
          <Logo showText={!collapsed} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Group label="Principal" items={main} collapsed={collapsed} pathname={pathname} />
        <Group
          label="Inteligencia IA"
          items={intelligence}
          collapsed={collapsed}
          pathname={pathname}
        />
        <Group label="Empleabilidad" items={work} collapsed={collapsed} pathname={pathname} />
        <Group label="Crecimiento" items={growth} collapsed={collapsed} pathname={pathname} />
        <Group label="Cuenta" items={system} collapsed={collapsed} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold flex-none">
            DR
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.title}</p>
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
