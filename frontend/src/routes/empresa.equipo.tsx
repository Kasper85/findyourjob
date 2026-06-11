import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/app/EmptyState";
import { teamMembers, company } from "@/lib/mock/company";
import { UserPlus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/empresa/equipo")({
  head: () => ({ meta: [{ title: "Equipo — Empresa" }] }),
  component: Equipo,
});

function Equipo() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Equipo"
        description={`Asientos usados ${company.seats.used} de ${company.seats.total}.`}
      >
        <Button onClick={() => toast.success("Invitación enviada")}>
          <UserPlus className="h-4 w-4 mr-1" /> Invitar miembro
        </Button>
      </PageHeader>

      <Card className="p-5">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground">Invitar por email</label>
            <Input placeholder="nombre@empresa.com" className="mt-1.5 h-9" />
          </div>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            <option>Recruiter</option>
            <option>Hiring Manager</option>
            <option>Owner</option>
            <option>Viewer</option>
          </select>
          <Button onClick={() => toast.success("Invitación enviada")}>Enviar</Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Miembro</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Última actividad</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((m) => (
              <TableRow key={m.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                      {m.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-[11px] text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {m.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{m.lastActive}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
