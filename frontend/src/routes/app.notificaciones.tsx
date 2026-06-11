import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/EmptyState";
import { notifications } from "@/lib/mock/data";
import { Bell, Briefcase, Award, CheckCircle2, Settings } from "lucide-react";

export const Route = createFileRoute("/app/notificaciones")({
  head: () => ({ meta: [{ title: "Notificaciones — Find Your Job" }] }),
  component: Notifs,
});

const icon: Record<string, any> = {
  vacante: Briefcase,
  certificacion: Award,
  evaluacion: CheckCircle2,
  sistema: Settings,
};

function Notifs() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Notificaciones" description="Mantente al día de tu actividad." />

      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="no-leidas">No leídas</TabsTrigger>
          <TabsTrigger value="vacantes">Vacantes</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        <TabsContent value="todas" className="mt-4">
          <List items={notifications} />
        </TabsContent>
        <TabsContent value="no-leidas" className="mt-4">
          <List items={notifications.filter((n) => !n.read)} />
        </TabsContent>
        <TabsContent value="vacantes" className="mt-4">
          <List items={notifications.filter((n) => n.type === "vacante")} />
        </TabsContent>
        <TabsContent value="sistema" className="mt-4">
          <List items={notifications.filter((n) => n.type === "sistema")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function List({ items }: { items: typeof notifications }) {
  if (items.length === 0)
    return (
      <Card className="p-10 text-center border-dashed text-muted-foreground">
        <Bell className="h-8 w-8 mx-auto mb-3 opacity-60" />
        <p>Nada por aquí.</p>
      </Card>
    );
  return (
    <Card className="divide-y divide-border">
      {items.map((n) => {
        const Icon = icon[n.type];
        return (
          <div key={n.id} className={`p-4 flex items-start gap-3 ${!n.read ? "bg-primary/5" : ""}`}>
            <div className="h-9 w-9 rounded-md bg-muted text-foreground grid place-items-center flex-none">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold truncate">{n.title}</p>
                <span className="text-[11px] text-muted-foreground font-mono flex-none">
                  {n.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{n.description}</p>
            </div>
            {!n.read && <span className="mt-2 h-2 w-2 rounded-full bg-primary flex-none" />}
          </div>
        );
      })}
    </Card>
  );
}
