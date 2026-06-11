import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/EmptyState";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { user } from "@/lib/mock/data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/configuracion")({
  head: () => ({ meta: [{ title: "Configuración — Find Your Job" }] }),
  component: Settings,
});

function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader title="Configuración" />

      <Tabs defaultValue="cuenta">
        <TabsList>
          <TabsTrigger value="cuenta">Cuenta</TabsTrigger>
          <TabsTrigger value="notif">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
          <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
          <TabsTrigger value="suscripcion">Suscripción</TabsTrigger>
        </TabsList>

        <TabsContent value="cuenta" className="mt-5 space-y-4">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Información de cuenta</h3>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input defaultValue={user.email} />
            </div>
            <div className="space-y-1.5">
              <Label>Contraseña</Label>
              <Input type="password" defaultValue="•••••••••" />
            </div>
            <div className="pt-2">
              <Button>Guardar cambios</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notif" className="mt-5">
          <Card className="p-6 space-y-4">
            <Toggle
              title="Nuevas vacantes compatibles"
              desc="Cuando aparece una vacante con +80% match"
              defaultChecked
            />
            <Toggle title="Resultados de evaluaciones" defaultChecked />
            <Toggle title="Certificaciones emitidas" defaultChecked />
            <Toggle title="Mensajes de reclutadores" defaultChecked />
            <Toggle title="Resumen semanal por email" />
          </Card>
        </TabsContent>

        <TabsContent value="privacidad" className="mt-5">
          <Card className="p-6 space-y-4">
            <Toggle title="Perfil público visible para reclutadores" defaultChecked />
            <Toggle title="Permitir contacto directo" defaultChecked />
            <Toggle title="Mostrar mi nombre en credenciales públicas" defaultChecked />
            <Toggle title="Indexar perfil en buscadores" />
          </Card>
        </TabsContent>

        <TabsContent value="apariencia" className="mt-5">
          <Card className="p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Tema</p>
              <p className="text-xs text-muted-foreground">Cambia entre modo claro y oscuro</p>
            </div>
            <ThemeToggle />
          </Card>
        </TabsContent>

        <TabsContent value="suscripcion" className="mt-5 space-y-4">
          <Card className="p-6 flex items-center justify-between">
            <div>
              <Badge variant="outline" className="font-mono text-[10px]">
                FREE
              </Badge>
              <p className="mt-2 font-semibold">Plan Free</p>
              <p className="text-xs text-muted-foreground">1 evaluación/mes · vacantes públicas</p>
            </div>
            <Button>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Upgrade a Pro
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Toggle({
  title,
  desc,
  defaultChecked,
}: {
  title: string;
  desc?: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
