import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/app/EmptyState";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { company } from "@/lib/mock/company";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — Empresa" }] }),
  component: Config,
});

function Config() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Configuración"
        description="Empresa, marca, notificaciones, integraciones y apariencia."
      />

      <Tabs defaultValue="empresa">
        <TabsList>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
          <TabsTrigger value="integraciones">Integraciones</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="mt-4 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Perfil de empresa</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Nombre" defaultValue={company.name} />
              <Field label="Industria" defaultValue={company.industry} />
              <Field label="Tamaño" defaultValue={company.size} />
              <Field label="Ubicación" defaultValue={company.location} />
              <Field label="Sitio web" defaultValue={company.website} />
            </div>
            <div className="space-y-1.5">
              <Label>Descripción pública</Label>
              <Textarea rows={3} defaultValue="Infraestructura cloud nativa para pagos en LATAM." />
            </div>
            <Button onClick={() => toast.success("Cambios guardados")}>Guardar cambios</Button>
          </Card>
        </TabsContent>

        <TabsContent value="notificaciones" className="mt-4">
          <Card className="p-6 space-y-4">
            <Row
              title="Nuevas aplicaciones"
              desc="Notificar cada vez que un candidato aplica."
              defaultOn
            />
            <Row
              title="Top match IA (90%+)"
              desc="Alerta inmediata para candidatos con match excepcional."
              defaultOn
            />
            <Row title="Resumen diario" desc="Email a las 9:00 con métricas del día." />
            <Row title="Resumen semanal" desc="Reporte ejecutivo cada lunes." defaultOn />
            <Row title="Cambios de etapa" desc="Cuando un miembro mueve a un candidato de etapa." />
          </Card>
        </TabsContent>

        <TabsContent value="integraciones" className="mt-4 space-y-3">
          {[
            { name: "Slack", desc: "Recibe alertas de candidatos en un canal.", connected: true },
            {
              name: "Google Calendar",
              desc: "Sincroniza entrevistas automáticamente.",
              connected: true,
            },
            { name: "Greenhouse", desc: "Exporta candidatos a tu ATS.", connected: false },
            { name: "LinkedIn", desc: "Publica vacantes en LinkedIn Jobs.", connected: false },
            { name: "Zapier", desc: "Conecta con +5,000 apps.", connected: false },
          ].map((i) => (
            <Card key={i.name} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{i.name}</p>
                <p className="text-xs text-muted-foreground">{i.desc}</p>
              </div>
              <Button variant={i.connected ? "outline" : "default"} size="sm">
                {i.connected ? "Conectado" : "Conectar"}
              </Button>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="apariencia" className="mt-4">
          <Card className="p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold">Tema</p>
              <p className="text-xs text-muted-foreground">Alterna entre modo oscuro y claro.</p>
            </div>
            <ThemeToggle />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} className="h-9" />
    </div>
  );
}

function Row({ title, desc, defaultOn }: { title: string; desc: string; defaultOn?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}
